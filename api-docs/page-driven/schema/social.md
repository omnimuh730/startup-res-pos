# Schema · Friends, Saved Items, Recent Searches

Customer-side social and personalization data.

Source READMEs:

- `reservation/Profile/README.md` (Friends & Contacts, Send Gift autocomplete)
- `reservation/Discover/README.md` (Saved page, heart action)
- `reservation/Explorer/README.md` (Recent Searches)

## Collections

| Collection | Purpose |
|---|---|
| `friend_requests` | Pending/answered friend requests. |
| `friends` | Accepted friendship rows (one row per ordered pair). |
| `saved_items` | Bookmarks for restaurants and foods. |
| `recent_searches` | Per-user search history shown on Explorer. |

---

## `friend_requests`

```ts
type FriendRequest = {
  _id: ObjectId;
  fromUserId: ObjectId;
  // exactly one of these is set
  toUserId?: ObjectId;              // when invitee is a known user
  toPhone?: string;                 // when invitee is invited by phone

  status: "pending" | "accepted" | "rejected" | "withdrawn" | "expired";
  message?: string;

  expiresAt?: Date;
  decidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ fromUserId: 1, toUserId: 1, status: 1 }`
- `{ toUserId: 1, status: 1, createdAt: -1 }`
- `{ toPhone: 1, status: 1 }`
- partial unique index on `(fromUserId, toUserId)` where `status = "pending"` to prevent duplicates.

Outcome:

- `accepted` -> insert into `friends` (both directions or single canonical row).
- `rejected`/`withdrawn`/`expired` -> kept for audit; no `friends` row.

---

## `friends`

Each accepted friendship is stored as a single canonical row using a sorted user-id pair to prevent duplicates.

```ts
type Friend = {
  _id: ObjectId;
  // Canonical ordering: userIdA < userIdB by ObjectId comparison
  userIdA: ObjectId;
  userIdB: ObjectId;

  source: "request" | "phone_invite" | "import";
  acceptedAt: Date;

  // Cached display copies for both sides; rebuild via job if needed
  displayA?: { username: string; displayName: string };
  displayB?: { username: string; displayName: string };

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ userIdA: 1, userIdB: 1 }` unique
- `{ userIdA: 1 }`
- `{ userIdB: 1 }`

Friend list query for user X:

```text
db.friends.find({ $or: [{ userIdA: X }, { userIdB: X }] })
```

The `Friends & Contacts` count and rows shown on Profile come from this query.

Removal: deletes the canonical row. Re-adding goes through a fresh `friend_requests`.

---

## `saved_items`

```ts
type SavedItem = {
  _id: ObjectId;
  userId: ObjectId;
  itemType: "restaurant" | "food";
  // exactly one of these is set
  restaurantId?: ObjectId;
  foodId?: ObjectId;                // -> menu_items

  // Cached display fields for fast list render
  display: {
    name: string;
    imageUrl?: string;
    cuisine?: string;
    rating?: number;
  };

  createdAt: Date;
};
```

Indexes:

- `{ userId: 1, itemType: 1, createdAt: -1 }`
- `{ userId: 1, restaurantId: 1 }` unique sparse
- `{ userId: 1, foodId: 1 }` unique sparse

The Saved page tabs query by `itemType`. Empty state is rendered when no rows exist for the selected tab.

---

## `recent_searches`

Per-user query history shown when the Explorer search box is focused.

```ts
type RecentSearch = {
  _id: ObjectId;
  userId: ObjectId;

  kind: "restaurant" | "cuisine" | "location" | "freeform";
  query: string;
  // optional pointers when the search was a tap on a typed result
  restaurantId?: ObjectId;
  cuisineCode?: string;
  locationId?: ObjectId;

  lastUsedAt: Date;
  createdAt: Date;
};
```

Indexes:

- `{ userId: 1, lastUsedAt: -1 }`
- `{ userId: 1, query: 1 }` unique  // dedupe; updates `lastUsedAt`

Behavior:

- Inserting an existing `(userId, query)` upserts and bumps `lastUsedAt`.
- `Clear All` deletes every row for the user.
- For anonymous users, the same shape lives in client local storage and is never sent to the server.

---

## Cross-document rules

- A `friends` row is created/destroyed only via `friend_requests` lifecycle (or admin tools).
- The Profile contacts count uses the `friends` query above; `friend_requests` are not counted.
- Unsaving a restaurant or food simply deletes the matching `saved_items` row.
- Send Gift recipient autocomplete should query `friends` first, then optionally look up `customer_users` by username.
