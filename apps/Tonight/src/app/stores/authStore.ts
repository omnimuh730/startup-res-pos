/* Simple module-level auth state */
let _authed = false;
const listeners = new Set<() => void>();

export const authStore = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  getSnapshot() {
    return _authed;
  },
  setAuthed(v: boolean) {
    if (_authed === v) return;
    _authed = v;
    listeners.forEach((l) => l());
  },
};
