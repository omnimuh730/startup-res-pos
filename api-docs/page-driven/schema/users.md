# Schema · Users & Auth

Two user collections — customers (reservation app) and staff (POS) — plus tiny TTL'd auth-infra collections for sessions and password resets.

Source READMEs:

- `reservation/Auth/README.md`, `reservation/Profile/README.md`, `reservation/Discover/README.md`, `reservation/Explorer/README.md`
- `pos/Auth/README.md`

## Collections

| Collection | Purpose |
|---|---|
| `customer_users` | End users of the reservation/discovery app. Heavy embedding for personal/social/reward state. |
| `staff_users` | Restaurant staff (manager, waiter, chef, cashier). |
| `sessions` | Active refresh tokens / device sessions (auth infra; TTL'd). |
| `password_reset_sessions` | Multi-step Forgot Password flow state (auth infra; TTL'd). |

`security_questions`, `reward_tiers`, `subscription_plans`, `amenities`, `reservation_preferences`, and `support_articles` live in the [`metadata`](./metadata.md) collection.

---

## `customer_users`

Single source of truth for the customer's profile, preferences, **wallet balances cache**, **rewards cache**, **embedded social** (saved items, recent searches, friends), **embedded payment methods**, **devices** (push tokens), **referral**, and **subscription summary**.

```ts
type CustomerUser = {
  _id: ObjectId;

  // Identity
  username: string;                 // unique, lowercased
  passwordHash: string;             // bcrypt/argon2; never returned to client
  fullName: string;
  displayName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;

  status: "active" | "deactivated" | "deleted";

  // Preferences
  preferences: {
    theme: "airbnb" | "ocean" | "forest" | "midnight";
    locale?: string;
    location?: { areaId?: ObjectId; lat?: number; lng?: number; label?: string };
  };

  // Security questions chosen at sign-up — questionId points at metadata catalog
  securityAnswers: Array<{
    questionId: string;             // metadata.security_questions.items[].code
    answerHash: string;             // hashed/salted, never plain text
  }>;

  // Wallet balances cache. Authoritative source: wallet_transactions.
  wallets: {
    domestic: { currency: "KRW" | string; balance: { amount: Decimal128; currency: string }; defaultPaymentMethodId?: ObjectId };
    foreign:  { currency: "USD" | string; balance: { amount: Decimal128; currency: string }; defaultPaymentMethodId?: ObjectId };
    bonus:    { currency: string;          balance: { amount: Decimal128; currency: string }; expiresAt?: Date | null };
  };

  // Rewards cache. Authoritative source: points_ledger.
  rewards: {
    tier: "silver" | "gold" | "platinum" | "diamond";
    points: number;
    nextTier?: "gold" | "platinum" | "diamond" | null;
    pointsToNextTier?: number;
  };

  // Embedded payment methods (cards, wallets). PSP holds the sensitive data.
  paymentMethods: Array<{
    _id: ObjectId;
    pspProvider: string;
    pspExternalId: string;
    kind: "card" | "apple_pay" | "google_pay" | "paypal" | "bank_account";
    card?: { brand: string; last4: string; expMonth: number; expYear: number };
    bank?: { bankName: string; last4: string };
    isDefault: boolean;
    fundsForeign: boolean;
    fundsDomestic: boolean;
    addedAt: Date;
  }>;

  // Embedded devices for push delivery (FCM/APNs/web-push).
  devices: Array<{
    _id: ObjectId;
    provider: "fcm" | "apns" | "web_push";
    token: string;
    platform: "ios" | "android" | "web";
    appVersion?: string;
    deviceId?: string;
    isActive: boolean;
    lastSeenAt: Date;
  }>;

  // Saved items (Discover -> Saved). Restaurants and individual menu items.
  savedItems: Array<{
    _id: ObjectId;
    itemType: "restaurant" | "food";
    restaurantId?: ObjectId;
    foodId?: ObjectId;              // -> restaurants.menu.items[]._id
    display: { name: string; imageUrl?: string; cuisine?: string; rating?: number };
    savedAt: Date;
  }>;

  // Capped to last 20. $push with $slice: -20.
  recentSearches: Array<{
    kind: "restaurant" | "cuisine" | "location" | "freeform";
    query: string;
    restaurantId?: ObjectId;
    cuisineCode?: string;
    locationId?: ObjectId;
    lastUsedAt: Date;
  }>;

  // Friends — bounded list. Pending requests and accepted entries share the array via status.
  friends: Array<{
    _id: ObjectId;
    otherUserId?: ObjectId;         // null when invited by phone only
    otherUsername?: string;         // snapshot for display
    otherDisplayName?: string;
    phone?: string;                 // present for phone invites
    status: "pending_outgoing" | "pending_incoming" | "accepted" | "blocked";
    source: "request" | "phone_invite" | "import";
    requestedAt: Date;
    acceptedAt?: Date;
  }>;

  // Referral
  referral: {
    code: string;                   // user's own referral code (unique)
    referredByCode?: string;        // referral code consumed at sign-up
    redemptions: Array<{
      refereeUserId: ObjectId;
      redeemedAt: Date;
      reward: { kind: "points" | "wallet"; amount: number; currency?: string };
    }>;
  };

  // Daily bonus — last 30 days kept inline; older archived.
  dailyBonus: {
    lastClaimedDate?: string;       // YYYY-MM-DD in user's local tz
    history: Array<{
      localDate: string;
      selectedBox: 0 | 1 | 2;
      reward:
        | { kind: "points"; points: number }
        | { kind: "bonus_credit"; amount: { amount: Decimal128; currency: string } }
        | { kind: "coupon"; couponCode: string };
      pointsLedgerId?: ObjectId;
      walletTransactionId?: ObjectId;
      claimedAt: Date;
    }>;
  };

  // Active reservation draft (wizard state). One at a time.
  activeDraft?: {
    restaurantId: ObjectId;
    step: 1 | 2 | 3 | 4;
    partySize?: number;
    date?: string;
    time?: string;
    seating?: string;
    occasion?: string;
    specialRequests?: string;
    preferences?: {
      seating: string[]; cuisine: string[]; vibe: string[]; amenities: string[];
    };
    contact?: { fullName: string; phone: string };
    paymentIntentId?: string;       // PSP intent id captured during Step 4
    expiresAt: Date;                // sweeper deletes after 24h
    updatedAt: Date;
  };

  // Active subscription summary (catchtable_pro). Authoritative: subscriptions collection.
  subscription?: {
    subscriptionId: ObjectId;       // -> subscriptions
    planCode: "pro_monthly" | "pro_quarterly" | "pro_yearly";
    status: "trialing" | "active" | "past_due" | "cancelled" | "expired";
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  };

  // Notification badge cache — recomputed by worker after notifications inserts.
  unreadNotifications: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

### Indexes

- `{ username: 1 }` unique
- `{ email: 1 }` unique sparse
- `{ phone: 1 }` unique sparse
- `{ "referral.code": 1 }` unique
- `{ status: 1, createdAt: -1 }`
- `{ "savedItems.restaurantId": 1 }` (multikey, for "users who saved restaurant X")
- `{ "friends.otherUserId": 1, "friends.status": 1 }` (multikey, for incoming-request inbox)
- `{ "devices.token": 1 }` unique sparse (multikey)
- `{ "wallets.domestic.balance.amount": 1 }` only if you ever query by balance — usually not needed
- `{ "activeDraft.expiresAt": 1 }` sparse (background sweeper for stale drafts)

### Notes

- The `friends` array is bounded by social graph (typical: 50–500 entries). For users projected to exceed 1k, split friends into a separate collection later — schema-compatible because `friends[]` rows already have their own `_id`.
- `recentSearches` is capped at 20 via `$push: { $each: [...], $slice: -20, $sort: { lastUsedAt: -1 } }`.
- `dailyBonus.history` keeps last 30 entries inline; an archive job moves older entries to a cold collection if needed for analytics.
- `activeDraft.expiresAt` is enforced by a background sweeper; it's not a TTL index because the parent doc cannot expire.

---

## `staff_users`

POS users; tied to a single restaurant.

```ts
type StaffUser = {
  _id: ObjectId;
  restaurantId: ObjectId;           // -> restaurants
  username: string;
  passwordHash: string;
  passwordIsDefault: boolean;       // true if still on "12345678"
  fullName: string;

  role: "manager" | "waiter" | "chef" | "cashier";
  permissions: string[];            // ["orders.create","orders.refund","analytics.view"]

  status: "pending_approval" | "active" | "inactive" | "rejected";

  // Devices for push delivery to staff terminals.
  devices: Array<{
    _id: ObjectId;
    provider: "fcm" | "apns" | "web_push";
    token: string;
    platform: "ios" | "android" | "web";
    appVersion?: string;
    deviceId?: string;
    isActive: boolean;
    lastSeenAt: Date;
  }>;

  approvedBy?: ObjectId;            // -> staff_users
  approvedAt?: Date;
  rejectedBy?: ObjectId;
  rejectedAt?: Date;
  inactivatedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
};
```

### Indexes

- `{ restaurantId: 1, username: 1 }` unique
- `{ restaurantId: 1, role: 1, status: 1 }`
- `{ status: 1, createdAt: -1 }`
- `{ "devices.token": 1 }` unique sparse

### State diagram

```text
pending_approval ─approve─▶ active ─inactivate─▶ inactive ─activate─▶ active
                  ─reject──▶ rejected
```

Pending staff sign-ups also surface as `restaurants.pendingStaff[]` until the manager approves or rejects them. On approve, the entry is consumed and a fresh `staff_users` row is inserted with `status: "active"`. See [`restaurants.md`](./restaurants.md).

---

## `sessions`

Refresh-token / device sessions for both customers and staff. TTL-cleaned.

```ts
type Session = {
  _id: ObjectId;
  subjectType: "customer" | "staff";
  subjectId: ObjectId;              // -> customer_users | staff_users
  refreshTokenHash: string;
  device: {
    platform: "ios" | "android" | "web";
    appVersion?: string;
    deviceId?: string;
  };
  expiresAt: Date;
  revokedAt?: Date | null;
  createdAt: Date;
  lastUsedAt: Date;
};
```

### Indexes

- `{ subjectType: 1, subjectId: 1 }`
- `{ refreshTokenHash: 1 }` unique
- `{ expiresAt: 1 }` TTL

---

## `password_reset_sessions`

Multi-step Forgot Password flow state. TTL-cleaned.

```ts
type PasswordResetSession = {
  _id: ObjectId;                    // referred to as resetSessionId
  subjectType: "customer" | "staff";
  subjectId: ObjectId;
  questionId: string;               // metadata.security_questions.items[].code
  answerAttempts: number;
  state: "awaiting_answer" | "answer_verified" | "completed" | "failed";
  resetTokenHash?: string;          // issued only when answer is verified
  resetTokenExpiresAt?: Date;
  expiresAt: Date;                  // overall session lifetime
  createdAt: Date;
  updatedAt: Date;
};
```

### Indexes

- `{ subjectId: 1 }`
- `{ resetTokenHash: 1 }` unique sparse
- `{ expiresAt: 1 }` TTL

---

## Cross-document rules

- `customer_users.passwordHash`, `staff_users.passwordHash`, and any `securityAnswers[].answerHash` are never returned to clients.
- The cached `wallets.*.balance` and `rewards.points` are recomputed by the worker that consumes new `wallet_transactions` and `points_ledger` rows.
- `unreadNotifications` is bumped by the notifications writer and reset on "mark all read".
- `staff_users` username is also globally unique to keep support tooling unambiguous.
- A staff member can only belong to one restaurant; multi-restaurant chains will require a future schema split.
- Pending staff sign-ups: created as a row inside `restaurants.pendingStaff[]`. Approval atomically inserts a `staff_users` row and removes the pending entry.

## Realtime channels

- `user.profile.updated`
- `user.wallets.updated`
- `user.rewards.updated`
- `user.friends.updated`
- `user.notifications.unreadCountChanged`
