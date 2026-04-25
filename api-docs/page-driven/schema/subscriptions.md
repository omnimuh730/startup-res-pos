# Schema · Subscriptions

Both subscription products in one collection:

- **Restaurant tier** (POS Settings → Upgrade Plans): `Free`, `Pro`, `Ultra`.
- **Customer pro** (Reservation Profile → Upgrade to Pro): `Monthly`, `Quarterly`, `Yearly`.

Plans catalog lives in [`metadata`](./metadata.md) under `_id: "subscription_plans"`. Invoices are **embedded** on the subscription doc; even a 20-year history fits well under 200 KB.

Source READMEs:

- `pos/Settings/README.md` (Upgrade Plans)
- `reservation/Profile/README.md` (CatchTable Pro)

## Collection

| Collection | Purpose |
|---|---|
| `subscriptions` | Active or historical subscription per subject (customer or restaurant). Embeds full invoice history and lifecycle history. |

---

## `subscriptions`

```ts
type Subscription = {
  _id: ObjectId;
  product: "restaurant_tier" | "catchtable_pro";

  // Subject — exactly one is set
  customerUserId?: ObjectId;
  restaurantId?: ObjectId;

  planCode: string;                 // "pro_yearly", "ultra", ... (catalog: metadata.subscription_plans)
  status: "trialing" | "active" | "past_due" | "cancelled" | "expired";

  // Billing window
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date | null;

  // Payment method
  paymentMethodRef?: {              // resolves at charge time
    kind: "customer_method" | "restaurant_deposit_card";
    methodId: ObjectId;             // -> customer_users.paymentMethods[]._id | restaurants.depositCards[]._id
  };
  pspProvider?: string;
  pspSubscriptionId?: string;

  // ---- Embedded: Invoices ----
  // One row per billing cycle. ~12/year. Bounded for the lifetime of the product.
  invoices: Array<{
    _id: ObjectId;
    periodStart: Date;
    periodEnd: Date;

    amount: { amount: Decimal128; currency: string };
    taxes?: { amount: Decimal128; currency: string };
    total:  { amount: Decimal128; currency: string };

    status: "open" | "paid" | "uncollectible" | "voided";

    paymentId?: ObjectId;           // -> payments
    walletTransactionId?: ObjectId; // -> wallet_transactions when paid from wallet

    attemptCount: number;
    nextAttemptAt?: Date;
    failure?: { code: string; message: string };

    createdAt: Date;
    updatedAt: Date;
  }>;

  // ---- Embedded: Lifecycle history ----
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

### Indexes

- `{ customerUserId: 1, product: 1, status: 1 }`
- `{ restaurantId: 1, product: 1, status: 1 }`
- `{ planCode: 1, status: 1 }`
- `{ pspSubscriptionId: 1 }` unique sparse
- `{ status: 1, currentPeriodEnd: 1 }`           // renewal cron
- `{ "invoices.status": 1, "invoices.nextAttemptAt": 1 }` (multikey, dunning worker)

### State diagram

```text
trialing ─bill ok─▶ active
active ─cancel at period end─▶ active(cancelAtPeriodEnd) ─period end─▶ cancelled/expired
active ─bill fail─▶ past_due ─dunning ok─▶ active
past_due ─dunning fail─▶ cancelled
```

### Realtime channels

- `subscription.created`
- `subscription.updated`
- `subscription.invoice.created`
- `subscription.invoice.paid`
- `subscription.invoice.failed`

---

## Cross-document rules

- A successful invoice (`invoices[i].status = "paid"`) updates `currentPeriodStart`/`currentPeriodEnd` and pushes a `renewed` history entry.
- A failed invoice retries with exponential backoff. On final failure, status becomes `uncollectible`, the subscription transitions to `past_due`, then `cancelled` if dunning fails.
- **Restaurant tier sync**: a successful subscription change writes `restaurants.tier` to match (`free` | `pro` | `ultra`). Tier-gated POS features read from `restaurants.tier`.
- **Customer pro sync**: `customer_users.subscription` mirrors the active `catchtable_pro` subscription summary (planCode, status, currentPeriodEnd, cancelAtPeriodEnd) for fast Profile reads.
- The Settings → Upgrade Plans wizard creates one subscription doc per restaurant and writes the first invoice on the same insert.
- The Profile → Upgrade to Pro wizard creates one subscription doc per customer and writes the first invoice on the same insert.
- Plan price/feature changes happen in `metadata.subscription_plans`; existing subscriptions retain their `planCode` reference and re-read the catalog at billing time.
