import { useSyncExternalStore } from "react";

export type AppThemePreference = "light" | "dark" | "system";
export type ResolvedAppTheme = "light" | "dark";

const STORAGE_KEY = "catchtable-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();
let removeSystemListener: (() => void) | null = null;

function hasDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function readPreference(): AppThemePreference {
  if (!hasDOM()) return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "dark" || stored === "system" ? stored : "light";
}

function systemPrefersDark() {
  return hasDOM() && window.matchMedia(DARK_QUERY).matches;
}

function resolveTheme(preference: AppThemePreference): ResolvedAppTheme {
  if (preference === "dark") return "dark";
  if (preference === "system" && systemPrefersDark()) return "dark";
  return "light";
}

function notify() {
  listeners.forEach((listener) => listener());
}

function applyTheme(preference: AppThemePreference) {
  if (!hasDOM()) return;

  const resolved = resolveTheme(preference);
  const root = document.documentElement;

  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolved;

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.content = resolved === "dark" ? "#0E0E11" : "#FF385C";
  }

  notify();
}

function syncSystemListener(preference: AppThemePreference) {
  if (!hasDOM()) return;
  removeSystemListener?.();
  removeSystemListener = null;

  if (preference !== "system") return;

  const query = window.matchMedia(DARK_QUERY);
  const onChange = () => applyTheme("system");
  query.addEventListener("change", onChange);
  removeSystemListener = () => query.removeEventListener("change", onChange);
}

export function initAppTheme() {
  const preference = readPreference();
  applyTheme(preference);
  syncSystemListener(preference);
}

export function setAppThemePreference(preference: AppThemePreference) {
  if (!hasDOM()) return;
  window.localStorage.setItem(STORAGE_KEY, preference);
  applyTheme(preference);
  syncSystemListener(preference);
}

export function getAppThemePreference() {
  return readPreference();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ResolvedAppTheme {
  if (!hasDOM()) return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function useResolvedAppTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "light");
}
