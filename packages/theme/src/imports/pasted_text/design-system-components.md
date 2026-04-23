So we're making all design ui system in here - ipad side, mobile size, web page screen size and color system is very various like Airbnb system, doordash system, opentable system.


Building a reusable UI component library (Design System) for four distinct applications is a massive but highly rewarding project. Because you are building a food delivery app (like DoorDash), a booking app (like Airbnb), and a two-sided POS/Reservation system (like OpenTable for users and businesses), your components will need to handle both **consumer-facing (B2C)** and **business-facing (B2B)** use cases. 

To keep things organized, it is highly recommended to use the **Atomic Design Pattern** (Atoms, Molecules, Organisms). Here is the comprehensive list of reusable components you will need, categorized by their complexity and function.

---

### 1. Atoms (The Foundational Building Blocks)
These are the smallest, indivisible components. Every app will use these extensively.
*   **Typography**: Headings, body text, captions, and labels.
*   **Button**: Needs multiple variants: Primary, Secondary, Outline, Ghost/Text, Danger, Icon-only, and Loading states.
*   **Iconography**: A standardized set of icons (e.g., Lucide, Phosphor, or Material Icons).
*   **Avatar**: User profile pictures, business logos (needs fallback states).
*   **Badge / Tag**: Used for "New", "Sale", "Superhost", or order statuses ("Pending", "Delivered").
*   **Divider / Separator**: Horizontal and vertical lines to separate content.
*   **Spinner / Loader**: For basic loading states.

### 2. Form & Inputs (Crucial for Search, Booking, and POS)
Forms are the backbone of booking and POS systems. These must be highly accessible.
*   **Text Input**: With support for labels, placeholders, helper text, and error states.
*   **Number Input**: Crucial for POS (quantities, prices) and guest counts (Airbnb/OpenTable).
*   **Password Input**: With a toggle-visibility icon.
*   **Textarea**: For reviews, special instructions, and property descriptions.
*   **Checkbox & Radio Button**: For filters (e.g., "WiFi", "Pets allowed", "Delivery/Pickup").
*   **Toggle / Switch**: For app settings or business POS (e.g., "Accepting orders currently").
*   **Select / Dropdown**: Single and multi-select (e.g., selecting cuisines or amenities).
*   **Slider / Range Slider**: **Critical for Airbnb & OpenTable** (e.g., Price range filter $50 - $200).
*   **File Uploader**: For businesses uploading menu items or Airbnb hosts uploading property photos.

### 3. Advanced Inputs (The "Heavy Lifters")
Because of the specific apps you are building, you will need very robust scheduling and booking components.
*   **Date Picker**: Single date selection (OpenTable reservations).
*   **Date Range Picker**: **Critical for Airbnb** (Check-in and Check-out dates).
*   **Time / Slot Picker**: **Critical for OpenTable** (Selecting a 7:30 PM reservation).
*   **Search Bar / Autocomplete**: With dropdown suggestions (searching for locations, restaurants, or dishes).
*   **Stepper / Counter**: `[-] 2 [+]` layout for adding items to a DoorDash cart or selecting number of guests.

### 4. Layout & Navigation
These components dictate how users move through your apps.
*   **Navbar / Header**: With variants for logged-out, logged-in, and business dashboards.
*   **Tabs**: To switch views (e.g., "Delivery" vs. "Pickup", or "Upcoming" vs. "Past" reservations).
*   **Breadcrumbs**: For the Business POS and Airbnb to show hierarchy (e.g., *Home > California > Los Angeles*).
*   **Pagination**: For browsing long lists of restaurants or properties.
*   **Drawer / Sidebar**: A slide-out menu (used heavily in the Business POS dashboard or mobile nav).
*   **Bottom Sheet**: The mobile equivalent of a modal (crucial for DoorDash cart summaries on phones).
*   **Stepper (Progress)**: For checkout flows (*Cart > Details > Payment > Confirm*).

### 5. Data Display
How you show information to the user.
*   **Card**: The most used component. You will need variants:
    *   *Vertical Property Card* (Airbnb: Image top, title/price below).
    *   *Horizontal Item Card* (DoorDash menu item: Text on left, small image on right).
*   **Image Carousel / Slider**: **Critical for Airbnb** to swipe through property photos without leaving the search page.
*   **Accordion / Collapsible**: For FAQs, or collapsing menu categories (e.g., "Appetizers", "Mains").
*   **Data Table**: **Critical for the Business POS**. Needs sorting, filtering, and bulk-selection (for managing orders, users, and inventory).
*   **List Group**: For displaying order history or settings menus.
*   **Empty State**: Beautiful placeholders for "No orders yet", "No properties found", or "Cart is empty".

### 6. Feedback & Overlays
Components that interrupt or inform the user.
*   **Modal / Dialog**: For confirming actions, viewing details, or quick-views.
*   **Toast / Snackbar**: Non-intrusive notifications ("Item added to cart", "Reservation confirmed").
*   **Alert / Banner**: Persistent warnings at the top of the screen ("Your restaurant is currently closed to new orders").
*   **Tooltip / Popover**: Helpful hints on hover (especially useful in the B2B POS system).
*   **Skeleton Loader**: **Critical for consumer apps**. Shows a gray, pulsing outline of content (cards, text) before the actual data loads, making the app feel much faster.

### 7. Macro-Components (Domain Specific)
These are large, complex components made up of many smaller ones. Building these as reusable blocks will save you hundreds of hours.
*   **Interactive Map View**: **Critical for all 3 apps**. Needs to support pins (Airbnb properties, OpenTable restaurants) and live routing (DoorDash delivery driver tracking).
*   **Review / Rating Component**: Star displays, aggregate score summaries, and individual review cards.
*   **Shopping Cart / Order Summary**: A dedicated component that calculates subtotals, taxes, fees, and tips.
*   **Payment Method Component**: Standardized UI for displaying saved credit cards or integrating Stripe/Apple Pay.
*   **Messaging / Chat Bubbles**: For communication between Airbnb Hosts/Guests or DoorDash Drivers/Customers.
*   **Calendar Grid**: A full month/week view component, **critical for Airbnb Hosts and OpenTable Businesses** to manage their availability.

---

### Pro-Tips for Architecture:

1.  **Strict Theming Engine**: Because these 4 apps need a "consistent UI style" but will likely have different brand colors (e.g., DoorDash red, Airbnb pink), use **Design Tokens** (CSS variables). A button should use `var(--color-primary)` so that the same button component looks like DoorDash in one app, and Airbnb in another.
2.  **Headless UI**: Consider using a headless component library (like Radix UI, Headless UI, or React Aria) for complex things like Selects, Modals, and Date Pickers. They handle the complex logic and accessibility, and you just apply your custom CSS/Styling.
3.  **Responsiveness is Key**: A DoorDash user is likely on their phone, but an OpenTable restaurant manager is likely on an iPad or Desktop. Your components (especially Tables and Drawers) must adapt gracefully to all screen sizes.