# Tonight UI System Guide

This guide turns the Airbnb-inspired direction into concrete rules for Tonight. Use it when designing or editing Profile, Wishlist, Discover, Search, Search Results, Dining, Notifications, and future mobile flows.

## Design Personality

Tonight should feel clean, premium, and direct: Airbnb-like calm surfaces, CatchTable-like restaurant energy, and polished mobile app motion. The UI should be neat and compact, with the content doing most of the work.

Use these local screens as reference quality:

- Profile main page: confident title, compact wallet card, soft elevated reward cards, simple row actions.
- Discover search: full-screen search flow, bordered active accordion card, pill inputs, compact footer CTA.
- Discover search header: large search pill with a separate circular map button.
- Wishlist flow: bottom sheet, mosaic previews, clean saved toast, gathered list confirmation modal.
- Wishlist page: simple title, two-column image mosaics, clear saved counts, no unnecessary chrome.

## Tokens

Use the existing CSS variables from `src/styles/theme.css` instead of hard-coded colors when possible.

- Background: `var(--background)` / `#FFFFFF`
- Text: `var(--foreground)` / `#222222`
- Muted text: `var(--muted-foreground)` / `#717171`
- Card: `var(--card)` / `#FFFFFF`
- Subtle surface: `var(--secondary)` / `#F7F7F7`
- Border: `var(--border)` / `#DDDDDD`
- Primary action: `var(--primary)` / `#FF385C`
- Success: `var(--success)`
- Warning: `var(--warning)`
- Info: `var(--info)`
- Base radius: `var(--radius)` / `0.75rem`

Use pink sparingly. It is for primary CTAs, active nav state, badges, selected controls, notification counts, and special rewards. Most surfaces should remain white, black, and soft gray.

## Typography

- Use strong, simple hierarchy.
- Page titles: 28-32px, weight 700, tight but not cramped.
- Section titles: 18-22px, weight 700.
- Card titles: 14-16px, weight 600-700.
- Body/meta text: 12-14px, muted gray for secondary details.
- Do not scale type with viewport width.
- Keep letter spacing at `0` unless using tiny uppercase labels, where small positive tracking is acceptable.

## Spacing And Density

- Mobile horizontal padding is usually 16-24px.
- Compact rows and cards are preferred over large editorial gaps.
- Common vertical spacing: 8px, 12px, 16px, 20px, 24px.
- Large empty top/bottom/side gaps should be treated as defects.
- Bottom nav is app chrome. Do not pad pages manually for it.
- Cards should not sit inside other cards unless it is a real nested control.

## Radius And Elevation

- Search pills and primary CTAs: fully rounded/pill.
- Cards: 16-24px where the existing screen style uses soft mobile cards.
- Bottom sheets: rounded top corners, usually 24-32px.
- Modals: rounded 24-32px, centered or bottom-sheet depending on use.
- Shadows should be soft and layered, not harsh:
  - Light card shadow: `0 8px 24px rgba(0,0,0,0.08)`
  - Elevated modal/sheet shadow: `0 18px 50px rgba(0,0,0,0.18)`

## App Chrome And Full Pages

- Normal tab pages live above the bottom nav.
- Fixed tab-owned full pages that should remain within the tab shell should use `bottom: var(--app-bottom-chrome-height, 0px)`.
- App-level flows may cover the whole viewport when appropriate: auth, QR Pay, scanner, booking, restaurant detail, and payment.
- Never compensate for nav with scattered `pb-24`, `bottom-36`, or measured nav offsets.

## Modals, Sheets, And Overlays

- Blocking modals cover everything, including nav and QR.
- Use shared primitives where possible:
  - `Modal` for centered blocking dialogs.
  - `BottomSheet` for mobile sheet decisions.
  - `Drawer` for side/top/bottom panels.
  - `Dialog`, `Sheet`, `AlertDialog` for Radix-based UI.
  - `Overlay` for generic blocking overlay needs.
- Overlay layer: `fixed inset-0 z-[500]`.
- Content layer: `z-[501]`.
- Portal modal-like blockers to `document.body`.
- Sheet handles should be small, centered, and subtle.

## Search And Results

- Search entry should be a large pill with icon, title, and compact summary.
- Put the map redirect button as a separate circular button beside the search pill.
- Search modal should use the Where / When / Who accordion model:
  - Active card gets strong black border.
  - Inactive cards collapse into compact summary rows.
  - Footer has `Clear all` left and primary `Search` or `Next` right.
- Search results should use an Airbnb-style map plus draggable list sheet:
  - Map fills available content viewport.
  - Peek state still exposes the handle and result count.
  - Dragging the list itself should collapse/expand when appropriate.
  - Floating Map/List button should sit above content, not above fake nav padding.

## Cards And Imagery

- Use real food, restaurant, place, or map visuals when the user needs to inspect content.
- Restaurant cards should include:
  - Rounded image with badge and heart/save control.
  - Dot indicators for carousel-like images.
  - Name, cuisine/location, availability/fee, price tier, rating.
  - One-line or two-line text clamping when content can overflow.
- Wishlist collection cards should use mosaic images and simple saved-count metadata.
- Empty states should use compact illustrated or image-based compositions with a clear headline and one action.

## Animation Principles

- Use Framer Motion for app-level interactions and refined micro-interactions.
- Preferred motion vocabulary:
  - Modal fade + scale: 180-260ms.
  - Sheet drag: spring, responsive to velocity.
  - Accordion expand: 220-280ms.
  - Save/heart action: scale pop with color fill.
  - Delete/remove action: fade + height collapse or slide out.
  - Success action: quick check/pulse and toast.
  - One-shot reveal/merge animations for special empty states or rewards.
- Avoid constant looping animation unless it communicates live activity.
- Keep motion tight and elegant; no excessive bouncing, parallax, or decorative delays.

## Interaction Rules

- Important icon buttons should have clear labels or accessible names.
- Use icons for familiar actions: back, close, map, filter, delete, check, heart, notification.
- Use segmented controls for mutually exclusive filters.
- Use chips for amenity/cuisine/filter selection.
- Use steppers for counts.
- Use bottom sheets for mobile option sets and filters.
- State-changing actions must animate and/or toast.

## Quality Checklist

- No visible gap below the bottom nav.
- No text overlap or clipped button labels on mobile.
- No page content hidden behind the nav unless it is a modal or app-level flow.
- Modal backdrop covers nav and QR.
- Search result peek, half, full, and map-preview states remain reachable.
- Long body text clamps cleanly with ellipsis where needed.
- `pnpm build` passes before handoff when feasible.
