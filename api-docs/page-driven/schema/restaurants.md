# Schema · Restaurants, Floors, Tables, Settings

Tenant root for the POS, plus the layout (floors and tables) and per-restaurant settings.

Source READMEs:

- `pos/Floor Plan/README.md`
- `pos/Settings/README.md`
- `pos/Auth/README.md` (restaurant sign-up)
- `reservation/Discover/README.md`, `reservation/Explorer/README.md` (public discovery fields)

## Collections

| Collection | Purpose |
|---|---|
| `restaurants` | Tenant root and public profile data shown across the customer app. |
| `floors` | A floor (a logical room/area) inside a restaurant. |
| `tables` | A table on a floor with shape, size, position, and capacity. |
| `restaurant_settings` | All editable settings: deposit, money type, grace period, hours, ... |
| `restaurant_phones` | Multiple phone numbers per restaurant. |
| `restaurant_payment_cards` | Deposit cards used to receive customer payouts. |
| `amenities` | Catalog of selectable amenities/services. |

---

## `restaurants`

```ts
type Restaurant = {
  _id: ObjectId;
  name: string;
  slug: string;                     // url-safe unique identifier
  cuisine: string[];                // ["korean", "bbq"]
  priceLevel: 1 | 2 | 3 | 4;
  description?: string;

  status: "pending_approval" | "active" | "suspended";

  thumbnailUrl?: string;            // pre-signed upload result
  imageUrls: string[];

  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  location: {                       // GeoJSON
    type: "Point";
    coordinates: [number, number];  // [lng, lat]
  };

  contact: {
    primaryPhone?: string;          // duplicated from restaurant_phones for fast read
    websiteUrl?: string;
  };

  rating: {
    average: number;                // cached aggregate
    count: number;
  };

  amenities: string[];              // amenity codes (see `amenities`)

  // Subscription tier of the restaurant tenant
  tier: "free" | "pro" | "ultra";

  // Stats used by Discover sections
  flags: {
    isNew?: boolean;
    isCatchOnly?: boolean;
    isEditorChoice?: boolean;
  };

  createdBy: ObjectId;              // -> staff_users (the registering manager)
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ slug: 1 }` unique
- `{ status: 1, tier: 1 }`
- `{ "rating.average": -1 }`
- `{ cuisine: 1 }`
- `{ amenities: 1 }`
- `{ location: "2dsphere" }` for Explorer map queries
- text index on `name`, `description` for search suggestions

State machine:

```text
pending_approval ─approve─▶ active ─suspend─▶ suspended ─reactivate─▶ active
```

---

## `floors`

```ts
type Floor = {
  _id: ObjectId;
  restaurantId: ObjectId;
  name: string;                     // "Main", "Patio"
  sortOrder: number;
  isPublished: boolean;             // false while edits are still drafts
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ restaurantId: 1, sortOrder: 1 }`
- `{ restaurantId: 1, isPublished: 1 }`

---

## `tables`

```ts
type Table = {
  _id: ObjectId;
  restaurantId: ObjectId;
  floorId: ObjectId;
  name: string;                     // "P1", "T-3"
  seats: number;
  shape: "circle" | "square" | "rect" | "custom";
  size: { w: number; h: number };
  position: { x: number; y: number };
  z: number;                        // stacking order on the floor canvas

  status: "available" | "reserved" | "occupied" | "needs_cleaning" | "out_of_service";
  occupancy?: {
    reservationId?: ObjectId;       // -> reservations
    orderId?: ObjectId;             // -> orders
    seatedAt?: Date;
    partySize?: number;
  };

  qrCodeId?: ObjectId;              // -> table_qr_codes (current)
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ restaurantId: 1, floorId: 1 }`
- `{ restaurantId: 1, status: 1 }`
- `{ "occupancy.reservationId": 1 }`
- `{ "occupancy.orderId": 1 }`

Realtime channel: `table.updated` (emitted on any field change).

---

## `restaurant_settings`

A single settings document per restaurant. Embedded sub-objects mirror the Settings page sections.

```ts
type RestaurantSettings = {
  _id: ObjectId;                    // = restaurantId for 1:1
  restaurantId: ObjectId;

  general: {
    deposit: {
      moneyType: "domestic" | "foreign";
      amountPerGuest: { amount: Decimal128; currency: string };
    };
    gracePeriodMinutes: number;     // for late arrivals before no-show
    operatingHours: Array<{
      day: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Sun
      open: string;                  // "10:00"
      close: string;                 // "22:00"
      closed?: boolean;
    }>;
  };

  amenities: string[];              // amenity codes enabled

  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumber: boolean;
    };
    notificationsMuted: boolean;
  };

  features: {
    reservations: boolean;
    qrPay: boolean;
    delivery: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ restaurantId: 1 }` unique

---

## `restaurant_phones`

```ts
type RestaurantPhone = {
  _id: ObjectId;
  restaurantId: ObjectId;
  label: "main" | "reservation" | "kitchen" | "support" | "other";
  phone: string;                    // E.164
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ restaurantId: 1, isPrimary: -1 }`
- `{ restaurantId: 1, phone: 1 }` unique

When a row is set as `isPrimary: true`, also mirror it into `restaurants.contact.primaryPhone`.

---

## `restaurant_payment_cards`

Deposit/payout cards (the cards a restaurant uses to *receive* money). The card data itself is stored at the PSP; only metadata is kept here.

```ts
type RestaurantPaymentCard = {
  _id: ObjectId;
  restaurantId: ObjectId;
  pspProvider: "stripe" | "toss" | "adyen" | string;
  pspExternalId: string;            // psp's card/customer id
  brand: "visa" | "mastercard" | "amex" | string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  registrationMode: "scan" | "type";
  createdBy: ObjectId;              // staff user
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ restaurantId: 1, isDefault: -1 }`
- `{ restaurantId: 1, pspExternalId: 1 }` unique

---

## `amenities`

Read-mostly catalog used by Settings, Reservation Flow Step 3, Explorer filters, and reservation app preferences.

```ts
type Amenity = {
  _id: ObjectId;
  code: string;                     // "parking", "kids_welcome"
  label: string;                    // "Parking"
  group: "seating" | "cuisine" | "vibe" | "service" | "other";
  icon?: string;
  active: boolean;
  sortOrder: number;
};
```

Indexes:

- `{ code: 1 }` unique
- `{ group: 1, active: 1, sortOrder: 1 }`

---

## Cross-document notes

- The `restaurants.amenities` array contains amenity codes, not ObjectIds, so the codes must be stable.
- Floor edits should be done as a transactional upsert: posted layout replaces table positions for that floor; tables not present in the request are soft-deleted.
- A reservation that ends in `arrived` flips the matching `tables.status` to `occupied` via the POS Floor Plan websocket event.
