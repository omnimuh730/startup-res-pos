# Airbnb UI/UX Analysis for Restaurant reservation (Restaurant Reservation App)

I analyzed Airbnb's mobile experience across the home, search, search-results, listing-detail, wishlists, trips, and profile flows. Below is a comprehensive breakdown of components, animations, and patterns mapped onto pages you still need to build for Restaurant reservation. I also opened your Notion workspace — I could see the "Restaurant reservation Project" page with subpages (Credential, Multi-Modal Data Embedding, User Profile Data Model, Food Data Schema), but those are data/architecture documents, not UI specs. So this analysis focuses purely on translating Airbnb's UI/UX patterns into restaurant-reservation equivalents.

## 1. Design Tokens (Foundation)

Airbnb's mobile uses a remarkably tight token system. Replicate this in Restaurant reservation as a base.

- **Typography:** "Airbnb Cereal VF" with a system fallback stack (Circular, -apple-system, Roboto, Helvetica Neue). For Restaurant reservation use Pretendard, Inter, or SF Pro. Body is 14px, headings step up to 22 / 26 / 32px with weight 600–700. Section titles ("Where you'll sleep", "What this place offers") are bold 22px.
- **Color palette:** Background `#FFFFFF`, text `#222222`, secondary text `#717171`, dividers `#DDDDDD`, surface gray `#F7F7F7` / `#F2F2F2`, warm cream `#FAF9F5`, and the signature accent `rgba(227,28,95,0.92)` (Rausch). For Restaurant reservation you can keep a neutral base and pick one warm accent (e.g., terracotta or saffron) used identically — only on primary CTAs, active nav icon, and price/availability tags.
- **Radii:** Buttons are pill-shaped (`border-radius: 40px`), cards are 12–16px, modals are 16–20px on the top corners only (sheet-style).
- **Spacing:** Page horizontal padding is 24px, card gutters 12–16px, vertical section spacing 32px.
- **Shadow:** Very soft, almost imperceptible — used on the floating search bar and the bottom CTA. Roughly `0 6px 20px rgba(0,0,0,0.08)`.

## 2. Global Shell — Bottom Nav + Floating Search

Every primary screen reuses the same shell:

- **Bottom tab bar** with 5 items (Explore, Wishlists, Trips, Messages, Profile). Inactive icons are stroked black; the active icon switches to a filled accent color and the label gains weight 600. Transition is a 150ms color crossfade — no movement, no enlargement. For Restaurant reservation the parallel is: Explore, Saved, Reservations, Inbox, Profile.
- **Floating pill search bar** that lives above content on home/search-results, with the icon on the left and a context-sensitive label ("Start your search" → "Homes in Granada · Any week · Add guests"). When you scroll down it stays sticky and shrinks slightly. For Restaurant reservation this becomes "Find a restaurant" → "Restaurants in SoHo · Tonight 7:00 · 2 people".
- **Top tabs (Homes / Experiences / Services)** sit just under the search pill on home only. Each tab has a small 3D illustration that subtly bounces (scale 1 → 1.08 → 1, ~250ms) on selection, and an underline indicator that slides between tabs. For Restaurant reservation you might use Restaurants / Bars / Events as the same horizontally-segmented illustrated tabs.

## 3. Search Flow (the biggest screen you need)

This is where Airbnb does its best work. Tapping the search pill triggers a **full-screen modal that animates up from the bar position itself** (the pill literally morphs into the modal header). The modal contains three stacked accordion cards: **Where? / When? / Who?**, each implemented as an HTML `<details>` element so only one is expanded at a time, with the others collapsed into a single-line summary row.

**Where? card** opens by default and contains a search input with a magnifying-glass icon, a "Recent searches" list of pill-shaped chips with a location icon, and a "Suggested destinations" list including a "Nearby — Find what's around you" item with a paper-plane icon. For Restaurant reservation: recent restaurants/cuisines, "Near me", trending neighborhoods, and cuisine chips.

**When? card** has a segmented switch at top with two options: **Dates** and **Flexible dates**. The Dates view shows a vertically scrolling month-by-month calendar (April 2026, May 2026, …) with day-of-week column headers and dimmed past dates. Selecting a check-in date highlights it in a black filled circle; selecting check-out fills the range with a light gray pill. Below the calendar are two dropdowns: "Check in — Exact day" and "Check out — Exact day" allowing ± flex. The Flexible dates view replaces the calendar with three duration chips (Weekend / Week / Month) and a horizontally scrolling row of month cards (May 2026, June 2026, July 2026 …) each with a calendar icon. For Restaurant reservation this becomes a single-day picker plus time-slot chips (Breakfast / Lunch / Dinner / Late) and party size below.

**Who? card** uses **stepper rows** — each row has a label, helper text, and a circular − / + control with the count in the middle. Disabled when count is 0. For Restaurant reservation: Adults / Kids / High chair / Dietary needs (toggle row).

**Modal footer** is sticky: "Clear all" on the left as a text button, "Search" on the right as a filled accent pill with a magnifying-glass icon. While inside Where?/Who? the button reads "Next" instead of Search to push you through the steps. The whole transition between cards is a smooth 250ms ease-in-out height animation, with a subtle vertical scroll if needed. The expanded card has a 2px black border to make it visually pop above the others.

## 4. Search Results Screen

This is a hybrid map-plus-list pattern that you can lift wholesale.

- The top is a **collapsed search summary** ("Homes in Granada / Any week · Add guests") rendered as a tappable pill — tapping it reopens the full-screen search modal.
- A round **filter icon button** sits to the right of that pill, opening the filters modal.
- The screen is split horizontally: the **upper ~40% is an interactive map** with custom **price-pill markers** (e.g., "$746"). Tapping a marker highlights it black/white and previews the listing. There's a "Granada" location tag floating top-left.
- The **lower section is a sheet** ("Over 1,000 homes") that you can drag up to expand to full screen. Cards stack vertically. A **floating "Map" pill** appears at the bottom-center when scrolling the list to instantly toggle back to the map.

Translate this directly: top half is a map of restaurants with price-or-rating pill markers, bottom half is a draggable sheet with restaurant cards, and a floating "Map" button to return.

## 5. Listing/Restaurant Card

Anatomy:

- **Square image** with rounded corners (16px). A horizontally swipeable carousel with **dot indicators** centered at the bottom (5–6 dots, the active one is white, inactive ones are 40% white). Animation is a CSS scroll-snap with a 300ms ease.
- **Top-left badge pill** (white pill, black text) for "Guest favorite" / "Superhost" / "Popular". Restaurant reservation: "Michelin", "Local favorite", "New".
- **Top-right heart button** with three states: outline (default), filled white-on-dark, filled accent on saved. The save action triggers a satisfying scale 1 → 1.3 → 1 bounce (~400ms) plus a faint particle/sparkle effect.
- **Below image:** title (one line, 600 weight), location, beds/details (small gray text), then **price line** with an underline-on-hover and the rating star with score on the right of the title. For Restaurant reservation: name, cuisine + neighborhood, price-tier (\$\$\$) and average wait time, rating to the right.

## 6. Filter Modal

A bottom-sheet modal with these reusable sections — every one of them maps cleanly to restaurant filters:

- **Recommended for you:** three illustrated filter cards in a row (each ~110px tall) with a 3D icon, label, and a tap-to-toggle border that goes black on selection. Restaurant reservation: "Outdoor seating", "Reserves quickly", "Family friendly".
- **Type of place:** segmented control with three options. Restaurant reservation: Dine-in / Takeout / Delivery.
- **Price range:** a histogram (mini bar chart of listing distribution) with a two-handle range slider underneath, plus min/max chip inputs. Drag handles to update the histogram color in real time. Restaurant reservation: price-tier slider \$ → \$\$\$\$ with cuisine count distribution.
- **Rooms and beds:** stepper rows (Bedrooms / Beds / Bathrooms — / Any / +). Restaurant reservation: Party size, # of tables to combine.
- **Amenities:** chip multi-select with icon + label, with a "Show more ⌄" expander. Restaurant reservation: Vegan options, Halal, Gluten-free, Wine list, Live music, Wi-Fi, Pet-friendly.
- **Standout stays:** large stacked rectangular cards with icon + title + subtitle (e.g., "Guest favorite — The most loved homes"). Restaurant reservation equivalent: "Critics' Picks", "Hidden gems".
- **Sticky footer:** "Clear all" text button left, "Show 1,000+ places" filled accent pill right that updates its count live as filters change.

## 7. Listing Detail (you said Hotel page is done — but a few patterns to confirm you have)

- **Hero image fills the top half** with a small "1 / 24" indicator pill in the bottom right. Tapping opens a full-screen photo grid.
- Floating top-left **back button** and top-right **share + heart** in soft white circular backgrounds — they fade their backgrounds in/out as you scroll past the image.
- A **content card** slides up over the bottom of the image with the title, then key facts in a single line, then a **rating + Guest-favorite + reviews tri-column block** with thin dividers between them.
- Host card row, then **icon-prefixed feature rows** (location icon + "Lots to do nearby" with helper text). The "Where you'll sleep" card with a single small image + bed details is an interesting compact way of summarizing rooms — for Restaurant reservation you can do "What you'll eat" with a chef's-pick dish.
- **What this place offers** is a bullet-style icon list with a "Show all 48 amenities" gray pill.
- Reviews section shows a horizontal **swipeable carousel of review cards** (avatar + name + location + 5-star + date + text + Show more), then a "Show all 399 reviews" gray pill button.
- "Where you'll be" embeds a static map preview with an expand icon and a layers icon — tapping opens full map.
- **Sticky bottom CTA bar:** total/night price on the left, "Check availability" filled accent pill on the right. This bar is **always visible** regardless of scroll. For Restaurant reservation: "Free reservation · ★ 4.78" with "Reserve a table" CTA.

## 8. Other Pages

**Wishlists** is a 2-column grid of **collection cards** — each card is a 2×2 mosaic of preview images with the collection name and "X saved" / "Today" subtitle. Top-right has an "Edit" button. For Restaurant reservation: Saved restaurants collections (Date Night, Brunch Spots, etc.).

**Trips (empty state)** is a beautiful pattern to copy: a centered illustrated stack of skeleton cards (3 fanned-out placeholder cards with image squares), an H2 ("Build the perfect trip"), a paragraph of helper text, and an accent CTA pill ("Get started"). Use this exact composition for "No reservations yet" in Restaurant reservation.

**Profile** has a **large avatar + name card** at top (white card with soft shadow), followed by a 2-column grid of feature cards using 3D illustrations (Past trips, Connections — both with a "NEW" pill badge). Below that, a vertical list of settings rows with leading icon + label + chevron right. The "Become a host" promo is a horizontal card with an illustration. For Restaurant reservation the parallel is "Become a partner restaurant".

## 9. Animation Vocabulary (Reuse Throughout)

Keep the animation palette tight — Airbnb basically uses just six motions:

- **Modal-from-source:** the search pill literally grows into a full-screen modal (shared element transition). 300ms cubic-bezier(0.2, 0, 0, 1).
- **Accordion expand:** 250ms ease-in-out height, with the active card gaining a 2px black border and the others fading content to ~70% opacity.
- **Heart pop:** 1 → 1.3 → 1 scale, 400ms with a slight overshoot easing. Color crossfades from outline to filled accent.
- **Tab underline slide:** the underline indicator translates between tab positions in 200ms ease-out.
- **Carousel snap:** native scroll-snap with momentum, dot indicator opacity crossfades.
- **Sheet drag:** spring-physics drag-to-expand on map+list and modal sheets.

There are intentionally **no parallax, hero zoom, or entrance staggering** anywhere on the mobile site — restraint is part of the brand.

## 10. Pages You Should Build for Restaurant reservation

Mapping the analysis to your remaining work, in priority order:

1. **Search modal** — full-screen, three-step (Where / When / Who) with the same accordion + segmented + chip + stepper components. This is the heart of the app.
2. **Search Results** — map+sheet hybrid with price-pill markers and floating Map toggle. Reuse restaurant cards.
3. **Filters modal** — reuse all eight filter section types (recommended cards, segmented, histogram-slider, steppers, chips, stacked-cards, expandable category list, sticky footer).
4. **Restaurant card component** — the single most reused atom. Carousel + badge + heart + meta block.
5. **Saved / Wishlists** — grid of mosaic collection cards with Edit affordance.
6. **Reservations (Trips)** — illustrated empty state + active reservation cards (use a vertical timeline like Airbnb's "Build the perfect trip" preview).
7. **Profile** — avatar card + feature cards + settings list. Add "Dietary preferences" as a featured card; this is restaurant-specific value.
8. **Onboarding / Empty states** — copy the illustrated 3D-icon + headline + helper + CTA pattern Airbnb uses for empty Trips and feature promos.

If you'd like, I can drill deeper into any one of these — for example, screen-by-screen Figma-spec-style breakdowns of the search modal with exact spacing, or HTML/CSS sample code matching the accordion behavior. Just tell me which page to start prototyping.