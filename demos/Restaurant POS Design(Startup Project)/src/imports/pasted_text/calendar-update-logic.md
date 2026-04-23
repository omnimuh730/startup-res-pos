# Prompt for Updating Calendar View

Update the Calendar View of the Glass Onion POS reservation system to implement the following reservation duration and auto-extension logic. Do not add any configuration UI — all values below are hardcoded constants.

## 1. Duration Estimation (hardcoded, no user configuration)

When a reservation request arrives or is created, automatically calculate its duration from party size using this step function:

```
function estimateDuration(partySize: number): number {
  if (partySize <= 2) return 1.0;   // hours
  if (partySize <= 4) return 2.0;
  if (partySize <= 6) return 2.5;
  return 3.0;                        // 7 or more
}
```

The duration must be applied automatically to every incoming reservation request. Neither the guest nor the restaurant staff can modify it — remove any UI affordance (drag handles on block edges, duration input fields, etc.) that would allow editing the duration of a reservation.

Computed end time:
```
T_end = T_start + estimateDuration(partySize)
```

## 2. Reservation Block Rendering

Each reservation block on the calendar spans `[T_start, T_end_current)` where `T_end_current` starts equal to `T_end` and may grow via auto-extension (see section 3). The block width must re-render whenever `T_end_current` changes.

## 3. Auto-Extension on Unpaid Overrun

Implement a timer that evaluates each `SEATED` reservation block:

```
const EXTENSION_INCREMENT_MINUTES = 30;

// Runs every minute, or on clock tick
function checkOverrun(block) {
  if (block.status !== 'SEATED') return;
  if (block.paymentStatus === 'PAID') return;
  
  if (Date.now() >= block.T_end_current) {
    block.T_end_current = addMinutes(block.T_end_current, EXTENSION_INCREMENT_MINUTES);
    block.extensionCount += 1;
    triggerConflictCheck(block);
    rerender(block);
  }
}
```

The extension is silent and automatic — no approval prompt, no "extend" button, no restaurant action required. The block simply grows on the calendar in 30-minute steps until a payment event fires.

## 4. Payment-Triggered Completion

When a POS payment event is received for the party at a given table:

```
function onPaymentReceived(tableId) {
  const block = findSeatedBlock(tableId);
  block.T_end_actual = Date.now();
  block.status = 'COMPLETED';
  block.paymentStatus = 'PAID';
  freeTable(tableId);
  rerender(block);
}
```

The block closes at the payment moment regardless of remaining estimated time, and the table returns to the available pool.

## 5. Conflict Notification to Restaurant Staff

Whenever `T_end_current` is extended, check whether the block now overlaps with the next confirmed reservation on the same table. Render visual states on the block:

```
function getBlockVisualState(block, nextReservation) {
  const now = Date.now();
  const overrunMs = block.T_end_current - block.T_end_original;
  
  if (now < block.T_end_original) return 'ON_TIME';            // normal blue
  if (overrunMs < 30 * 60 * 1000) return 'OVERRUN_SOFT';       // amber border
  return 'OVERRUN_HARD';                                        // red border
}
```

Additionally:

- On the **first** auto-extension (when the block transitions from `ON_TIME` to `OVERRUN_SOFT`), fire a notification to restaurant staff: a toast or banner in the Calendar View with the text `"Table {N} running over — {GuestName} still seated"`.
- On the **second** auto-extension (transition to `OVERRUN_HARD`), if there is a next reservation on that same table, fire a second notification: `"⚠ Table {N} conflict — {NextGuestName} reserved at {T_start}"`, and render a ⚠ indicator badge on the next reservation's request card in the sidebar.
- Notifications are informational only. Do not prompt the host to take any action, do not auto-reassign the next reservation, and do not block further extensions.

## 6. State Machine

A reservation block moves through these states:

```
REQUESTED  → CONFIRMED  → SEATED  → COMPLETED
                                ↻  (auto-extend loop while unpaid)
```

- `REQUESTED → CONFIRMED`: host clicks Approve
- `CONFIRMED → SEATED`: party arrives (host action or auto on start time)
- `SEATED → COMPLETED`: payment event fires (terminal state)
- `SEATED → SEATED`: auto-extension loop; only `T_end_current` changes

## 7. Acceptance Criteria

- Incoming reservation requests auto-populate their duration from party size using the table above.
- No UI exists to edit a reservation's duration.
- Blocks that pass their end time without payment extend by 30 minutes silently.
- The first extension triggers a "running over" notification.
- The second extension triggers a conflict warning notification *if* another reservation exists on the same table.
- Extensions continue indefinitely in 30-minute increments until payment fires or the block is manually completed.
- A payment event immediately closes the block and frees the table.
- Existing capacity and conflict checks (deactivated table rows for incompatible party size or time overlap) remain unchanged.