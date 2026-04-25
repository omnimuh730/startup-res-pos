# Schema · Rewards, Points, Daily Bonus, Referrals

Reward-tier configuration, the points ledger, daily bonus claims, and referral codes/redemptions.

Source READMEs:

- `reservation/Profile/README.md` (Reward Tier)
- `reservation/Auth/README.md` (Daily Bonus)
- `reservation/Auth/README.md`, `reservation/Profile/README.md` (Refer a Friend)

## Collections

| Collection | Purpose |
|---|---|
| `reward_tiers` | Catalog of tiers and thresholds. |
| `points_ledger` | Append-only points credits/debits. Source of truth for `customer_users.rewards.points`. |
| `daily_bonus_claims` | One row per user per local day. |
| `referral_codes` | Issued referral codes (one per user; campaigns can have more). |
| `referral_redemptions` | Records of consumed referral codes. |

---

## `reward_tiers`

```ts
type RewardTier = {
  _id: ObjectId;
  code: "silver" | "gold" | "platinum" | "diamond" | string;
  name: string;
  threshold: number;                // points required (e.g. 1000)
  color?: string;
  icon?: string;
  benefits: Array<{
    code: string;                   // "early_access", "concierge"
    label: string;
    description?: string;
  }>;
  sortOrder: number;
  active: boolean;
};
```

Indexes:

- `{ code: 1 }` unique
- `{ threshold: 1 }`

Seed:

```json
[
  { "code": "silver",   "name": "Silver",   "threshold": 0,     "sortOrder": 1, "active": true, "benefits": [] },
  { "code": "gold",     "name": "Gold",     "threshold": 1000,  "sortOrder": 2, "active": true, "benefits": [] },
  { "code": "platinum", "name": "Platinum", "threshold": 5000,  "sortOrder": 3, "active": true, "benefits": [] },
  { "code": "diamond",  "name": "Diamond",  "threshold": 10000, "sortOrder": 4, "active": true, "benefits": [] }
]
```

---

## `points_ledger`

Immutable. The points balance and tier shown on Profile and the Reward Tier card are derived from this.

```ts
type PointsLedgerEntry = {
  _id: ObjectId;
  userId: ObjectId;

  type:
    | "reservation_completed"   // earned from a paid visit
    | "review_bonus"
    | "birthday_bonus"
    | "referral_bonus"
    | "manual_adjustment"
    | "expiration"              // points expiring (debit)
    | "redemption";             // (future) using points for rewards

  direction: "credit" | "debit";
  points: number;
  balanceAfter: number;

  reservationId?: ObjectId;
  referralRedemptionId?: ObjectId;
  notes?: string;

  createdBy?: { kind: "system" | "staff"; id?: ObjectId };
  occurredAt: Date;
  createdAt: Date;
};
```

Indexes:

- `{ userId: 1, occurredAt: -1 }`
- `{ reservationId: 1 }`
- `{ type: 1, occurredAt: -1 }`

Whenever a reservation reaches `visited`, the system inserts one `points_ledger` row, updates the cached `customer_users.rewards.points`, recomputes `tier`, and mirrors `pointsEarned` back onto the reservation document.

---

## `daily_bonus_claims`

Idempotent per (user, local-date).

```ts
type DailyBonusClaim = {
  _id: ObjectId;
  userId: ObjectId;
  localDate: string;                // "2026-04-25" in user's local tz

  selectedBox: 0 | 1 | 2;
  reward:
    | { kind: "points"; points: number }
    | { kind: "bonus_credit"; amount: { amount: Decimal128; currency: string } }
    | { kind: "coupon"; couponCode: string };

  // Pointers to side effects
  pointsLedgerId?: ObjectId;
  walletTransactionId?: ObjectId;

  createdAt: Date;
};
```

Indexes:

- `{ userId: 1, localDate: 1 }` unique

Behavior:

- The claim endpoint must be idempotent per `(userId, localDate)`.
- A second claim returns the existing row (or 409 with the same data).

---

## `referral_codes`

```ts
type ReferralCode = {
  _id: ObjectId;
  code: string;                     // "ALEX-7421"
  ownerUserId: ObjectId;            // -> customer_users
  type: "user" | "campaign";

  rewards: {
    referrer: { kind: "points" | "wallet"; amount: Decimal128 };
    referee:  { kind: "points" | "wallet"; amount: Decimal128 };
    currency?: string;              // when kind="wallet"
  };

  maxRedemptions?: number;          // null = unlimited
  redemptionsCount: number;
  active: boolean;

  validFrom?: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ code: 1 }` unique
- `{ ownerUserId: 1, type: 1 }`
- `{ active: 1, validUntil: 1 }`

---

## `referral_redemptions`

Created when a new sign-up enters a referral code (Auth Sign Up Step 1).

```ts
type ReferralRedemption = {
  _id: ObjectId;
  referralCodeId: ObjectId;
  refereeUserId: ObjectId;          // the new user
  referrerUserId: ObjectId;         // owner of code (denormalized)

  status: "redeemed" | "reverted";

  // Side effects
  refereePointsLedgerId?: ObjectId;
  refereeWalletTransactionId?: ObjectId;
  referrerPointsLedgerId?: ObjectId;
  referrerWalletTransactionId?: ObjectId;

  redeemedAt: Date;
  revertedAt?: Date;
  createdAt: Date;
};
```

Indexes:

- `{ referralCodeId: 1, refereeUserId: 1 }` unique
- `{ referrerUserId: 1, redeemedAt: -1 }`

Rules:

- A user cannot redeem their own code.
- A user can redeem at most one referral code at sign-up.
- Reversion (e.g. fraud) inserts compensating rows in `points_ledger` / `wallet_transactions` rather than deleting history.

---

## Cross-document rules

- `customer_users.rewards.points` is a cache. Always rebuildable from `points_ledger`.
- Tier promotion is computed by selecting the highest `reward_tiers.threshold` `<=` current points.
- Daily bonus, referral, and review bonuses can affect either points or wallet balance; both ledgers must remain immutable.
