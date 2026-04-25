# Schema · Menu

Hierarchical menu catalog: main categories -> sub-categories -> items, with optional modifiers.

Source READMEs:

- `pos/Settings/README.md` (Menu Management)
- `pos/Orders/README.md` (catalog browsing)
- `reservation/Explorer/README.md` (public menu preview)

## Collections

| Collection | Purpose |
|---|---|
| `menu_categories` | Top-level menu groupings, e.g. "Appetizers". |
| `menu_subcategories` | Sub-groupings under a category, e.g. "Cold Appetizers". |
| `menu_items` | Sellable items shown in POS Orders and customer menu preview. |
| `menu_item_modifiers` | Optional modifiers (e.g. "extra spicy") attachable to items. |

---

## `menu_categories`

```ts
type MenuCategory = {
  _id: ObjectId;
  restaurantId: ObjectId;
  name: string;                     // "Appetizers"
  iconUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ restaurantId: 1, sortOrder: 1 }`
- `{ restaurantId: 1, name: 1 }` unique

---

## `menu_subcategories`

```ts
type MenuSubcategory = {
  _id: ObjectId;
  restaurantId: ObjectId;
  categoryId: ObjectId;
  name: string;                     // "Cold Appetizers"
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ restaurantId: 1, categoryId: 1, sortOrder: 1 }`
- `{ categoryId: 1, name: 1 }` unique

---

## `menu_items`

```ts
type MenuItem = {
  _id: ObjectId;
  restaurantId: ObjectId;
  categoryId: ObjectId;
  subcategoryId?: ObjectId | null;

  name: string;                     // "Truffle Edamame"
  shortName?: string;               // "TE" abbreviation used on tickets
  description?: string;
  imageUrl?: string;
  tags?: string[];                  // ["vegan", "spicy"]

  price: { amount: Decimal128; currency: string };
  pool: "domestic" | "foreign" | "either";    // currency pool used at checkout

  modifiers: ObjectId[];            // -> menu_item_modifiers (ordered)

  availability: {
    isAvailable: boolean;
    soldOutUntil?: Date | null;
  };

  // Per-restaurant analytics caches; rebuilt by jobs
  stats?: {
    soldCount30d: number;
    revenue30d: { amount: Decimal128; currency: string };
  };

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
```

Indexes:

- `{ restaurantId: 1, categoryId: 1, subcategoryId: 1 }`
- `{ restaurantId: 1, "availability.isAvailable": 1 }`
- `{ restaurantId: 1, name: 1 }` unique
- `{ restaurantId: 1, "stats.soldCount30d": -1 }` for menu analytics top sellers

The "Add items to selected categories" modal lists `menu_items` and disables those whose `_id` already appears in the chosen `(categoryId, subcategoryId)`.

---

## `menu_item_modifiers`

```ts
type MenuItemModifier = {
  _id: ObjectId;
  restaurantId: ObjectId;
  name: string;                     // "Extra cheese"
  priceDelta: { amount: Decimal128; currency: string };  // can be 0
  group?: string;                   // optional grouping for radio/multi sets
  selectionType: "single" | "multi";
  isRequired: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
```

Indexes:

- `{ restaurantId: 1, group: 1, sortOrder: 1 }`

---

## Cross-document notes

- `menu_items.modifiers` is an ordered array of modifier ids; the resolver returns them in array order.
- A "draft" line on POS Orders is not persisted in `menu_items`. Drafts live on the `orders` document until sent to the kitchen (see `orders.md`).
- When a `menu_item` is soft-deleted, existing `order_items` keep a snapshot of the name/price at order time so historical receipts remain stable.
