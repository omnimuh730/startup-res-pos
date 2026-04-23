Build an interactive restaurant reservation POS interface for tablet 
landscape (1280×900), dark mode. This is a redesign — prioritize design 
quality and a distinctive visual system over feature completeness.

═══════════════════════════════════════════════════════
CRITICAL: DO NOT USE GENERIC MATERIAL/TAILWIND DEFAULTS
═══════════════════════════════════════════════════════
- No rainbow palettes, no purple/teal/pink decorative colors
- No thin 2-3px accent bars as "data visualization"
- No uniform card grids with matching borders
- Color must carry SEMANTIC meaning, not decoration
- Typography must have strong hierarchy (3x size difference between 
  primary and tertiary info on a card)

═══════════════════════════════════════════════════════
COLOR SYSTEM (use ONLY these, apply by meaning)
═══════════════════════════════════════════════════════
Background:      #0B0F14 (app bg), #141A22 (card bg), #1C242F (raised)
Border subtle:   #222C38
Text:            #E8EDF2 primary, #8A96A6 secondary, #4A5463 tertiary

SEMANTIC STATES (these are the ONLY accent colors allowed):
- Available:     #2A3441 fill, #3A4656 border (quiet, neutral)
- Occupied-Now:  #2B6CFF fill at 15% opacity, #4A8BFF border, text #7BA7FF
- Reserved:      #D98A2B fill at 15% opacity, #E0A355 border, text #F0B870
- Eligible:      #24C38E fill at 20% opacity, #2FE5A8 border + outer 
                 glow shadow 0 0 24px rgba(47,229,168,0.4)
- Conflict:      #E5484D border only, 25% opacity on whole card, 
                 diagonal stripe overlay at 8% opacity
- Live/Now:      #FF4D5E (used ONLY for the live-time indicator)

Rule: every colored element on screen must map to one of these states. 
If you can't name the state, delete the color.

═══════════════════════════════════════════════════════
LAYOUT STRUCTURE
═══════════════════════════════════════════════════════
Top bar (64px):     Hall/Lounge tabs (left) · View switcher 
                    Floor/Table/Calendar (center) · Edit + Notifications (right)

TIME SCRUBBER (96px tall — this is the hero component, do not shrink it):
  Left 200px:       Today | Tomorrow | [date picker chevrons]
  Center (flex):    Timeline from 08:00 to 23:00
  Right 140px:      Current time "12:02 · Fri Apr 17" + LIVE pill

Left sidebar (280px): Search · Waitlist section · Requests section
Main canvas:          Floor View (tables positioned spatially)
Bottom nav (64px):    Floor Plan · Orders · Kitchen · Analytics · Settings

═══════════════════════════════════════════════════════
TIME SCRUBBER — DETAILED SPEC (the hero component)
═══════════════════════════════════════════════════════
The scrubber is the PRIMARY control. Build it as a substantial surface, 
not a thin strip. Structure inside its 96px height:

Row 1 (top 48px) — OCCUPANCY HEATMAP:
  - 15-min vertical bars spanning 08:00–23:00
  - Each bar's height = % of tables booked at that time (0–100%)
  - Bar color: interpolate from #2A3441 (empty) → #D98A2B (full)
  - Generate realistic sample data: light lunch 12:00–14:00 (40-60%), 
    packed dinner 18:30–21:00 (80-95%), quiet otherwise

Row 2 (middle 24px) — TIMELINE TRACK:
  - Horizontal track, hour labels (08, 09, 10... 23)
  - Tick marks every 30min
  - Reservation dots: small 6px circles at exact reservation times, 
    colored per semantic state, with guest initials on hover

Row 3 (bottom 24px) — SCRUBBER HANDLE:
  - A substantial pill (not a dot), 72×28px, draggable along the track
  - Shows current scrubbed time as text inside, e.g. "13:27"
  - Color: #2B6CFF when at Now, #D98A2B when scrubbed to past/future
  - When scrubbed away from Now, show a "Return to Now" button 
    appearing 12px to the right of the pill
  - A thin vertical line extends from the pill up through rows 1-2 
    to the top of the scrubber, so you can see which heatmap bar 
    you're on

Interaction: dragging the pill live-updates the entire floor view below.

═══════════════════════════════════════════════════════
FLOOR VIEW — TABLES
═══════════════════════════════════════════════════════
Position 11 tables on the canvas (mix of rectangles and one circle 
for T5). Match this rough layout:
  Row 1: T1 (2P), T2 (4P), T3 (4P), T4 (2P)
  Row 2: T5 (circle, 4P center-left), T6 (6P), T7 (circle, 2P), T8 (4P)
  Row 3: T9 (6P), T10 (6P), T11 (4P vertical)

Each table card:
- Border-radius: 14px
- Size varies by seat count (2P ≈ 120×90, 4P ≈ 140×100, 6P ≈ 170×110)
- Fill color + border from the SEMANTIC STATES above
- Content hierarchy:
    · Table number — 22px bold, top-left
    · Seat count — 11px, top-right, secondary text
    · State line — 13px, center: "Available" / "Kwon G. · 4P" / "Reserved 18:30"
    · Revenue (if occupied) — 14px accent color, bottom

TIME RIBBON inside each table card (bottom edge, 14px tall):
  - Shows a ±2 hour window around the current scrubber position
  - 30-min segments with thin dividers
  - Colored blocks for this table's bookings in that window 
    (using semantic Reserved/Occupied colors)
  - A 2px vertical line marking "scrubber position on this table's timeline"
  - This line moves in sync with the master scrubber above

═══════════════════════════════════════════════════════
SIDEBAR PANELS
═══════════════════════════════════════════════════════
Waitlist section: orange header "Waitlist" + count pill
  Cards: guest name, minutes waited, party size + phone, notes, 
         [Assign Table] [Remove] buttons

Requests section: orange header "Requests" + "X new" pill
  Cards: guest name, requested time + party size, note (italic, 
         tertiary text), [Approve & Assign] [Deny] buttons

Card style: #141A22 background, 12px radius, 14px internal padding.
Buttons: primary actions use #2B6CFF fill, secondary use outlined style 
with #2A3441 border.

═══════════════════════════════════════════════════════
SAMPLE DATA (use this exact data)
═══════════════════════════════════════════════════════
Current time: 12:02, Fri Apr 17

Waitlist:
- Park J., 9P, 010-1234-5678, "Birthday party", 16m ago
- Kim D., 4P, 010-3456-7890, "Window seat", 7m ago

Requests:
- Kang N., 13:27, 4P, "Quiet area"
- Choi M., 13:57, 2P
- (one more request, generate plausible)

Current table states (at 12:02):
- T2: Occupied-Now, 44,500 W, seated 4P
- T3: Occupied-Now, 52,000 W, seated 4P
- T5: Reserved (Kwon G. arriving 12:27, 4P) — show as Reserved since 
      reservation is within 30min
- T6: has 13:30 reservation (show as Available now, with reservation 
      block visible in the ribbon)
- T10: Occupied-Now, 22,000 W
- T11: has 12:38 reservation (Ji N., 2P) — show as Reserved
- All others: Available

═══════════════════════════════════════════════════════
DELIVERABLE
═══════════════════════════════════════════════════════
A working interactive prototype where:
1. Dragging the scrubber pill updates all table states and ribbons in real-time
2. "Return to Now" button appears when scrubbed away, snaps pill back when clicked
3. Today/Tomorrow tabs switch the data set
4. Tables visually communicate state through the semantic color system, 
   with no ambiguous or decorative colors