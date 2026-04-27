# Schema · Reservations

The bridge entity between customers and restaurants. Carries both `userId` and `restaurantId` and drives the booking → arrival → dining → payment lifecycle. Invites and timeline are embedded.

Source READMEs:

- `reservation/Reservation Flow/README.md`
- `reservation/Dining/README.md`
- `pos/Floor Plan/README.md` (calendar view, reservation actions)

## Collection

| Collection | Purpose |
|---|---|
| `reservations` | A confirmed-or-pending booking. Single source of truth between the customer app and POS. |

Related catalogs (`reservation_preferences`) live in [`metadata`](./metadata.md). Table assignment and QR validation use the `tables` collection.

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
    seating: string[];              // codes from metadata.reservation_preferences
    cuisine: string[];
    vibe: string[];
    amenities: string[];
  };

  // Money
  deposit:    { amount: Decimal128; currency: string };
  serviceFee: { amount: Decimal128; currency: string };
  total:      { amount: Decimal128; currency: string };

  // Linked finance + flow
  paymentId?: ObjectId | null;      // -> payments (after capture)
  refundId?: ObjectId | null;       // -> refunds (embedded on payments[i].refunds[])

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

  // ---- Embedded: Friend invites ----
  invites: Array<{
    _id: ObjectId;
    inviteeUserId?: ObjectId;       // null for phone invites
    inviteePhone?: string;
    status: "pending" | "accepted" | "declined" | "expired";
    shareLink: string;
    invitedAt: Date;
    decidedAt?: Date;
    expiresAt: Date;
  }>;

  // ---- Embedded: Lifecycle timeline ----
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
  ratingComment?: string | null;
  pointsEarned?: number;            // mirrored from points_ledger

  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date | null;
  cancelReason?: string | null;
};
```

### Indexes

- `{ confirmationCode: 1 }` unique
- `{ userId: 1, status: 1, scheduledFor: -1 }`        // Dining tabs (Scheduled/Visited/Cancelled)
- `{ restaurantId: 1, status: 1, scheduledFor: 1 }`   // Floor Plan calendar
- `{ restaurantId: 1, scheduledFor: 1 }`
- `{ tableId: 1 }`
- `{ orderId: 1 }`
- `{ paymentId: 1 }`
- `{ status: 1, scheduledFor: 1 }`                    // background no-show sweeper
- `{ "invites.shareLink": 1 }` unique sparse (multikey)
- `{ "invites.inviteeUserId": 1, "invites.status": 1 }` (multikey)

### State diagram

```text
requested ─approve─▶ confirmed ─check-in─▶ arrived ─open order─▶ dining
requested ─decline─▶ declined (+ refund)
confirmed ─cancel─▶ cancelled (refund per policy)
confirmed ─grace elapsed─▶ no_show
dining ─request bill─▶ bill_requested ─finalize─▶ bill ─pay─▶ visited
```

### Realtime channels

- `reservation.created`
- `reservation.updated`
- `reservation.cancelled`
- `reservation.invite.updated`

---

## Cross-document rules

- The booking wizard state is maintained client-side until Step 4 succeeds; then a `reservations` row is inserted.
- A reservation moving from `requested` → `declined` triggers a refund (embedded on the parent `payments` row) and sets `refundId`.
- A reservation moving to `arrived` sets `tableId`, opens an `orders` row (`orderId`), and flips the `tables` row's `status` to `occupied`.
- A reservation that ends in `visited` triggers a points credit recorded in `points_ledger`; `pointsEarned` mirrors the credited points.
- Invite acceptance updates the matching `invites[i].status` and sends a notification to the inviter.
- Calendar conflicts on POS are enforced by the unique combination of `(tableId, scheduledFor)` plus party-size compatibility, not by the reservation document alone.
