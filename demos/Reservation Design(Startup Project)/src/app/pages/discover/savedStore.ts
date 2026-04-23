/* Module-level saved store (avoids parent re-renders) */
import { useSyncExternalStore } from "react";

export const _savedRIds = new Set<string>();
export const _savedFNames = new Set<string>();
let _savedListeners = new Set<() => void>();
export function _notifySaved() { _savedListeners.forEach((fn) => fn()); }
function _subscribeSaved(fn: () => void) { _savedListeners.add(fn); return () => { _savedListeners.delete(fn); }; }
export let _savedSnapshot = 0;
function _getSavedSnapshot() { return _savedSnapshot; }

export function useSavedVersion() {
  return useSyncExternalStore(_subscribeSaved, _getSavedSnapshot);
}

export function incrementSavedSnapshot() {
  _savedSnapshot++;
}
