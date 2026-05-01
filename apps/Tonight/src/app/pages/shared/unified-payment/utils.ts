const fmtKRW = (value: number) => `\u20A9${Math.round(value).toLocaleString()}`;
const fmtUSD = (value: number) => `$${value.toFixed(2)}`;
const pct = (value: number, max: number) => Math.max(0, Math.min(100, (value / Math.max(max, 1)) * 100));

function formatPaying(krw: number, usd: number) {
  const parts = [krw > 0 ? fmtKRW(krw) : "", usd > 0 ? fmtUSD(usd) : ""].filter(Boolean);
  return parts.length ? parts.join(" + ") : "Enter amount";
}

export { fmtKRW, fmtUSD, pct, formatPaying };
