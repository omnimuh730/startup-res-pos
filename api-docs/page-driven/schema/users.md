# Schema · Users & Auth

Customer accounts (reservation app), staff accounts (POS), and shared authentication artifacts.

Source READMEs:

- `reservation/Auth/README.md`
- `pos/Auth/README.md`

## Collections

| Collection | Purpose |
|---|---|
| `customer_users` | End users of the reservation/discovery app. |
| `staff_users` | Restaurant staff members (manager, waiter, chef, cashier). |
| `staff_join_requests` | Pending staff sign-up requests waiting for manager approval. |
| `sessions` | Active refresh tokens / device sessions. |
| `password_reset_sessions` | Short-lived recovery flow state. |
| `security_questions` | Static catalog of questions selectable during sign-up. |

---

## `customer_users`

```ts
type CustomerUser = {
  _id: ObjectId;
  username: string;                 // unique, lowercased
  passwordHash: string;             // bcrypt/argon2; never returned to client
  fullName: string;
  displayName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;

  status: "active" | "deactivated" | "deleted";

  preferences: {
    theme: "airbnb" | "ocean" | "forest" | "midnight";
    location?: { areaId?: ObjectId; lat?: number; lng?: number; label?: string };
    locale?: string;
  };

  rewards: {
    tier: "silver" | "gold" | "platinum" | "diamond";
    points: number;
  };

  walletIds: {                      // pointers; balances live in `wallets`
    domestic: ObjectId;
    foreign: ObjectId;
    bonus: ObjectId;
  };

  subscription?: {
    subscriptionId: ObjectId;       // -> subscriptions
    plan: "pro_monthly" | "pro_quarterly" | "pro_yearly";
    status: "active" | "past_due" | "cancelled";
    currentPeriodEnd: Date;
  };

  securityAnswers: Array<{
    questionId: ObjectId;           // -> security_questions
    answerHash: string;             // hashed/salted, never plain text
  }>;

  referral: {
    code: string;                   // user's own referral code
    referredByCode?: string;        // referral code consumed at sign-up
  };

  dailyBonus: {
    lastClaimedDate?: string;       // YYYY-MM-DD in user's local tz
  };

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ username: 1 }` unique
- `{ email: 1 }` unique sparse
- `{ phone: 1 }` unique sparse
- `{ "referral.code": 1 }` unique
- `{ status: 1, createdAt: -1 }`

Sample:

```json
{
  "_id": "65f0e0a1...",
  "username": "alexchen",
  "passwordHash": "$argon2id$...",
  "fullName": "Alex Chen",
  "email": "alexchen@email.com",
  "phone": "+1 (555) 234-5678",
  "status": "active",
  "preferences": { "theme": "airbnb", "locale": "en-US" },
  "rewards": { "tier": "gold", "points": 2340 },
  "walletIds": { "domestic": "...", "foreign": "...", "bonus": "..." },
  "subscription": null,
  "securityAnswers": [
    { "questionId": "q1", "answerHash": "..." },
    { "questionId": "q2", "answerHash": "..." },
    { "questionId": "q3", "answerHash": "..." }
  ],
  "referral": { "code": "ALEX-7421" },
  "dailyBonus": { "lastClaimedDate": "2026-04-25" },
  "createdAt": "2026-01-10T08:00:00Z",
  "updatedAt": "2026-04-25T12:00:00Z"
}
```

---

## `staff_users`

POS users; always tied to a single restaurant.

```ts
type StaffUser = {
  _id: ObjectId;
  restaurantId: ObjectId;           // -> restaurants
  username: string;                 // unique within restaurant + global username collision check
  passwordHash: string;
  passwordIsDefault: boolean;       // true if still on "12345678"
  fullName: string;

  role: "manager" | "waiter" | "chef" | "cashier";
  permissions: string[];            // e.g. ["orders.create","orders.refund","analytics.view"]

  status: "pending_approval" | "active" | "inactive" | "rejected";

  device?: {
    lastPlatform?: "ios" | "android" | "web";
    lastAppVersion?: string;
    lastSignInAt?: Date;
  };

  approvedBy?: ObjectId;            // -> staff_users
  approvedAt?: Date;
  rejectedBy?: ObjectId;
  rejectedAt?: Date;
  inactivatedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ restaurantId: 1, username: 1 }` unique
- `{ restaurantId: 1, role: 1, status: 1 }`
- `{ status: 1, createdAt: -1 }`

State diagram:

```text
pending_approval ─approve─▶ active ─inactivate─▶ inactive ─activate─▶ active
                 ─reject──▶ rejected
```

Sample:

```json
{
  "_id": "65f1...",
  "restaurantId": "65aa...",
  "username": "waiter01",
  "passwordHash": "$argon2id$...",
  "passwordIsDefault": true,
  "fullName": "Sara Lim",
  "role": "waiter",
  "permissions": ["orders.create", "orders.send_kitchen", "payment.cash"],
  "status": "active",
  "approvedBy": "65aa...mgr",
  "approvedAt": "2026-04-01T08:00:00Z",
  "createdAt": "2026-04-01T07:00:00Z",
  "updatedAt": "2026-04-01T08:00:00Z"
}
```

---

## `staff_join_requests`

Created by Step-3 of the staff sign-up wizard; consumed by manager's approve/reject action.

```ts
type StaffJoinRequest = {
  _id: ObjectId;
  restaurantId: ObjectId;
  fullName: string;
  username: string;
  passwordHash: string;             // captured at request time
  requestedRole: "waiter" | "chef" | "cashier";
  status: "pending" | "approved" | "rejected" | "withdrawn";
  decidedBy?: ObjectId;             // -> staff_users (manager)
  decidedAt?: Date;
  resultingStaffUserId?: ObjectId;  // populated when approved
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ restaurantId: 1, status: 1, createdAt: -1 }`
- `{ username: 1 }`

---

## `sessions`

Refresh-token / device sessions for both customers and staff.

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

Indexes:

- `{ subjectType: 1, subjectId: 1 }`
- `{ refreshTokenHash: 1 }` unique
- `{ expiresAt: 1 }` TTL

---

## `password_reset_sessions`

Tracks the multi-step Forgot Password flow.

```ts
type PasswordResetSession = {
  _id: ObjectId;                    // referred to as resetSessionId
  subjectType: "customer" | "staff";
  subjectId: ObjectId;
  questionId: ObjectId;             // -> security_questions
  answerAttempts: number;
  state: "awaiting_answer" | "answer_verified" | "completed" | "failed";
  resetTokenHash?: string;          // issued only when answer is verified
  resetTokenExpiresAt?: Date;
  expiresAt: Date;                  // overall session lifetime
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ subjectId: 1 }`
- `{ resetTokenHash: 1 }` unique sparse
- `{ expiresAt: 1 }` TTL

---

## `security_questions`

Read-mostly catalog used in sign-up Step 4 and the Forgot Password Step 1 fetch.

```ts
type SecurityQuestion = {
  _id: ObjectId;
  question: string;                 // "What is your pet's name?"
  locale: string;                   // "en-US"
  active: boolean;
  sortOrder: number;
};
```

Indexes:

- `{ locale: 1, active: 1, sortOrder: 1 }`

Seed examples:

```json
[
  { "question": "What is your pet's name?",   "locale": "en-US", "active": true, "sortOrder": 1 },
  { "question": "What city were you born in?","locale": "en-US", "active": true, "sortOrder": 2 },
  { "question": "What is your favorite food?","locale": "en-US", "active": true, "sortOrder": 3 }
]
```

---

## Cross-document rules

- `customer_users.securityAnswers` and `staff_users` never expose hashes outside the auth service.
- `staff_users.username` is also checked globally to keep usernames distinct across tenants for support tooling.
- A successful `staff_join_requests` approval atomically creates the matching `staff_users` row and stores its id back in `resultingStaffUserId`.
- `password_reset_sessions` and `sessions` use TTL indexes for automatic cleanup.
