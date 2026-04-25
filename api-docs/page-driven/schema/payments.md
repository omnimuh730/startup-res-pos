# Schema · Payments

A unified payments domain for both:

- POS Orders payments (cash, credit, mix)
- Reservation deposits paid upfront
- Customer wallet top-ups
- Subscription billing

Source READMEs:

- `pos/Orders/README.md` (Payment cash/credit/mix)
- `pos/Settings/README.md` (Restaurant deposit cards, Upgrade Plans)
- `reservation/Reservation Flow/README.md` (Step 4)
- `reservation/Dining/README.md` (Step 3 Pay)
- `reservation/Profile/README.md` (Top Up, Pro)

## Collections

| Collection | Purpose |
|---|---|
| `payment_intents` | Pre-authorized payment attempts. Created before a charge to mirror PSP intents. |
| `payments` | Captured payments. Append-only, immutable on success. |
| `refunds` | Full or partial refunds against a `payment`. |
| `customer_payment_methods` | Cards/wallets saved by customer (for Top Up and subscriptions). |
| `restaurant_deposit_cards` | Cards used by the restaurant to *receive* funds (separate from POS staff cards). |

> Note: `restaurant_deposit_cards` is the same data domain as `restaurant_payment_cards` from `restaurants.md`. The reference is kept here for finance-side queries; both names point to the same collection.

---

## `payment_intents`

```ts
type PaymentIntent = {
  _id: ObjectId;
  pspProvider: "stripe" | "toss" | "adyen" | string;
  pspIntentId: string;              // psp's id

  purpose:
    | "reservation_deposit"
    | "order_bill"
    | "wallet_top_up"
    | "subscription";

  // Polymorphic linkage; exactly one is set
  reservationId?: ObjectId;
  orderId?: ObjectId;
  topUpId?: ObjectId;
  subscriptionInvoiceId?: ObjectId;

  // Who pays
  payer: {
    kind: "customer" | "restaurant";
    customerUserId?: ObjectId;      // when kind="customer"
    restaurantId?: ObjectId;        // when kind="restaurant" (e.g. tier upgrade)
  };

  amount: { amount: Decimal128; currency: string };
  pool: "domestic" | "foreign";

  status: "requires_payment" | "processing" | "succeeded" | "failed" | "cancelled";

  selectedMethodId?: ObjectId;      // -> customer_payment_methods | restaurant_deposit_cards
  rawMethodHint?: "apple_pay" | "google_pay" | "paypal" | "bank_transfer" | "card" | "cash";

  clientSecret?: string;            // psp client secret, opaque
  failure?: { code: string; message: string };

  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
};
```

Indexes:

- `{ pspIntentId: 1 }` unique
- `{ "payer.customerUserId": 1, status: 1, createdAt: -1 }`
- `{ "payer.restaurantId": 1, status: 1, createdAt: -1 }`
- `{ reservationId: 1 }`
- `{ orderId: 1 }`
- `{ topUpId: 1 }`
- `{ status: 1, expiresAt: 1 }`

---

## `payments`

Append-only record of a successful charge. A "mix" payment in POS Orders becomes two rows that share `groupId`.

```ts
type Payment = {
  _id: ObjectId;
  groupId?: ObjectId;               // groups split payments (mix cash + credit)
  paymentIntentId?: ObjectId;       // null for cash, present for PSP-charged

  purpose:
    | "reservation_deposit"
    | "order_bill"
    | "wallet_top_up"
    | "subscription";

  reservationId?: ObjectId;
  orderId?: ObjectId;
  topUpId?: ObjectId;
  subscriptionInvoiceId?: ObjectId;

  payer: {
    kind: "customer" | "restaurant";
    customerUserId?: ObjectId;
    restaurantId?: ObjectId;
  };

  receivedBy?: ObjectId;            // staff_user when applicable

  method:
    | { kind: "cash"; tendered: { amount: Decimal128; currency: string }; change: { amount: Decimal128; currency: string } }
    | { kind: "credit"; brand: string; last4: string; pspChargeId: string }
    | { kind: "wallet"; wallet: "domestic" | "foreign" | "bonus" };

  amount: { amount: Decimal128; currency: string };
  pool: "domestic" | "foreign";

  status: "succeeded" | "voided";
  capturedAt: Date;
  voidedAt?: Date | null;
  voidReason?: string | null;

  createdAt: Date;
};
```

Indexes:

- `{ orderId: 1 }`
- `{ reservationId: 1 }`
- `{ topUpId: 1 }`
- `{ groupId: 1 }`
- `{ "payer.customerUserId": 1, capturedAt: -1 }`
- `{ "payer.restaurantId": 1, capturedAt: -1 }`
- `{ paymentIntentId: 1 }`
- `{ purpose: 1, capturedAt: -1 }`

Sample (mix):

```json
[
  {
    "_id": "pay_a",
    "groupId": "grp_1",
    "purpose": "order_bill",
    "orderId": "ord_1",
    "payer": { "kind": "customer", "customerUserId": "u1" },
    "method": { "kind": "cash", "tendered": { "amount": "300.00", "currency": "USD" }, "change": { "amount": "0.00", "currency": "USD" } },
    "amount": { "amount": "300.00", "currency": "USD" },
    "pool": "foreign",
    "status": "succeeded",
    "capturedAt": "2026-04-21T13:00:00Z"
  },
  {
    "_id": "pay_b",
    "groupId": "grp_1",
    "purpose": "order_bill",
    "orderId": "ord_1",
    "paymentIntentId": "pi_b",
    "payer": { "kind": "customer", "customerUserId": "u1" },
    "method": { "kind": "credit", "brand": "visa", "last4": "4821", "pspChargeId": "ch_..." },
    "amount": { "amount": "242.49", "currency": "USD" },
    "pool": "foreign",
    "status": "succeeded",
    "capturedAt": "2026-04-21T13:00:01Z"
  }
]
```

---

## `refunds`

```ts
type Refund = {
  _id: ObjectId;
  paymentId: ObjectId;
  amount: { amount: Decimal128; currency: string };
  reason:
    | "reservation_declined"
    | "user_cancelled"
    | "no_show_waiver"
    | "order_voided"
    | "duplicate"
    | "other";
  pspRefundId?: string;
  status: "pending" | "succeeded" | "failed";
  initiatedBy: { kind: "customer" | "staff" | "system"; id?: ObjectId };
  failure?: { code: string; message: string };
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ paymentId: 1, createdAt: -1 }`
- `{ status: 1, createdAt: -1 }`

---

## `customer_payment_methods`

Saved methods on a customer's account: card, Apple Pay, Google Pay, PayPal, bank.

```ts
type CustomerPaymentMethod = {
  _id: ObjectId;
  userId: ObjectId;

  pspProvider: string;
  pspExternalId: string;            // psp customer/method id

  kind: "card" | "apple_pay" | "google_pay" | "paypal" | "bank_account";
  card?: { brand: string; last4: string; expMonth: number; expYear: number };
  bank?: { bankName: string; last4: string };

  isDefault: boolean;
  // wallets it can fund
  fundsForeign: boolean;            // typically true for cards
  fundsDomestic: boolean;           // depends on PSP/region
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ userId: 1, isDefault: -1 }`
- `{ userId: 1, pspExternalId: 1 }` unique

---

## `restaurant_deposit_cards`

(Same physical collection as `restaurant_payment_cards` from `restaurants.md`.)

These are the cards the restaurant registered through Settings -> Security & Payments -> Add Payment Card. Customer payments to that restaurant are settled into the default deposit card.

```ts
type RestaurantDepositCard = {
  _id: ObjectId;
  restaurantId: ObjectId;
  pspProvider: string;
  pspExternalId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  registrationMode: "scan" | "type";
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ restaurantId: 1, isDefault: -1 }`
- `{ restaurantId: 1, pspExternalId: 1 }` unique

---

## Cross-document rules

- A `payments` row is created only after the PSP confirms capture. Failures stay on the `payment_intents` row.
- Mix payments (`POS Orders -> Payment(mix)`) share a `groupId` and must sum to the order total.
- A reservation refund is created from `refunds` referencing `reservations.paymentId`. The reservation status moves to `cancelled` or `declined` and `reservations.refundId` is updated.
- Wallet top-ups create a `payments` row of `purpose: "wallet_top_up"` and a matching `wallet_transactions` credit row (see `wallets.md`).
- Subscription invoices follow the same pattern; see `subscriptions.md`.
