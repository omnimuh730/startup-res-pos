# Schema · Orders & Chef Tickets

POS-side orders, the items inside an order, and the chef tickets the kitchen receives once items are sent.

Source READMEs:

- `pos/Orders/README.md`
- `pos/Kitchen/README.md`
- `reservation/Dining/README.md` (live bill mirrors `orders` + `order_items`)

## Collections

| Collection | Purpose |
|---|---|
| `orders` | An open or closed table order; one per dining session. |
| `order_items` | Individual line items, including drafts not yet sent to the kitchen. |
| `chef_tickets` | A batch of items sent to the kitchen at once. |
| `chef_ticket_items` | The items inside a chef ticket (links back to `order_items`). |

The customer's "Live Bill" view is computed from `orders` + `order_items` filtered to `status != "draft"`.

---

## `orders`

```ts
type Order = {
  _id: ObjectId;
  restaurantId: ObjectId;
  floorId: ObjectId;
  tableId: ObjectId;
  reservationId?: ObjectId | null;  // present when opened from a reservation

  openedBy: ObjectId;               // staff_users
  openedAt: Date;
  closedAt?: Date | null;

  partySize?: number;
  guestUserIds: ObjectId[];         // optional: linked customer users (e.g. via QR)

  // Dual-pool totals — never mixed
  totals: {
    domestic: { amount: Decimal128; currency: string };
    foreign: { amount: Decimal128; currency: string };
  };
  itemCount: number;                // cached
  draftItemCount: number;           // cached

  // Tax + tip captured at bill time
  bill?: {
    subtotal: { amount: Decimal128; currency: string };
    taxRate: number;                // 0.0875
    tax: { amount: Decimal128; currency: string };
    tipRate?: number;               // 0.18
    tip: { amount: Decimal128; currency: string };
    total: { amount: Decimal128; currency: string };
    finalizedAt?: Date;
    finalizedBy?: ObjectId;         // staff
  };

  status:
    | "open"            // accepting drafts/sends
    | "bill_requested"  // guest tapped Request Bill
    | "bill"            // bill finalized, awaiting payment
    | "paid"            // fully paid
    | "voided";         // cancelled before payment

  paymentIds: ObjectId[];           // -> payments (mix payment may produce 2 rows)

  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ restaurantId: 1, status: 1, openedAt: -1 }`
- `{ tableId: 1, status: 1 }`
- `{ reservationId: 1 }` unique sparse
- `{ restaurantId: 1, "bill.finalizedAt": -1 }`

State diagram:

```text
open ─request_bill─▶ bill_requested ─finalize─▶ bill ─pay─▶ paid
open ─void──────────▶ voided
bill ─void──────────▶ voided   (only by manager + with audit reason)
```

Realtime channels: `order.updated`, `order.item.added`, `order.item.updated`, `order.item.voided`, `order.bill.finalized`, `order.paid`.

---

## `order_items`

```ts
type OrderItem = {
  _id: ObjectId;
  orderId: ObjectId;
  restaurantId: ObjectId;
  menuItemId: ObjectId;             // reference, but snapshot below is authoritative

  // Snapshot at order time so prices/names are stable
  snapshot: {
    name: string;
    shortName?: string;
    price: { amount: Decimal128; currency: string };
    pool: "domestic" | "foreign" | "either";
  };

  qty: number;
  modifiers: Array<{
    modifierId: ObjectId;
    name: string;
    priceDelta: { amount: Decimal128; currency: string };
  }>;

  note?: string;

  // Lifecycle for the per-item substate from POS Orders README
  status:
    | "draft"                       // entered locally, not sent
    | "sent"                        // forwarded to kitchen, ticket created
    | "in_progress"                 // chef accepted
    | "ready"                       // ticked off / served
    | "voided";                     // cancelled before/after send

  chefTicketId?: ObjectId | null;   // set when status >= "sent"

  addedBy: ObjectId;                // staff
  voidedBy?: ObjectId | null;
  voidReason?: string | null;

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ orderId: 1, status: 1 }`
- `{ chefTicketId: 1 }`
- `{ restaurantId: 1, "snapshot.name": 1 }`  // for Menu Analysis
- `{ restaurantId: 1, createdAt: -1 }`

The "Draft new items not yet sent" view in POS Orders queries `{ orderId, status: "draft" }`.

---

## `chef_tickets`

```ts
type ChefTicket = {
  _id: ObjectId;
  restaurantId: ObjectId;
  orderId: ObjectId;
  tableId: ObjectId;
  floorId: ObjectId;

  // Aggregated meta for kitchen display
  itemCount: number;                // cached
  status: "received" | "in_progress" | "completed" | "recalled";

  receivedAt: Date;
  acceptedAt?: Date;
  acceptedBy?: ObjectId;            // staff (chef)
  completedAt?: Date;
  completedBy?: ObjectId;
  recalledAt?: Date | null;
  recalledBy?: ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ restaurantId: 1, status: 1, receivedAt: -1 }`     // kitchen lanes
- `{ orderId: 1 }`
- `{ tableId: 1, status: 1 }`

State diagram:

```text
received ─accept─▶ in_progress ─complete─▶ completed ─recall─▶ in_progress
```

Realtime channels: `chef-ticket.created`, `chef-ticket.updated`.

---

## `chef_ticket_items`

```ts
type ChefTicketItem = {
  _id: ObjectId;
  chefTicketId: ObjectId;
  orderItemId: ObjectId;
  restaurantId: ObjectId;

  snapshot: {
    name: string;
    qty: number;
    note?: string;
    modifiers: Array<{ name: string }>;
  };

  status: "received" | "in_progress" | "ready" | "voided";
  tickedAt?: Date;
  tickedBy?: ObjectId;              // chef who ticked off the line

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ chefTicketId: 1, status: 1 }`
- `{ orderItemId: 1 }` unique

A ticket reaches `completed` when every line item reaches `ready`.

---

## Cross-document rules

- Sending drafts to the kitchen creates one `chef_tickets` row per send action and flips the matching `order_items.status` to `sent`. The `chef_ticket_items` rows snapshot name/qty/note so the kitchen view stays stable even if the line is later edited or voided.
- `orders.totals.domestic` and `totals.foreign` are recomputed on every item change. They never include drafts.
- An order can be opened *with or without* a reservation. When opened from a reservation QR check-in, `reservationId` is set and the matching `tables.occupancy.orderId` is set in the same transaction.
- A `voided` order leaves all `order_items` in `voided`. Refunds are issued through the `payments` flow, not by mutating order rows.
