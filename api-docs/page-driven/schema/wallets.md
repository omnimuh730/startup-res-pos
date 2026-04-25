# Schema · Wallets, Transactions, Top-Ups, Gifts

The customer-app wallet domain. Each customer has three wallets that never auto-convert. All movements go through immutable transactions.

Source READMEs:

- `reservation/Profile/README.md` (wallets, top-up, send gift, history)

## Collections

| Collection | Purpose |
|---|---|
| `wallets` | One row per (user, pool). Holds cached balance and a pointer to currency. |
| `wallet_transactions` | Immutable ledger of every credit/debit. |
| `wallet_top_ups` | Top-up requests, including bonus calculation and PSP reference. |
| `wallet_gifts` | Gifts sent between users. |

---

## `wallets`

```ts
type Wallet = {
  _id: ObjectId;
  userId: ObjectId;
  pool: "domestic" | "foreign" | "bonus";
  currency: "KRW" | "USD" | string;

  balance: { amount: Decimal128; currency: string };  // cached, recomputable

  // For foreign wallet only
  defaultPaymentMethodId?: ObjectId;     // -> customer_payment_methods
  defaultPaymentMethodLabel?: string;    // "VISA ••4242"

  // Bonus rules
  rules?: {
    stacksOnPool?: "domestic" | "foreign";    // bonus stacks on domestic only
    expiresAt?: Date | null;
  };

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ userId: 1, pool: 1 }` unique
- `{ defaultPaymentMethodId: 1 }`

---

## `wallet_transactions`

The single source of truth for balances. Never UPDATE; always INSERT a new transaction. The `balance` on `wallets` is `SUM(direction * amount)`.

```ts
type WalletTransaction = {
  _id: ObjectId;
  userId: ObjectId;
  walletId: ObjectId;               // -> wallets
  pool: "domestic" | "foreign" | "bonus";
  currency: string;

  type:
    | "top_up"
    | "top_up_bonus"
    | "restaurant_payment"
    | "reward_earned"
    | "referral_bonus"
    | "gift_sent"
    | "gift_received"
    | "birthday_bonus"
    | "refund"
    | "subscription_charge"
    | "adjustment";

  direction: "credit" | "debit";
  amount: { amount: Decimal128; currency: string };
  balanceAfter: { amount: Decimal128; currency: string };  // snapshot for audit

  // Cross-references (any may be present)
  paymentId?: ObjectId;             // -> payments
  topUpId?: ObjectId;               // -> wallet_top_ups
  giftId?: ObjectId;                // -> wallet_gifts
  reservationId?: ObjectId;
  orderId?: ObjectId;
  subscriptionInvoiceId?: ObjectId;

  title: string;                    // "Top Up", "Sakura Omakase", "Reward Earned"
  description?: string;
  occurredAt: Date;                 // displayed in History
  createdAt: Date;
};
```

Indexes:

- `{ userId: 1, occurredAt: -1 }`           // History view
- `{ walletId: 1, occurredAt: -1 }`
- `{ type: 1, occurredAt: -1 }`
- `{ paymentId: 1 }`
- `{ topUpId: 1 }`
- `{ giftId: 1 }`

Sample (history excerpt):

```json
[
  { "type": "top_up",            "direction": "credit", "amount": { "amount": "50.00",  "currency": "USD" }, "title": "Top Up",         "occurredAt": "2026-04-10T..." },
  { "type": "restaurant_payment","direction": "debit",  "amount": { "amount": "42.50",  "currency": "USD" }, "title": "Sakura Omakase", "occurredAt": "2026-04-08T..." },
  { "type": "reward_earned",     "direction": "credit", "amount": { "amount": "4.25",   "currency": "USD" }, "title": "Reward Earned",  "occurredAt": "2026-04-08T..." },
  { "type": "referral_bonus",    "direction": "credit", "amount": { "amount": "10.00",  "currency": "USD" }, "title": "Referral Bonus", "occurredAt": "2026-03-27T..." },
  { "type": "gift_received",     "direction": "credit", "amount": { "amount": "25.00",  "currency": "USD" }, "title": "Gift Received",  "occurredAt": "2026-03-20T..." }
]
```

---

## `wallet_top_ups`

```ts
type WalletTopUp = {
  _id: ObjectId;
  userId: ObjectId;
  walletId: ObjectId;               // target wallet
  pool: "domestic" | "foreign";

  amount: { amount: Decimal128; currency: string };
  bonus: { amount: Decimal128; currency: string };  // applied to bonus wallet on success

  paymentMethodKind: "apple_pay" | "google_pay" | "paypal" | "bank_transfer" | "card";
  paymentMethodId?: ObjectId;        // -> customer_payment_methods

  paymentIntentId?: ObjectId;        // -> payment_intents
  paymentId?: ObjectId;              // -> payments (set on success)

  status: "requested" | "processing" | "succeeded" | "failed" | "cancelled";
  failure?: { code: string; message: string };

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ userId: 1, createdAt: -1 }`
- `{ paymentIntentId: 1 }`
- `{ status: 1, createdAt: -1 }`

State diagram:

```text
requested ─intent created─▶ processing ─psp success─▶ succeeded
                                              ─psp fail────▶ failed
requested ─user cancels───▶ cancelled
```

On `succeeded`:

1. Insert `wallet_transactions` of type `top_up` (debit/credit accounting kept consistent).
2. If `bonus.amount > 0`, insert another `wallet_transactions` of type `top_up_bonus` against the user's bonus wallet.
3. Recompute and update `wallets.balance` for both wallets.

---

## `wallet_gifts`

```ts
type WalletGift = {
  _id: ObjectId;
  senderUserId: ObjectId;
  recipientUserId: ObjectId;
  recipientUsernameAtSend: string;  // snapshot for audit (in case username changes)

  sourceWallet: "domestic" | "foreign";
  amount: { amount: Decimal128; currency: string };
  message?: string;

  status: "sent" | "received" | "expired" | "refunded";

  // Bookkeeping pointers
  senderTransactionId?: ObjectId;     // -> wallet_transactions (debit)
  recipientTransactionId?: ObjectId;  // -> wallet_transactions (credit)

  expiresAt?: Date;
  receivedAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ senderUserId: 1, createdAt: -1 }`
- `{ recipientUserId: 1, status: 1, createdAt: -1 }`
- `{ status: 1, expiresAt: 1 }`           // expiry sweeper

Rules:

- The product enforces "Send Gift" cannot mix domestic and foreign in one gift.
- Bonus pool is not giftable by default; enforce in service layer.
- An expired gift is auto-refunded by inserting a credit into the sender's source wallet via `wallet_transactions`.

---

## Cross-document rules

- Wallet balances are derived. The cached `wallets.balance` is rebuilt from `wallet_transactions` and is recomputable from history.
- Every `wallet_transactions` row points to one source-of-truth row (top-up, payment, gift, reward, etc.) so history rows have audit trails.
- Currency mismatch between `wallet_transactions.amount.currency` and the wallet's currency must be rejected.
