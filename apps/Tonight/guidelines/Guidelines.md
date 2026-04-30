# Tonight Build Guidelines

Use this file as the active project guideline for app shell behavior, modal behavior, and the Airbnb-inspired visual direction. For deeper Airbnb pattern research, also read `airbnbguideline.md`. For the concise design system rules, read `tonight-ui-system.md`.

## App Chrome Rules

- Tonight is a mobile app first. The bottom navigation is app chrome, not page content.
- Normal tab pages must render inside `AppLayout` content and let the shell reserve the bottom nav row.
- Do not add fake nav clearance such as `pb-24`, `pb-[calc(...)]`, `bottom-20`, `bottom-36`, or `bottomNavHeight + ...` just to avoid the nav.
- If a tab-owned fixed full-page surface must stay inside the tab experience, bound it above the nav with `bottom: var(--app-bottom-chrome-height, 0px)`.
- Full-screen app flows such as auth, QR Pay, booking, scanner, and detail flows may intentionally cover or hide the nav when they act as app-level flows.

## Modal Rules

- Pages respect the nav. Modals cover the nav.
- Modal, dialog, sheet, drawer, and blocking overlay surfaces must cover the whole app, including the bottom nav and center QR button.
- Prefer existing primitives: `Modal`, `BottomSheet`, `Drawer`, `Dialog`, `Sheet`, `AlertDialog`, and `Overlay`.
- New modal overlays should use `fixed inset-0 z-[500]`; modal panels/content should use `z-[501]`.
- Modal-like surfaces that block the app should portal to `document.body` or use a shared primitive that already portals.
- Do not mount blocking modals inside a scrollable page container if that causes them to be clipped by app chrome.

## Design Direction

- Follow the Airbnb-inspired Tonight style: clean white backgrounds, strong black text, soft gray supporting copy, vivid pink primary actions, rounded mobile sheets, calm shadows, real food/place imagery, and restrained but delightful motion.
- Use current app examples as the local source of truth: Profile main page, Wishlist page, Discover search modal, Discover search pill with map button, wishlist selection sheet, saved toast, and gathered wishlist confirmation modal.
- Prefer useful product UI over marketing layout. The first screen should be the working app surface.
- Keep spacing compact and mobile-dense. Avoid large empty gaps above, beside, or below content.
- Avoid one-note palettes and decorative gradients/orbs. Let content imagery, clean cards, and precise motion carry the experience.

## Motion Direction

- Use Framer Motion for visible page, modal, sheet, card, and action transitions.
- Motion should feel smooth and purposeful: spring sheets, soft fade/scale modals, heart/save pops, selected-state pulses, and small action feedback.
- Do not add endless decorative animation unless the user explicitly asks for it. One-shot celebratory or reveal animations are preferred.
- Every destructive or state-changing action should give feedback, such as press scale, fade/slide removal, success check, or toast.

## Verification

- For layout changes, verify mobile widths first.
- Check that content does not overlap the bottom nav unless it is a modal or app-level full-screen flow.
- Check that modal backdrops cover the nav and QR button.
- Run `pnpm build` in `apps/Tonight` before handing off implementation work when feasible.
