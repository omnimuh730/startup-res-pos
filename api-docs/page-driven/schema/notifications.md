# Schema · Notifications & Push Tokens

In-app notification feed (top-right bell), and the registered device tokens used for push delivery to either the customer or the staff app.

Source READMEs:

- `reservation/Discover/README.md` (Notifications)
- `reservation/Auth/README.md` (Push/realtime cross-cutting)
- `pos/Auth/README.md`, `pos/Floor Plan/README.md`, `pos/Kitchen/README.md` (server pushes to staff devices)

## Collections

| Collection | Purpose |
|---|---|
| `notifications` | One row per delivered in-app notification. |
| `push_tokens` | Device push tokens for FCM/APNs/web-push. |

---

## `notifications`

```ts
type Notification = {
  _id: ObjectId;

  // Recipient — exactly one of customerUserId or staffUserId is set
  recipientKind: "customer" | "staff";
  customerUserId?: ObjectId;
  staffUserId?: ObjectId;
  restaurantId?: ObjectId;          // present for staff or for tenant-scoped customer notifications

  type:
    // customer
    | "reservation_requested"
    | "reservation_confirmed"
    | "reservation_declined"
    | "reservation_reminder"
    | "table_ready"
    | "bill_finalized"
    | "payment_succeeded"
    | "payment_failed"
    | "review_reply"
    | "flash_deal"
    | "weekly_picks"
    | "you_earned_points"
    | "gift_received"
    | "friend_request"
    // staff
    | "new_reservation"
    | "reservation_cancelled"
    | "new_order"
    | "order_ready_for_payment"
    | "chef_ticket_received"
    | "subscription_renewal"
    | "staff_join_request"
    | string;

  title: string;                    // "Reservation Confirmed"
  body: string;                     // human readable line shown in the feed
  iconHint?: string;                // "R", "P", "W"...

  target?: {
    kind: "reservation" | "order" | "wallet" | "support" | "restaurant" | "deal" | "friend_request" | string;
    id?: ObjectId;
    deepLink?: string;
  };

  read: boolean;
  readAt?: Date | null;
  // soft delete via "Remove all" or per-row trash
  deletedAt?: Date | null;

  // Delivery
  deliveredChannels: Array<"in_app" | "push" | "email" | "sms">;
  pushDelivery?: {
    sentAt?: Date;
    pushTokens: ObjectId[];         // -> push_tokens
    failures?: Array<{ tokenId: ObjectId; reason: string }>;
  };

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ customerUserId: 1, deletedAt: 1, createdAt: -1 }`
- `{ staffUserId: 1, deletedAt: 1, createdAt: -1 }`
- `{ customerUserId: 1, read: 1 }`        // unread count badge
- `{ staffUserId: 1, read: 1 }`
- `{ restaurantId: 1, type: 1, createdAt: -1 }`
- `{ "target.kind": 1, "target.id": 1 }`

Behavior:

- The Notifications page tabs (`All`, `Unread (5)`, `Read`) are filters on `read` and `deletedAt`.
- `Mark all read` writes `{ read: true, readAt: now }` for the current user's unread rows.
- `Remove all` writes `{ deletedAt: now }`; we do not hard-delete so analytics can audit delivery rate.
- Tapping a notification routes by `target` and patches `read = true`.

Sample (customer):

```json
{
  "_id": "n1",
  "recipientKind": "customer",
  "customerUserId": "u1",
  "type": "reservation_confirmed",
  "title": "Reservation Confirmed",
  "body": "Your table at Sakura Omakase is confirmed for Apr 18 at 7:30 PM.",
  "target": { "kind": "reservation", "id": "res_1" },
  "read": false,
  "deliveredChannels": ["in_app", "push"],
  "createdAt": "2026-04-15T...",
  "updatedAt": "2026-04-15T..."
}
```

---

## `push_tokens`

```ts
type PushToken = {
  _id: ObjectId;

  ownerKind: "customer" | "staff";
  customerUserId?: ObjectId;
  staffUserId?: ObjectId;
  restaurantId?: ObjectId;          // for staff devices

  provider: "fcm" | "apns" | "web_push";
  token: string;                    // device token
  platform: "ios" | "android" | "web";
  appVersion?: string;
  deviceModel?: string;
  deviceId?: string;
  locale?: string;

  isActive: boolean;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ token: 1 }` unique
- `{ customerUserId: 1, isActive: 1 }`
- `{ staffUserId: 1, isActive: 1 }`
- `{ restaurantId: 1, isActive: 1 }`
- `{ provider: 1, isActive: 1 }`

Behavior:

- The app registers a token on every cold start; collisions update `lastSeenAt`.
- A failed delivery with a `not_registered` error from FCM/APNs flips `isActive = false`.

---

## Cross-document rules

- The notification system is the writer; the page-readme endpoints (`POST /chef-tickets/{id}:accept`, `POST /reservations`, etc.) emit events that a worker consumes to insert `notifications` rows and to fan out to `push_tokens`.
- Unread badge counts on Discover and POS pages are computed by `count({ recipient, read: false, deletedAt: null })`.
