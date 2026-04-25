# Schema · Subscriptions & Plans

Both subscriptions in the product:

- **Restaurant tier** subscriptions (POS Settings -> Upgrade Plans): `Free`, `Pro`, `Ultra`.
- **Customer pro** subscriptions (Reservation Profile -> Upgrade to Pro): `Monthly`, `Quarterly`, `Yearly`.

Source READMEs:

- `pos/Settings/README.md` (Upgrade Plans)
- `reservation/Profile/README.md` (CatchTable Pro)

## Collections

| Collection | Purpose |
|---|---|
| `subscription_plans` | Catalog of all plans with pricing and features. |
| `subscriptions` | Active or historical subscription per subject (restaurant or customer). |
| `subscription_invoices` | Invoices generated per billing cycle. |

---

## `subscription_plans`

```ts
type SubscriptionPlan = {
  _id: ObjectId;
  product: "restaurant_tier" | "catchtable_pro";
  code: string;                     // "restaurant_pro", "pro_yearly"
  name: string;                     // "Pro", "Yearly"

  price: { amount: Decimal128; currency: string };
  billingPeriod: "month" | "quarter" | "year";
  // optional savings copy shown next to the plan, e.g. "Save 17%"
  badge?: string;
  highlight?: "best_value" | "popular" | null;

  features: Array<{
    code: string;                   // "unlimited_reservations"
    label: string;
    description?: string;
  }>;

  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ product: 1, code: 1 }` unique
- `{ product: 1, active: 1, sortOrder: 1 }`

Seed (customer Pro):

```json
[
  { "product":"catchtable_pro","code":"pro_monthly",  "name":"Monthly",  "price":{"amount":"9.99","currency":"USD"},"billingPeriod":"month","sortOrder":1,"active":true },
  { "product":"catchtable_pro","code":"pro_quarterly","name":"Quarterly","price":{"amount":"24.99","currency":"USD"},"billingPeriod":"quarter","badge":"Save 17%","sortOrder":2,"active":true },
  { "product":"catchtable_pro","code":"pro_yearly",   "name":"Yearly",   "price":{"amount":"79.99","currency":"USD"},"billingPeriod":"year","badge":"Save 33%","highlight":"best_value","sortOrder":3,"active":true }
]
```

Seed (restaurant tier):

```json
[
  { "product":"restaurant_tier","code":"free", "name":"Free", "price":{"amount":"0","currency":"USD"},"billingPeriod":"month","active":true,"sortOrder":1 },
  { "product":"restaurant_tier","code":"pro",  "name":"Pro",  "price":{"amount":"49","currency":"USD"},"billingPeriod":"month","active":true,"sortOrder":2 },
  { "product":"restaurant_tier","code":"ultra","name":"Ultra","price":{"amount":"129","currency":"USD"},"billingPeriod":"month","active":true,"sortOrder":3 }
]
```

---

## `subscriptions`

```ts
type Subscription = {
  _id: ObjectId;
  product: "restaurant_tier" | "catchtable_pro";

  // Subject — exactly one is set
  customerUserId?: ObjectId;
  restaurantId?: ObjectId;

  planId: ObjectId;                 // -> subscription_plans
  planCode: string;                 // denormalized
  status: "trialing" | "active" | "past_due" | "cancelled" | "expired";

  // Billing window
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date | null;

  // Payment
  paymentMethodId?: ObjectId;       // -> customer_payment_methods | restaurant_deposit_cards
  pspProvider?: string;
  pspSubscriptionId?: string;

  // Audit / lifecycle
  history: Array<{
    at: Date;
    type: "created" | "renewed" | "upgraded" | "downgraded" | "cancelled" | "reactivated" | "payment_failed";
    fromPlan?: string;
    toPlan?: string;
    actor?: { kind: "customer" | "staff" | "system"; id?: ObjectId };
    note?: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ customerUserId: 1, product: 1, status: 1 }`
- `{ restaurantId: 1, product: 1, status: 1 }`
- `{ planCode: 1, status: 1 }`
- `{ pspSubscriptionId: 1 }` unique sparse
- `{ status: 1, currentPeriodEnd: 1 }`     // renewal cron

State diagram:

```text
trialing ─bill ok─▶ active
active ─cancel at period end─▶ active(cancelAtPeriodEnd) ─period end─▶ cancelled/expired
active ─bill fail─▶ past_due ─dunning ok─▶ active
past_due ─dunning fail─▶ cancelled
```

Effect of restaurant tier change on POS:

- Updating `subscriptions` triggers a sync to `restaurants.tier`.
- Tier-gated features (e.g. analytics, advanced settings) read from `restaurants.tier`.

---

## `subscription_invoices`

One row per billing period. Drives the `subscription_charge` debit on customer wallets or PSP charges on the saved card.

```ts
type SubscriptionInvoice = {
  _id: ObjectId;
  subscriptionId: ObjectId;
  product: "restaurant_tier" | "catchtable_pro";

  // Subject
  customerUserId?: ObjectId;
  restaurantId?: ObjectId;

  periodStart: Date;
  periodEnd: Date;

  amount: { amount: Decimal128; currency: string };
  taxes?: { amount: Decimal128; currency: string };
  total: { amount: Decimal128; currency: string };

  status: "open" | "paid" | "uncollectible" | "voided";

  paymentIntentId?: ObjectId;       // -> payment_intents
  paymentId?: ObjectId;             // -> payments
  walletTransactionId?: ObjectId;   // -> wallet_transactions when paid from wallet

  attemptCount: number;
  nextAttemptAt?: Date;
  failure?: { code: string; message: string };

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ subscriptionId: 1, periodStart: -1 }`
- `{ status: 1, nextAttemptAt: 1 }`
- `{ paymentIntentId: 1 }`

---

## Cross-document rules

- A successful `subscription_invoices.status = "paid"` insert updates the parent `subscriptions.currentPeriodEnd` and writes a `history` entry of type `renewed`.
- A failed invoice retries with exponential backoff. On final failure, status becomes `uncollectible` and the subscription transitions to `past_due` then `cancelled`.
- The Restaurant Settings UI shows the current tier and plan price by joining `restaurants.tier` -> `subscription_plans` (where `product = "restaurant_tier"` and `code = restaurants.tier`).
- The Customer Profile shows Pro state by checking `subscriptions` of `product = "catchtable_pro"` with `status in {active, trialing}`.
