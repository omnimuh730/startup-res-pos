# MongoDB Schema

This folder contains the canonical MongoDB collection schemas derived from the page-driven READMEs in:

- `api-docs/page-driven/pos/` (restaurant/staff facing)
- `api-docs/page-driven/reservation/` (customer facing)

Each file documents one logical domain. Inside, every collection is listed with:

- purpose
- TypeScript-style document shape
- recommended indexes
- sample documents
- relationships and state diagrams where relevant

## File index

| File | Collections |
|---|---|
| [`users.md`](./users.md) | `customer_users`, `staff_users`, `staff_join_requests`, `sessions`, `password_reset_sessions`, `security_questions` |
| [`restaurants.md`](./restaurants.md) | `restaurants`, `floors`, `tables`, `restaurant_settings`, `restaurant_phones`, `restaurant_payment_cards`, `amenities` |
| [`menu.md`](./menu.md) | `menu_categories`, `menu_subcategories`, `menu_items`, `menu_item_modifiers` |
| [`reservations.md`](./reservations.md) | `reservations`, `reservation_drafts`, `reservation_preferences_catalog`, `reservation_invites`, `table_qr_codes` |
| [`orders.md`](./orders.md) | `orders`, `order_items`, `chef_tickets`, `chef_ticket_items` |
| [`payments.md`](./payments.md) | `payment_intents`, `payments`, `refunds`, `customer_payment_methods`, `restaurant_deposit_cards` |
| [`wallets.md`](./wallets.md) | `wallets`, `wallet_transactions`, `wallet_top_ups`, `wallet_gifts` |
| [`rewards.md`](./rewards.md) | `reward_tiers`, `points_ledger`, `daily_bonus_claims`, `referral_codes`, `referral_redemptions` |
| [`social.md`](./social.md) | `friend_requests`, `friends`, `saved_items`, `recent_searches` |
| [`notifications.md`](./notifications.md) | `notifications`, `push_tokens` |
| [`subscriptions.md`](./subscriptions.md) | `subscription_plans`, `subscriptions`, `subscription_invoices` |
| [`support.md`](./support.md) | `support_conversations`, `support_messages`, `support_articles` |

## Conventions

### IDs

- Every document has `_id: ObjectId` as the primary key.
- Cross-references use `<entity>Id: ObjectId` with the source collection's `_id`.
- Human-friendly codes (e.g. confirmation codes) are stored as separate string fields and indexed; they are never the primary key.

### Timestamps

Every collection includes:

- `createdAt: Date`
- `updatedAt: Date`

Optional:

- `deletedAt: Date | null` for soft delete

### Money

Money values are always paired with a currency:

```ts
type Money = {
  amount: Decimal128;   // store as Decimal128, never as float
  currency: "KRW" | "USD" | string;
};
```

KRW has zero minor units; USD has two. Display formatting is the client's job. Servers should compute totals in `Decimal128` and reject mixed-currency arithmetic.

### Multi-tenant scoping

POS-side collections (orders, chef tickets, menu, floors, tables, staff users, reservations from the restaurant's perspective) carry `restaurantId: ObjectId`. Customer-side collections (wallets, friends, notifications, etc.) carry `userId: ObjectId`.

Reservations sit in both worlds and carry both `restaurantId` and `userId`.

### Status enums

State machines are listed in the relevant file. Statuses are stored as snake_case strings (`requested`, `confirmed`, `arrived`, `dining`, `bill_requested`, `paid`, `visited`, `cancelled`, `declined`, `no_show`, etc.).

### Indexes

Every file lists `Indexes:` blocks. The default convention is:

- single-field index on every foreign key (`restaurantId`, `userId`, etc.)
- compound index on `(tenantId, status, createdAt desc)` for any list/feed
- TTL index on transient sessions, drafts, qr nonces
- text index only when the screen exposes free-text search

### Realtime channels

Channels referenced in the page READMEs are listed alongside the collection that owns the entity. They are not stored in MongoDB; they are emitted from changes.

### Money-related integrity rules

- Wallet balances are derived from immutable `wallet_transactions` rows. The cached `balance` on the `wallets` document is recomputable.
- Payments are append-only. Status transitions go through new `refunds` rows, not by mutating the original `payments` row.
- Reservation deposits and order payments share the same `payments`/`payment_intents` collections to keep one source of truth for finance.

### Optional fields

Optional fields use `?` suffix or `T | null`. Mongo will store missing optional fields as absent. Code should treat `null` and missing as equivalent.
