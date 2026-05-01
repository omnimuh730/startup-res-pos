import type { NewsItem } from "./types";
import { MOCK_NEWS } from "./newsData";

export const CATEGORY_COLOR: Record<NewsItem["category"], "primary" | "success" | "warning" | "destructive" | "info" | "secondary"> = {
  Trending: "destructive",
  "New Opening": "success",
  Award: "warning",
  Event: "info",
  Chef: "primary",
  Guide: "secondary",
};

export function fetchNews(): Promise<NewsItem[]> {
  return new Promise((resolve, reject) => {
    const delay = 700 + Math.random() * 700;
    setTimeout(() => {
      if (Math.random() < 0.05) reject(new Error("Network timeout"));
      else resolve(MOCK_NEWS);
    }, delay);
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
