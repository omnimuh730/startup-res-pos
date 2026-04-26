# Schema · Notifications

In-app notification feed (top-right bell). One row per delivered notification. Push tokens are no longer their own collection — they live on `customer_users.devices[]` and `staff_users.devices[]`.

Source READMEs:

- `reservation/Discover/README.md` (Notifications page)
- `reservation/Auth/README.md` (push/realtime cross-cutting)
- `pos/Auth/README.md`, `pos/Floor Plan/README.md`, `pos/Kitchen/README.md` (server pushes to staff devices)

## Collection

| Collection | Purpose |
|---|---|
| `notifications` | One row per delivered in-app notification (customer or staff). |

Push device tokens live on the user document under `devices[]`. See [`users.md`](./users.md).

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
    | "tier_promoted"
    | "gift_received"
    | "friend_request"
    // staff
    | "new_reservation"
    | "reservation_cancelled"
    | "new_order"
    | "order_ready_for_payment"
    | "chef_batch_received"
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
    deviceIds: ObjectId[];          // -> customer_users.devices[]._id | staff_users.devices[]._id
    failures?: Array<{ deviceId: ObjectId; reason: string }>;
  };

  createdAt: Date;
  updatedAt: Date;
};
```

### Indexes

- `{ customerUserId: 1, deletedAt: 1, createdAt: -1 }`
- `{ staffUserId: 1, deletedAt: 1, createdAt: -1 }`
- `{ customerUserId: 1, read: 1 }`        // unread count badge
- `{ staffUserId: 1, read: 1 }`
- `{ restaurantId: 1, type: 1, createdAt: -1 }`
- `{ "target.kind": 1, "target.id": 1 }`

### Behavior

- The Notifications page tabs (`All`, `Unread`, `Read`) are filters on `read` and `deletedAt`.
- `Mark all read` writes `{ read: true, readAt: now }` for the current user's unread rows; `customer_users.unreadNotifications` is decremented to 0.
- `Remove all` writes `{ deletedAt: now }`; we do not hard-delete so analytics can audit delivery rate.
- Tapping a notification routes by `target` and patches `read = true` (and decrements `unreadNotifications`).
- Failed push delivery with a "not_registered" code from FCM/APNs flips the matching `customer_users.devices[i].isActive = false` (or staff equivalent).

---

## Cross-document rules

- **Writers**: page-readme endpoints (`POST /chef-tickets/{id}:accept`, `POST /reservations`, `POST /payments`, etc.) emit events that a worker consumes to insert `notifications` rows and fan out push to the device list of the recipient.
- **Unread badge** caches:
  - `customer_users.unreadNotifications` is recomputed on insert/mark-read/delete.
  - Staff equivalent lives on `staff_users` if needed (optional; computed live from a small index lookup is also acceptable).
- **Device fan-out**: the notifications worker reads `customer_users.devices[]` (or `staff_users.devices[]`) filtered to `isActive: true`, then issues PSP push calls. Failures bump `failures[]`.

## Realtime channels

- `notification.created` (per recipient)
- `notification.read` / `notification.deleted`
- `user.notifications.unreadCountChanged`
