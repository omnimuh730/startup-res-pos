# Schema · Reservations

Customer reservations, drafts kept while the user fills the wizard, the catalog of preference chips, and table QR codes used at check-in.

Source READMEs:

- `reservation/Reservation Flow/README.md`
- `reservation/Dining/README.md`
- `pos/Floor Plan/README.md` (calendar view, reservation actions)

## Collections

| Collection | Purpose |
|---|---|
| `reservations` | A confirmed-or-pending booking. The "single source of truth" between customer app and POS. |
| `reservation_drafts` | Wizard state held while the customer is inside the booking flow. |
| `reservation_preferences_catalog` | Static catalog of seating/cuisine/vibe/amenity chips shown in Step 3. |
| `reservation_invites` | Friends invited to a reservation. |
| `table_qr_codes` | Signed QR codes printed on tables for arrival check-in. |

---

## `reservations`

```ts
type Reservation = {
  _id: ObjectId;
  restaurantId: ObjectId;
  userId: ObjectId;                 // -> customer_users

  confirmationCode: string;         // "CT-2026-0418A", unique
  source: "explorer_map" | "discover" | "dining_book_again" | "restaurant_pos" | "other";

  // Booking selection
  partySize: number;
  date: string;                     // YYYY-MM-DD in restaurant local tz
  time: string;                     // HH:mm
  scheduledFor: Date;               // computed UTC datetime
  seating?: "Indoor" | "Outdoor" | "Bar" | "Private Room" | string;

  // Captured contact (snapshot at booking time)
  contact: {
    fullName: string;
    phone: string;
  };

  // Step 2/3
  occasion: "anniversary" | "birthday" | "date_night" | "business" | "casual" | "celebration";
  specialRequests?: string;
  preferences: {
    seating: string[];              // codes from `reservation_preferences_catalog`
    cuisine: string[];
    vibe: string[];
    amenities: string[];
  };

  // Money
  deposit: { amount: Decimal128; currency: string };
  serviceFee: { amount: Decimal128; currency: string };
  total: { amount: Decimal128; currency: string };

  // Linked finance + flow
  paymentIntentId?: ObjectId;       // -> payment_intents
  paymentId?: ObjectId | null;      // -> payments (after capture)
  refundId?: ObjectId | null;       // -> refunds (if declined/cancelled)

  // Linked POS objects
  tableId?: ObjectId | null;        // assigned at check-in
  orderId?: ObjectId | null;        // POS order created on arrival

  status:
    | "requested"
    | "confirmed"
    | "declined"
    | "arrived"
    | "dining"
    | "bill_requested"
    | "bill"
    | "visited"
    | "cancelled"
    | "no_show";

  timeline: Array<{
    at: Date;
    type:
      | "requested"
      | "approved"
      | "declined"
      | "checked_in"
      | "order_opened"
      | "bill_requested"
      | "bill_finalized"
      | "paid"
      | "cancelled_by_user"
      | "cancelled_by_restaurant"
      | "no_show";
    actor?: { kind: "customer" | "staff" | "system"; id?: ObjectId };
    note?: string;
  }>;

  // Post-visit fields
  rating?: number | null;           // 0..5
  pointsEarned?: number;            // mirrored from points_ledger

  // Misc
  invitesCount: number;             // cached count from reservation_invites
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date | null;
  cancelReason?: string | null;
};
```

Indexes:

- `{ confirmationCode: 1 }` unique
- `{ userId: 1, status: 1, scheduledFor: -1 }`        // Dining Scheduled/Visited/Cancelled tabs
- `{ restaurantId: 1, status: 1, scheduledFor: 1 }`   // Floor Plan calendar
- `{ restaurantId: 1, scheduledFor: 1 }`
- `{ tableId: 1 }`
- `{ orderId: 1 }`
- `{ paymentIntentId: 1 }`
- `{ status: 1, scheduledFor: 1 }`                    // background no-show sweeper

State diagram:

```text
requested ─approve─▶ confirmed ─check-in─▶ arrived ─open order─▶ dining
requested ─decline─▶ declined (+ refund)
confirmed ─cancel─▶ cancelled (refund per policy)
confirmed ─grace elapsed─▶ no_show
dining ─request bill─▶ bill_requested ─finalize─▶ bill ─pay─▶ visited
```

Realtime channels: `reservation.created`, `reservation.updated`, `reservation.cancelled`.

Sample (Visited):

```json
{
  "_id": "65f...res",
  "restaurantId": "65aa...",
  "userId": "65f0...alex",
  "confirmationCode": "CT-2026-0328C",
  "source": "explorer_map",
  "partySize": 2,
  "date": "2026-03-28",
  "time": "20:00",
  "scheduledFor": "2026-03-28T11:00:00Z",
  "seating": "Indoor",
  "contact": { "fullName": "Alex Chen", "phone": "+1 (415) 555-0142" },
  "occasion": "celebration",
  "preferences": {
    "seating": ["window_seat"],
    "cuisine": ["italian"],
    "vibe": ["celebration"],
    "amenities": ["birthday_setup"]
  },
  "deposit": { "amount": "20.00", "currency": "USD" },
  "serviceFee": { "amount": "2.99", "currency": "USD" },
  "total": { "amount": "22.99", "currency": "USD" },
  "paymentIntentId": "65f...pi",
  "paymentId": "65f...pay",
  "tableId": "65f...t1",
  "orderId": "65f...ord",
  "status": "visited",
  "rating": 4.5,
  "pointsEarned": 120,
  "invitesCount": 0,
  "createdAt": "2026-03-15T11:00:00Z",
  "updatedAt": "2026-03-28T13:48:00Z"
}
```

---

## `reservation_drafts`

Holds the wizard state from Step 1 to Step 4 so the user can resume after closing the app, and so the server can recover from a payment-then-create-fail situation.

```ts
type ReservationDraft = {
  _id: ObjectId;
  userId: ObjectId;
  restaurantId: ObjectId;
  step: 1 | 2 | 3 | 4;

  partySize?: number;
  date?: string;
  time?: string;
  occasion?: string;
  specialRequests?: string;
  preferences?: Reservation["preferences"];
  contact?: Reservation["contact"];

  paymentIntentId?: ObjectId;       // populated on Step 4

  expiresAt: Date;                  // TTL ~ 24h
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ userId: 1, restaurantId: 1 }`
- `{ expiresAt: 1 }` TTL

---

## `reservation_preferences_catalog`

Static catalog used by Reservation Flow Step 3 chips. It mirrors the `amenities` collection (group="seating" etc.) but allows separate ordering and inclusion logic.

```ts
type ReservationPreference = {
  _id: ObjectId;
  group: "seating" | "cuisine" | "vibe" | "amenities";
  code: string;                     // "private_room"
  label: string;                    // "Private Room"
  active: boolean;
  sortOrder: number;
};
```

Indexes:

- `{ group: 1, active: 1, sortOrder: 1 }`
- `{ group: 1, code: 1 }` unique

---

## `reservation_invites`

Friends invited to a reservation; used by Dining "Invite" action and notifications.

```ts
type ReservationInvite = {
  _id: ObjectId;
  reservationId: ObjectId;
  inviterUserId: ObjectId;
  inviteeUserId?: ObjectId;         // null when invited by phone/external link
  inviteePhone?: string;
  status: "pending" | "accepted" | "declined" | "expired";
  shareLink: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ reservationId: 1 }`
- `{ inviterUserId: 1, createdAt: -1 }`
- `{ inviteeUserId: 1, status: 1 }`
- `{ shareLink: 1 }` unique

---

## `table_qr_codes`

Signed QR payloads scanned at the table. Each table can have rotating QRs to prevent replay.

```ts
type TableQrCode = {
  _id: ObjectId;
  restaurantId: ObjectId;
  tableId: ObjectId;
  payload: string;                  // signed JWT / opaque token
  payloadHash: string;              // index-friendly hash
  rotationVersion: number;
  isCurrent: boolean;
  validFrom: Date;
  validUntil?: Date | null;         // null = no auto-expiry
  createdBy?: ObjectId;
  createdAt: Date;
};
```

Indexes:

- `{ tableId: 1, isCurrent: 1 }`
- `{ payloadHash: 1 }` unique

A successful `POST /reservations/{id}:check-in` validates the scanned QR against the table referenced in `tableId`. On success:

- `reservations.status = "arrived"`
- `tables.status = "occupied"`, `tables.occupancy.reservationId = reservationId`
- a new `orders` document is created (or matched) and its `_id` is stored back in `reservations.orderId`

---

## Cross-module notes

- A reservation move from `requested` -> `declined` triggers a `refunds` row referencing `paymentId`.
- A reservation that ends in `visited` triggers a points credit recorded in `points_ledger` and mirrored as `reservations.pointsEarned`.
- Calendar conflicts on POS are enforced by the `(restaurantId, scheduledFor, partySize)` and table assignment, not by the reservation document alone.
