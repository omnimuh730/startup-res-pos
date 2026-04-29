import { SectionWrapper, ComponentCard } from "../section-wrapper";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, Legend,
  ComposedChart, Scatter, ScatterChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Treemap, FunnelChart, Funnel, LabelList,
} from "recharts";

const COLORS = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  info: "var(--info)",
  destructive: "var(--destructive)",
  muted: "var(--muted-foreground)",
};
const PIE_COLORS = ["#FF385C", "#00A699", "#FC642D", "#428BFF", "#484848", "#767676", "#8B5CF6", "#F59E0B"];

const revenueData = [
  { month: "Jan", revenue: 4200, expenses: 2800, profit: 1400 },
  { month: "Feb", revenue: 5100, expenses: 3100, profit: 2000 },
  { month: "Mar", revenue: 4800, expenses: 2900, profit: 1900 },
  { month: "Apr", revenue: 6200, expenses: 3400, profit: 2800 },
  { month: "May", revenue: 5800, expenses: 3200, profit: 2600 },
  { month: "Jun", revenue: 7100, expenses: 3800, profit: 3300 },
  { month: "Jul", revenue: 6500, expenses: 3500, profit: 3000 },
  { month: "Aug", revenue: 7800, expenses: 4000, profit: 3800 },
  { month: "Sep", revenue: 7200, expenses: 3700, profit: 3500 },
  { month: "Oct", revenue: 8100, expenses: 4200, profit: 3900 },
  { month: "Nov", revenue: 8800, expenses: 4500, profit: 4300 },
  { month: "Dec", revenue: 9500, expenses: 4800, profit: 4700 },
];

const trafficData = [
  { day: "Mon", users: 1200, sessions: 1800, pageviews: 4500 },
  { day: "Tue", users: 1400, sessions: 2100, pageviews: 5200 },
  { day: "Wed", users: 1100, sessions: 1600, pageviews: 3900 },
  { day: "Thu", users: 1600, sessions: 2400, pageviews: 6100 },
  { day: "Fri", users: 1800, sessions: 2700, pageviews: 7000 },
  { day: "Sat", users: 900, sessions: 1200, pageviews: 2800 },
  { day: "Sun", users: 700, sessions: 950, pageviews: 2200 },
];

const pieData = [
  { name: "Direct", value: 35 },
  { name: "Organic", value: 28 },
  { name: "Social", value: 18 },
  { name: "Referral", value: 12 },
  { name: "Email", value: 7 },
];

const donutData = [
  { name: "Desktop", value: 62 },
  { name: "Mobile", value: 29 },
  { name: "Tablet", value: 9 },
];

const radarData = [
  { subject: "Performance", A: 85, B: 70 },
  { subject: "Reliability", A: 90, B: 80 },
  { subject: "Usability", A: 78, B: 85 },
  { subject: "Security", A: 92, B: 75 },
  { subject: "Scalability", A: 80, B: 65 },
  { subject: "Design", A: 88, B: 90 },
];

const radialData = [
  { name: "Storage", value: 78, fill: "#FF385C" },
  { name: "Memory", value: 65, fill: "#00A699" },
  { name: "CPU", value: 42, fill: "#428BFF" },
  { name: "Network", value: 88, fill: "#FC642D" },
];

const scatterData = Array.from({ length: 40 }, (_, i) => ({
  id: `scatter-${i}`,
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 500 + 50,
}));

const heatmapTreeData = [
  { name: "Components", size: 3200 },
  { name: "Styles", size: 1800 },
  { name: "Utils", size: 1200 },
  { name: "Hooks", size: 900 },
  { name: "Types", size: 600 },
  { name: "Assets", size: 400 },
  { name: "Tests", size: 2100 },
  { name: "Config", size: 300 },
];

const stackedBarData = [
  { q: "Q1", product: 3200, service: 1800, license: 900 },
  { q: "Q2", product: 4100, service: 2200, license: 1100 },
  { q: "Q3", product: 3800, service: 2500, license: 1300 },
  { q: "Q4", product: 5200, service: 2900, license: 1600 },
];

const funnelData = [
  { name: "Visited", value: 8500, fill: "#FF385C" },
  { name: "Searched", value: 5200, fill: "#FC642D" },
  { name: "Viewed Listing", value: 3400, fill: "#F59E0B" },
  { name: "Booked", value: 1800, fill: "#00A699" },
  { name: "Completed", value: 1200, fill: "#428BFF" },
];

// Heatmap data (weekly activity)
const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heatmapHours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"];
const heatmapValues: number[][] = [
  [2, 5, 8, 12, 15, 10, 6, 3, 1],
  [3, 6, 10, 14, 16, 12, 8, 5, 2],
  [1, 4, 7, 11, 13, 9, 5, 3, 1],
  [4, 8, 13, 18, 20, 15, 10, 7, 3],
  [5, 9, 14, 19, 22, 18, 12, 8, 4],
  [8, 12, 10, 8, 7, 9, 14, 16, 12],
  [6, 10, 8, 6, 5, 7, 11, 13, 9],
];

// Waterfall
const waterfallData = [
  { name: "Revenue", value: 9500, type: "positive" },
  { name: "COGS", value: -3200, type: "negative" },
  { name: "Gross Profit", value: 6300, type: "subtotal" },
  { name: "Marketing", value: -1200, type: "negative" },
  { name: "Salaries", value: -2800, type: "negative" },
  { name: "Other", value: -500, type: "negative" },
  { name: "Net Income", value: 1800, type: "total" },
];

// Gauge data
const gaugeData = [
  { name: "Score", value: 76, fill: "#00A699" },
];

// Bubble chart
const bubbleData = Array.from({ length: 20 }, (_, i) => ({
  id: `bubble-${i}`,
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 2000 + 200,
  name: `Item ${i + 1}`,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-[0.75rem]">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

// Heatmap cell color
function heatColor(val: number, max: number) {
  const ratio = val / max;
  if (ratio < 0.2) return "bg-primary/10";
  if (ratio < 0.4) return "bg-primary/25";
  if (ratio < 0.6) return "bg-primary/40";
  if (ratio < 0.8) return "bg-primary/60";
  return "bg-primary/85";
}

export function ChartsSection() {
  return (
    <SectionWrapper
      id="charts"
      title="Charts & Data Visualization"
      description="Rich chart library powered by Recharts. Includes line, bar, area, pie, donut, radar, radial, composed, treemap, scatter, heatmap, funnel, waterfall, gauge, bubble, sparklines, and KPI cards."
    >
      {/* KPI Cards */}
      <ComponentCard title="KPI Summary">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: "$84,200", change: "+12.5%", up: true, sparkData: [4, 5, 4, 6, 5, 7, 6, 8, 7, 8, 9, 10] },
            { label: "Active Users", value: "12,847", change: "+8.2%", up: true, sparkData: [3, 4, 3, 5, 6, 5, 7, 6, 8, 7, 9, 13] },
            { label: "Conversion Rate", value: "3.24%", change: "-0.4%", up: false, sparkData: [5, 4, 5, 4, 3, 4, 3, 4, 3, 3, 3, 3] },
            { label: "Avg. Order", value: "$68.50", change: "+5.1%", up: true, sparkData: [4, 5, 5, 6, 5, 6, 7, 6, 7, 7, 7, 7] },
          ].map((kpi) => (
            <div key={kpi.label} className="p-4 rounded-xl border border-border bg-card">
              <p className="text-[0.75rem] text-muted-foreground">{kpi.label}</p>
              <div className="flex items-end justify-between mt-1">
                <div>
                  <p className="text-[1.5rem] tracking-tight">{kpi.value}</p>
                  <span className={`text-[0.75rem] ${kpi.up ? "text-success" : "text-destructive"}`}>
                    {kpi.change}
                  </span>
                </div>
                <div className="w-20 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kpi.sparkData.map((v, i) => ({ v, index: i }))}>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke={kpi.up ? COLORS.success : COLORS.destructive}
                        fill={kpi.up ? COLORS.success : COLORS.destructive}
                        fillOpacity={0.15}
                        strokeWidth={1.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Heatmap (NEW) */}
      <ComponentCard title="Activity Heatmap">
        <p className="text-[0.75rem] text-muted-foreground mb-3">Order volume by day & time — darker = higher activity</p>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-[500px]">
            <div className="flex">
              <div className="w-12" />
              {heatmapHours.map((h) => (
                <div key={h} className="flex-1 text-center text-[0.5625rem] text-muted-foreground pb-1.5">{h}</div>
              ))}
            </div>
            {heatmapDays.map((day, di) => (
              <div key={day} className="flex items-center gap-1 mb-1">
                <div className="w-12 text-[0.625rem] text-muted-foreground text-right pr-2">{day}</div>
                {heatmapValues[di].map((val, hi) => (
                  <div
                    key={hi}
                    className={`flex-1 h-8 rounded-md ${heatColor(val, 22)} transition-colors cursor-pointer hover:ring-1 hover:ring-primary/40 flex items-center justify-center`}
                    title={`${day} ${heatmapHours[hi]}: ${val} orders`}
                  >
                    <span className="text-[0.5rem] text-primary-foreground/70">{val}</span>
                  </div>
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3 ml-12">
              <span className="text-[0.5625rem] text-muted-foreground">Low</span>
              {["bg-primary/10", "bg-primary/25", "bg-primary/40", "bg-primary/60", "bg-primary/85"].map((c, i) => (
                <div key={i} className={`w-6 h-3 rounded-sm ${c}`} />
              ))}
              <span className="text-[0.5625rem] text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Line Chart */}
      <ComponentCard title="Revenue Trend — Line Chart">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2.5} dot={{ fill: COLORS.primary, r: 3 }} />
              <Line type="monotone" dataKey="expenses" stroke={COLORS.warning} strokeWidth={2} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="profit" stroke={COLORS.success} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-5 mt-3 justify-center">
          {[
            { label: "Revenue", color: COLORS.primary },
            { label: "Expenses", color: COLORS.warning },
            { label: "Profit", color: COLORS.success },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-[0.75rem] text-muted-foreground">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Funnel (NEW) */}
      <ComponentCard title="Booking Funnel">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="center" fill="#fff" fontSize={11} formatter={(v: number) => v.toLocaleString()} />
                <LabelList position="right" fill="var(--muted-foreground)" fontSize={11} dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </ComponentCard>

      {/* Waterfall (NEW) */}
      <ComponentCard title="Income Waterfall">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData.map((d, i) => {
              let base = 0;
              if (d.type === "negative") {
                const prev = waterfallData.slice(0, i).reduce((s, w) => s + w.value, 0);
                base = prev + d.value;
              } else if (d.type === "subtotal" || d.type === "total") {
                base = 0;
              }
              return { ...d, base, displayValue: Math.abs(d.value) };
            })}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="base" stackId="a" fill="transparent" />
              <Bar dataKey="displayValue" stackId="a" radius={[4, 4, 0, 0]}>
                {waterfallData.map((d) => (
                  <Cell
                    key={`waterfall-${d.name}`}
                    fill={
                      d.type === "total" || d.type === "subtotal"
                        ? "#428BFF"
                        : d.type === "positive"
                        ? "#00A699"
                        : "#FF385C"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 justify-center text-[0.6875rem]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#00A699]" /> Income</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#FF385C]" /> Expense</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#428BFF]" /> Subtotal</span>
        </div>
      </ComponentCard>

      {/* Gauge (NEW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComponentCard title="Performance Gauge">
          <div className="h-52 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="80%"
                innerRadius="60%" outerRadius="100%"
                data={gaugeData}
                startAngle={180} endAngle={0}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={12}
                  background={{ fill: "var(--muted)" }}
                  fill="#00A699"
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
              <div className="text-center">
                <p className="text-[2rem] tracking-tight text-success">76</p>
                <p className="text-[0.6875rem] text-muted-foreground">Performance Score</p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Multi-gauge */}
        <ComponentCard title="System Gauges">
          <div className="grid grid-cols-2 gap-4">
            {radialData.map((d) => (
              <div key={d.name} className="text-center">
                <div className="h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="80%" innerRadius="50%" outerRadius="90%" data={[d]} startAngle={180} endAngle={0}>
                      <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "var(--muted)" }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-end justify-center pb-0 pointer-events-none">
                    <span className="text-[0.9375rem]" style={{ color: d.fill }}>{d.value}%</span>
                  </div>
                </div>
                <p className="text-[0.6875rem] text-muted-foreground mt-1">{d.name}</p>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>

      {/* Bar Chart */}
      <ComponentCard title="Weekly Traffic — Bar Chart">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="sessions" fill={COLORS.info} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ComponentCard>

      {/* Area Chart */}
      <ComponentCard title="Page Views — Area Chart">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pageviews" stroke={COLORS.primary} fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ComponentCard>

      {/* Stacked Bar */}
      <ComponentCard title="Quarterly Revenue — Stacked Bar">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="q" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="product" stackId="a" fill={COLORS.primary} radius={[0, 0, 0, 0]} />
              <Bar dataKey="service" stackId="a" fill={COLORS.info} />
              <Bar dataKey="license" stackId="a" fill={COLORS.success} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ComponentCard>

      {/* Bubble Chart (NEW) */}
      <ComponentCard title="Bubble Chart — Market Analysis">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" dataKey="x" name="Market Share" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis type="number" dataKey="y" name="Growth" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={bubbleData} fill={COLORS.primary} fillOpacity={0.5}>
                {bubbleData.map((entry) => (
                  <Cell key={entry.id} fill={PIE_COLORS[bubbleData.indexOf(entry) % PIE_COLORS.length]} fillOpacity={0.55} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ComponentCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <ComponentCard title="Traffic Sources — Pie Chart">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {pieData.map((entry, i) => (
                    <Cell key={`pie-${entry.name}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ComponentCard>

        {/* Donut Chart */}
        <ComponentCard title="Device Breakdown — Donut Chart">
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3} fontSize={11}>
                  {donutData.map((entry, i) => (
                    <Cell key={`donut-${entry.name}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[1.5rem] tracking-tight">62%</p>
                <p className="text-[0.6875rem] text-muted-foreground">Desktop</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[0.75rem]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-muted-foreground">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar */}
        <ComponentCard title="System Comparison — Radar Chart">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                <Radar name="System A" dataKey="A" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.2} strokeWidth={2} />
                <Radar name="System B" dataKey="B" stroke={COLORS.info} fill={COLORS.info} fillOpacity={0.1} strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ComponentCard>

        {/* Radial Bar */}
        <ComponentCard title="Resource Usage — Radial Bar">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "var(--muted)" }} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {radialData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[0.75rem]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-muted-foreground">{d.name}: {d.value}%</span>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>

      {/* Composed Chart */}
      <ComponentCard title="Composed — Bar + Line + Area">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" fill={COLORS.primary} fillOpacity={0.1} stroke="none" />
              <Bar dataKey="expenses" fill={COLORS.warning} radius={[3, 3, 0, 0]} barSize={20} fillOpacity={0.7} />
              <Line type="monotone" dataKey="profit" stroke={COLORS.success} strokeWidth={2.5} dot={{ fill: COLORS.success, r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ComponentCard>

      {/* Scatter Plot */}
      <ComponentCard title="Distribution — Scatter Plot">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" type="number" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis dataKey="y" type="number" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="y" fill={COLORS.primary} fillOpacity={0.6} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ComponentCard>

      {/* Treemap */}
      <ComponentCard title="Project Size — Treemap">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={heatmapTreeData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="var(--background)"
              content={({ x, y, width, height, name, index }: any) => (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill={PIE_COLORS[index % PIE_COLORS.length]} fillOpacity={0.75} rx={4} />
                  {width > 50 && height > 25 && (
                    <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={11}>
                      {name}
                    </text>
                  )}
                </g>
              )}
            />
          </ResponsiveContainer>
        </div>
      </ComponentCard>

      {/* Mini Sparklines */}
      <ComponentCard title="Sparklines">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Revenue", data: [3, 5, 2, 7, 4, 8, 6, 9, 5, 11, 8, 13], color: COLORS.primary },
            { label: "Users", data: [2, 3, 5, 4, 6, 8, 7, 9, 11, 10, 12, 14], color: COLORS.success },
            { label: "Bounce Rate", data: [8, 7, 9, 6, 7, 5, 6, 4, 5, 3, 4, 3], color: COLORS.warning },
            { label: "Errors", data: [1, 3, 2, 4, 2, 5, 3, 2, 4, 1, 3, 1], color: COLORS.destructive },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-border">
              <p className="text-[0.75rem] text-muted-foreground mb-2">{s.label}</p>
              <div className="h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={s.data.map((v, i) => ({ v, index: i }))}>
                    <Area type="monotone" dataKey="v" stroke={s.color} fill={s.color} fillOpacity={0.1} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
