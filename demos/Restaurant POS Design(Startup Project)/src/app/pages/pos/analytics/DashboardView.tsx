import { useState } from "react";
import { TrendingUp, TrendingDown, ShoppingCart, XCircle, CreditCard, Banknote } from "lucide-react";
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useThemeClasses } from "../theme-context";
import { DateFilterBar, type Period } from "./DateFilterBar";
import { AnimatedContent } from "./AnimatedContent";
import { useAnalyticsCurrency } from "./currency";

// ₩ and $ are independent pools — totally uncorrelated (different peaks, different shapes).
const HOURLY_DATA = [
  { label: "8",  revenueUsd: 40,   revenueKrw: 680_000,   orders: 8 },
  { label: "9",  revenueUsd: 120,  revenueKrw: 1_240_000, orders: 14 },
  { label: "10", revenueUsd: 85,   revenueKrw: 2_180_000, orders: 28 },
  { label: "11", revenueUsd: 310,  revenueKrw: 4_620_000, orders: 52 },
  { label: "12", revenueUsd: 620,  revenueKrw: 5_900_000, orders: 85 },
  { label: "13", revenueUsd: 540,  revenueKrw: 3_280_000, orders: 72 },
  { label: "14", revenueUsd: 180,  revenueKrw: 1_640_000, orders: 35 },
  { label: "15", revenueUsd: 90,   revenueKrw: 460_000,   orders: 18 },
  { label: "16", revenueUsd: 75,   revenueKrw: 320_000,   orders: 12 },
  { label: "17", revenueUsd: 220,  revenueKrw: 1_080_000, orders: 32 },
  { label: "18", revenueUsd: 1180, revenueKrw: 2_940_000, orders: 68 },
  { label: "19", revenueUsd: 1840, revenueKrw: 3_420_000, orders: 92 },
  { label: "20", revenueUsd: 1520, revenueKrw: 4_860_000, orders: 78 },
  { label: "21", revenueUsd: 880,  revenueKrw: 5_720_000, orders: 45 },
  { label: "22", revenueUsd: 210,  revenueKrw: 2_380_000, orders: 18 },
];

const WEEKLY_DATA = [
  { label: "Mon", revenueUsd: 480,  revenueKrw: 4_180_000, orders: 42 },
  { label: "Tue", revenueUsd: 1640, revenueKrw: 1_920_000, orders: 48 },
  { label: "Wed", revenueUsd: 820,  revenueKrw: 6_340_000, orders: 55 },
  { label: "Thu", revenueUsd: 2180, revenueKrw: 3_260_000, orders: 50 },
  { label: "Fri", revenueUsd: 1240, revenueKrw: 5_820_000, orders: 68 },
  { label: "Sat", revenueUsd: 2940, revenueKrw: 2_480_000, orders: 82 },
  { label: "Sun", revenueUsd: 620,  revenueKrw: 4_960_000, orders: 61 },
];

const MONTHLY_DATA = [
  { label: "W1", revenueUsd: 4820,  revenueKrw: 12_360_000, orders: 268 },
  { label: "W2", revenueUsd: 9240,  revenueKrw: 18_780_000, orders: 312 },
  { label: "W3", revenueUsd: 6120,  revenueKrw: 26_450_000, orders: 365 },
  { label: "W4", revenueUsd: 10940, revenueKrw: 15_260_000, orders: 338 },
];

const QUARTERLY_DATA = [
  { label: "Jan", revenueUsd: 18560, revenueKrw: 94_200_000,  orders: 1080 },
  { label: "Feb", revenueUsd: 32840, revenueKrw: 68_400_000,  orders: 996 },
  { label: "Mar", revenueUsd: 24720, revenueKrw: 112_880_000, orders: 1232 },
  { label: "Apr", revenueUsd: 38900, revenueKrw: 79_420_000,  orders: 1283 },
];

// Domestic (₩) and Foreign ($) are tracked as independent registers — not converted.
// Each pool has its own totals, growth %, ticket size, cancel count — no relationship.
interface KpiRow {
  totalRev: number;
  totalOrders: string;
  avgTicket: number;
  cancels: string;
  revChange: string;
  ordChange: string;
  ticketChange: string;
  cancelChange: string;
}
const KPI_FOREIGN: Record<string, KpiRow> = {
  today:    { totalRev: 8450,   totalOrders: "38",    avgTicket: 22.24, cancels: "1", revChange: "+7.4%",  ordChange: "+2.1%",  ticketChange: "+5.2%",  cancelChange: "-50%" },
  week:     { totalRev: 9920,   totalOrders: "186",   avgTicket: 53.34, cancels: "4", revChange: "-2.8%",  ordChange: "+11.0%", ticketChange: "-12.4%", cancelChange: "+33%" },
  month:    { totalRev: 31120,  totalOrders: "682",   avgTicket: 45.63, cancels: "19", revChange: "+18.6%", ordChange: "+6.4%",  ticketChange: "+11.5%", cancelChange: "-14%" },
  "3month": { totalRev: 115020, totalOrders: "2,108", avgTicket: 54.56, cancels: "58", revChange: "+21.3%", ordChange: "+8.2%",  ticketChange: "+12.1%", cancelChange: "-6%" },
  custom:   { totalRev: 9920,   totalOrders: "186",   avgTicket: 53.34, cancels: "4", revChange: "-2.8%",  ordChange: "+11.0%", ticketChange: "-12.4%", cancelChange: "+33%" },
};
const KPI_DOMESTIC: Record<string, KpiRow> = {
  today:    { totalRev: 3_840_000,   totalOrders: "54",    avgTicket: 71_100, cancels: "3",  revChange: "-4.1%",  ordChange: "+18.6%", ticketChange: "-19.1%", cancelChange: "+200%" },
  week:     { totalRev: 28_960_000,  totalOrders: "312",   avgTicket: 92_820, cancels: "11", revChange: "+24.6%", ordChange: "+3.3%",  ticketChange: "+20.6%", cancelChange: "-18%" },
  month:    { totalRev: 82_840_000,  totalOrders: "1,486", avgTicket: 55_740, cancels: "42", revChange: "+6.1%",  ordChange: "+14.2%", ticketChange: "-7.0%",  cancelChange: "+9%" },
  "3month": { totalRev: 324_160_000, totalOrders: "4,820", avgTicket: 67_250, cancels: "172", revChange: "+9.8%",  ordChange: "+21.8%", ticketChange: "-9.8%",  cancelChange: "-3%" },
  custom:   { totalRev: 28_960_000,  totalOrders: "312",   avgTicket: 92_820, cancels: "11", revChange: "+24.6%", ordChange: "+3.3%",  ticketChange: "+20.6%", cancelChange: "-18%" },
};
// Payment-method split is its own property per pool (not same %).
const PAYMENT_SPLIT: Record<"foreign" | "domestic", { name: string; value: number; fill: string; icon: typeof CreditCard }[]> = {
  foreign: [
    { name: "Credit Card", value: 78, fill: "#3b82f6", icon: CreditCard },
    { name: "Cash",        value: 22, fill: "#22c55e", icon: Banknote },
  ],
  domestic: [
    { name: "Credit Card", value: 41, fill: "#3b82f6", icon: CreditCard },
    { name: "Cash",        value: 59, fill: "#22c55e", icon: Banknote },
  ],
};

function SalesTooltip({ active, payload, isDomestic }: any) {
  if (!active || !payload?.length) return null;
  const rev = payload[0];
  const val = rev?.value ?? 0;
  const label = isDomestic ? `₩${Math.round(val).toLocaleString()}` : `$${val.toLocaleString()}`;
  return (
    <div className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[0.875rem] shadow-lg">
      <span>{label}</span>
    </div>
  );
}

function getDataForPeriod(period: Period) {
  switch (period) {
    case "today": return HOURLY_DATA;
    case "week": case "custom": return WEEKLY_DATA;
    case "month": return MONTHLY_DATA;
    case "3month": return QUARTERLY_DATA;
  }
}

export function DashboardView() {
  const [period, setPeriod] = useState<Period>("week");
  const tc = useThemeClasses();
  const { isDomestic } = useAnalyticsCurrency();

  const trendData = getDataForPeriod(period);
  const kpis = (isDomestic ? KPI_DOMESTIC : KPI_FOREIGN)[period];
  const paymentSplit = PAYMENT_SPLIT[isDomestic ? "domestic" : "foreign"];

  const fmtMoney = (v: number) =>
    isDomestic ? `₩${Math.round(v).toLocaleString()}` : `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const kpiCards = [
    { label: "Total Orders", value: kpis.totalOrders, change: kpis.ordChange, up: !kpis.ordChange.startsWith("-"), icon: ShoppingCart },
    { label: "Avg Ticket Size", value: fmtMoney(kpis.avgTicket), change: kpis.ticketChange, up: !kpis.ticketChange.startsWith("-"), icon: TrendingUp },
    { label: "Cancellations", value: kpis.cancels, change: kpis.cancelChange, up: kpis.cancelChange.startsWith("-"), icon: XCircle },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      <DateFilterBar period={period} setPeriod={setPeriod} title="Sales Dashboard" />

      <AnimatedContent animationKey={period} className="flex-1 min-h-0 flex flex-col gap-3">

      {/* Total Revenue - full width top */}
      <div className={`${tc.card} rounded-xl p-4 sm:p-5`}>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className={`text-[0.875rem] ${tc.subtext}`}>Total Revenue</p>
              <span className={`flex items-center gap-0.5 text-[0.8125rem] ${!kpis.revChange.startsWith("-") ? "text-green-500" : "text-red-500"}`}>
                {!kpis.revChange.startsWith("-") ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpis.revChange}
              </span>
            </div>
            <p className={`text-[1.75rem] sm:text-[2.25rem] ${tc.heading}`}>{fmtMoney(kpis.totalRev)}</p>
          </div>
          <div className="space-y-3">
            {paymentSplit.map((d) => {
              const amount = Math.round(kpis.totalRev * d.value / 100);
              const label = fmtMoney(amount);
              const Icon = d.icon;
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" style={{ color: d.fill }} />
                      <span className={`text-[0.875rem] ${tc.text2} truncate`}>{d.name}</span>
                    </div>
                    <span className={`text-[0.9375rem] ${tc.heading} shrink-0`}>{label}</span>
                  </div>
                  <div className={`h-1.5 rounded-full w-full ${tc.isDark ? "bg-slate-700" : "bg-slate-200"}`}>
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.fill }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPIs + Sales Trend */}
      <div className="flex flex-col gap-3 flex-1 min-h-0">
          <div className="grid grid-cols-3 gap-2">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className={`${tc.card} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`w-4 h-4 ${tc.subtext}`} />
                  <span className={`flex items-center gap-0.5 text-[0.8125rem] ${kpi.up ? "text-green-500" : "text-red-500"}`}>
                    {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className={`text-[1.5rem] ${tc.heading}`}>{kpi.value}</p>
                <p className={`text-[0.8125rem] ${tc.subtext} mt-0.5`}>{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className={`${tc.card} rounded-xl p-4 sm:p-5 flex-1 min-h-0 flex flex-col`}>
        <h3 className={`text-[1rem] ${tc.heading}`}>Sales Trend</h3>
        <p className={`text-[0.875rem] ${tc.subtext} mt-0.5 mb-3`}>
          Tap on the chart to view revenue and order count
        </p>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <defs key="defs">
                <linearGradient id={`trendGrad-${period}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke={tc.gridStroke} vertical={false} />
              <XAxis key="xaxis" dataKey="label" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fontSize: 11, fill: tc.tickFill }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" content={<SalesTooltip isDomestic={isDomestic} />} />
              <Area key="area" type="monotone" dataKey={isDomestic ? "revenueKrw" : "revenueUsd"} stroke="#3b82f6" fill={`url(#trendGrad-${period})`} strokeWidth={2.5}
                dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
          </div>
      </div>

      </AnimatedContent>
    </div>
  );
}
