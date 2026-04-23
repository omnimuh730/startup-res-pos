import { useState } from "react";
import {
  Tabs, TabList, TabTrigger, TabPanel,
  Separator,
  Ribbon, RibbonContainer,
  Rating,
  Pagination,
  Overlay,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Carousel,
  ProgressBar, StepProgress, CircularProgress,
} from "../components/ds";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  BarChart3, Users, TrendingUp, DollarSign, Bell, Search, Settings,
  Star, MapPin, Heart, Calendar, Clock, ChevronRight, ArrowUpRight,
  Home, ShoppingCart, FileText, PieChart, Activity, Plus, MoreHorizontal,
  Check, AlertTriangle, Layers, ArrowLeft,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";

import { Link } from "react-router";

const revenueData = [
  { month: "Jan", value: 4200 }, { month: "Feb", value: 5100 },
  { month: "Mar", value: 4800 }, { month: "Apr", value: 6200 },
  { month: "May", value: 5800 }, { month: "Jun", value: 7100 },
  { month: "Jul", value: 7800 },
];

const weeklyData = [
  { day: "Mon", visits: 120, orders: 45 },
  { day: "Tue", visits: 140, orders: 52 },
  { day: "Wed", visits: 110, orders: 38 },
  { day: "Thu", visits: 160, orders: 61 },
  { day: "Fri", visits: 180, orders: 72 },
  { day: "Sat", visits: 90, orders: 28 },
  { day: "Sun", visits: 70, orders: 22 },
];

const LISTINGS = [
  {
    images: [
      "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMG1vZGVybnxlbnwxfHx8fDE3NzYxMzI4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1670914131570-61ef0c05e388?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwd2ludGVyJTIwY2FiaW4lMjBmaXJlcGxhY2V8ZW58MXx8fHwxNzc2MTMyODExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    title: "Luxury Modern Loft",
    location: "San Francisco, CA",
    price: "$220",
    rating: 4.92,
    reviews: 128,
    ribbon: "Superhost",
  },
  {
    images: [
      "https://images.unsplash.com/photo-1745426867834-d6d3bf080195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VuaWMlMjBjb3VudHJ5c2lkZSUyMHZpbmV5YXJkJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3NjEzMjgxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGlzbGFuZCUyMGFlcmlhbCUyMHZpZXd8ZW58MXx8fHwxNzc2MTMyODEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    title: "Vineyard Estate",
    location: "Napa Valley, CA",
    price: "$310",
    rating: 4.88,
    reviews: 84,
  },
  {
    images: [
      "https://images.unsplash.com/photo-1757843298369-6e5503c14bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc3NjA0OTY4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMG1vZGVybnxlbnwxfHx8fDE3NzYxMzI4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    title: "City Penthouse",
    location: "New York, NY",
    price: "$380",
    rating: 4.85,
    reviews: 212,
    ribbon: "New",
  },
];

const ORDERS = [
  { id: "#ORD-4281", guest: "Sarah M.", status: "Confirmed", amount: "$660", date: "Jul 12, 2026", avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc2MTMyODc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "#ORD-4282", guest: "James K.", status: "Pending", amount: "$440", date: "Jul 14, 2026", avatar: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NjA2NTM1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" },
  { id: "#ORD-4283", guest: "Lisa R.", status: "Completed", amount: "$920", date: "Jul 10, 2026" },
  { id: "#ORD-4284", guest: "Bob P.", status: "Cancelled", amount: "$180", date: "Jul 8, 2026" },
];

const statusColor: Record<string, string> = {
  Confirmed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Completed: "bg-info/15 text-info",
  Cancelled: "bg-destructive/15 text-destructive",
};

export default function SampleDashboard() {
  const [page, setPage] = useState(1);
  const [reviewModal, setReviewModal] = useState(false);
  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const [bookingStep] = useState(2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 hover:bg-secondary rounded-lg cursor-pointer"
              title="Back to Design System"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-[0.9375rem] tracking-tight">HostDash</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-secondary rounded-lg px-3 py-1.5 w-64">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-[0.8125rem] w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-secondary rounded-lg cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[0.75rem] text-primary">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page heading + Booking Step Progress */}
        <div className="mb-8">
          <h1 className="text-[1.5rem] tracking-tight mb-1">Welcome back, John</h1>
          <p className="text-[0.875rem] text-muted-foreground">Here's what's happening with your properties today.</p>

          <Separator spacing="md" />

          {/* Booking Wizard Step Progress */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-[0.8125rem] mb-3">Current Booking Setup</p>
            <StepProgress
              currentStep={bookingStep}
              steps={[
                { label: "Property", description: "Select listing" },
                { label: "Dates", description: "Check-in/out" },
                { label: "Pricing", description: "Set rates" },
                { label: "Publish", description: "Go live" },
              ]}
            />
          </div>
        </div>

        {/* KPI Cards with Circular Progress */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Revenue", value: "$12,840", change: "+12%", icon: DollarSign, color: "primary" as const, progress: 78 },
            { label: "Bookings", value: "284", change: "+8%", icon: Calendar, color: "success" as const, progress: 65 },
            { label: "Guests", value: "1,429", change: "+15%", icon: Users, color: "info" as const, progress: 85 },
            { label: "Occupancy", value: "87%", change: "+3%", icon: TrendingUp, color: "warning" as const, progress: 87 },
          ].map((kpi) => (
            <div key={kpi.label} className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[0.75rem] text-muted-foreground">{kpi.label}</p>
                  <p className="text-[1.5rem] tracking-tight mt-0.5">{kpi.value}</p>
                  <span className="text-[0.75rem] text-success">{kpi.change}</span>
                </div>
                <div className="relative">
                  <CircularProgress value={kpi.progress} size={52} strokeWidth={4} color={kpi.color} showPercentage={false} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <kpi.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content area with Tabs */}
        <Tabs defaultValue="overview" variant="underline" className="mb-6">
          <TabList>
            <TabTrigger value="overview" icon={<Home className="w-4 h-4" />}>Overview</TabTrigger>
            <TabTrigger value="bookings" icon={<ShoppingCart className="w-4 h-4" />} badge={4}>Bookings</TabTrigger>
            <TabTrigger value="analytics" icon={<BarChart3 className="w-4 h-4" />}>Analytics</TabTrigger>
            <TabTrigger value="reports" icon={<FileText className="w-4 h-4" />}>Reports</TabTrigger>
          </TabList>

          {/* Overview Tab */}
          <TabPanel value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 p-5 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[0.9375rem]">Revenue Trend</h3>
                  <Tabs defaultValue="7d" variant="boxed" size="sm">
                    <TabList>
                      <TabTrigger value="7d">7D</TabTrigger>
                      <TabTrigger value="30d">30D</TabTrigger>
                      <TabTrigger value="90d">90D</TabTrigger>
                    </TabList>
                  </Tabs>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="var(--primary)" fill="url(#revGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upload / Progress */}
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="text-[0.9375rem] mb-4">Monthly Goals</h3>
                <div className="space-y-5">
                  <ProgressBar value={78} showPercentage label="Revenue Target" color="primary" />
                  <ProgressBar value={65} showPercentage label="Bookings Goal" color="success" />
                  <ProgressBar value={92} showPercentage label="Guest Satisfaction" color="info" />
                  <ProgressBar value={45} showPercentage label="New Listings" color="warning" variant="striped" />
                </div>

                <Separator spacing="md" variant="dashed" />

                <div className="space-y-3">
                  <p className="text-[0.8125rem] text-muted-foreground">System Health</p>
                  <div className="flex justify-around gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <CircularProgress value={92} size={60} strokeWidth={5} color="success" showPercentage={false} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[0.6875rem]">92%</span>
                        </div>
                      </div>
                      <span className="text-[0.6875rem] text-muted-foreground">Uptime</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <CircularProgress value={67} size={60} strokeWidth={5} color="warning" showPercentage={false} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[0.6875rem]">67%</span>
                        </div>
                      </div>
                      <span className="text-[0.6875rem] text-muted-foreground">Response</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <CircularProgress value={85} size={60} strokeWidth={5} color="info" showPercentage={false} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[0.6875rem]">85%</span>
                        </div>
                      </div>
                      <span className="text-[0.6875rem] text-muted-foreground">Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator spacing="lg" />

            {/* Listings Carousel with Ribbons */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[0.9375rem]">Your Listings</h3>
                <button className="text-[0.8125rem] text-primary hover:underline cursor-pointer flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <Carousel slidesToShow={3} gap={16} showDots={false}>
                {LISTINGS.map((listing) => (
                  <RibbonContainer
                    key={listing.title}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    {listing.ribbon && (
                      <Ribbon
                        position="top-left"
                        variant="flat"
                        color={listing.ribbon === "Superhost" ? "primary" : "success"}
                      >
                        {listing.ribbon}
                      </Ribbon>
                    )}
                    <div className="relative">
                      <Carousel showArrows={false} showDots={false}>
                        {listing.images.map((src, i) => (
                          <ImageWithFallback key={i} src={src} alt={listing.title} className="w-full h-40 object-cover" />
                        ))}
                      </Carousel>
                      <button className="absolute top-3 right-3 p-1.5 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card cursor-pointer z-10">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-[0.875rem]">{listing.title}</h4>
                        <Rating value={listing.rating} readonly allowHalf size="sm" />
                      </div>
                      <div className="flex items-center gap-1 text-[0.75rem] text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" /> {listing.location}
                        <span className="ml-auto text-[0.6875rem]">({listing.reviews})</span>
                      </div>
                      <p className="text-[0.875rem]">
                        {listing.price} <span className="text-muted-foreground text-[0.75rem]">/ night</span>
                      </p>
                    </div>
                  </RibbonContainer>
                ))}
              </Carousel>
            </div>

            <Separator spacing="md" />

            {/* Orders Table with Pagination */}
            <div className="p-5 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[0.9375rem]">Recent Bookings</h3>
                <button className="px-3 py-1.5 text-[0.8125rem] bg-primary text-primary-foreground rounded-lg cursor-pointer hover:opacity-90 inline-flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> New Booking
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[0.8125rem]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-[0.75rem] text-muted-foreground">Order</th>
                      <th className="text-left p-3 text-[0.75rem] text-muted-foreground">Guest</th>
                      <th className="text-left p-3 text-[0.75rem] text-muted-foreground">Status</th>
                      <th className="text-left p-3 text-[0.75rem] text-muted-foreground">Amount</th>
                      <th className="text-left p-3 text-[0.75rem] text-muted-foreground">Date</th>
                      <th className="text-left p-3 text-[0.75rem] text-muted-foreground">Rating</th>
                      <th className="w-10 p-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                        <td className="p-3 font-mono text-primary">{order.id}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {order.avatar ? (
                              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                                <ImageWithFallback src={order.avatar} alt={order.guest} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[0.625rem] text-muted-foreground shrink-0">
                                {order.guest[0]}
                              </div>
                            )}
                            {order.guest}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[0.6875rem] rounded-full ${statusColor[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3">{order.amount}</td>
                        <td className="p-3 text-muted-foreground">{order.date}</td>
                        <td className="p-3">
                          {order.status === "Completed" ? (
                            <Rating value={4.5} readonly allowHalf size="sm" />
                          ) : (
                            <span className="text-[0.75rem] text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button className="p-1 hover:bg-secondary rounded cursor-pointer">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator spacing="sm" />

              <div className="flex items-center justify-between">
                <p className="text-[0.75rem] text-muted-foreground">Showing 1–4 of 42</p>
                <Pagination
                  currentPage={page}
                  totalPages={11}
                  onPageChange={setPage}
                  size="sm"
                  variant="default"
                />
              </div>
            </div>
          </TabPanel>

          {/* Bookings Tab */}
          <TabPanel value="bookings" className="mt-6">
            <div className="p-8 rounded-xl border border-border bg-card text-center">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-[1.125rem] mb-1">Bookings Calendar</h3>
              <p className="text-[0.875rem] text-muted-foreground max-w-sm mx-auto">
                This tab would contain a full calendar view with booking details, availability, and pricing management.
              </p>
            </div>
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="text-[0.9375rem] mb-4">Weekly Visits vs. Orders</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip />
                      <Bar dataKey="visits" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="orders" fill="var(--info)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="text-[0.9375rem] mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <ProgressBar value={87} showPercentage label="Occupancy Rate" color="primary" variant="gradient" />
                  <ProgressBar value={92} showPercentage label="Response Rate" color="success" />
                  <ProgressBar value={95} showPercentage label="Acceptance Rate" color="info" />
                  <ProgressBar value={4} max={5} showPercentage label="Avg. Rating" color="warning" />
                </div>
              </div>
            </div>
          </TabPanel>

          {/* Reports Tab */}
          <TabPanel value="reports" className="mt-6">
            <div className="p-8 rounded-xl border border-border bg-card text-center">
              <PieChart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-[1.125rem] mb-1">Reports & Exports</h3>
              <p className="text-[0.875rem] text-muted-foreground max-w-sm mx-auto">
                Generate and download detailed financial, booking, and performance reports.
              </p>
            </div>
          </TabPanel>
        </Tabs>

        {/* Floating Actions using Modal */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-30">
          <button
            onClick={() => setReviewModal(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 cursor-pointer text-[0.8125rem] flex items-center gap-2"
          >
            <Star className="w-4 h-4" /> Leave Review
          </button>
        </div>

        {/* Review Modal */}
        <Modal open={reviewModal} onClose={() => setReviewModal(false)} size="sm">
          <ModalHeader>Rate Your Experience</ModalHeader>
          <ModalBody>
            <div className="text-center space-y-4">
              <p className="text-[0.875rem] text-muted-foreground">How was your stay at Luxury Modern Loft?</p>
              <Rating defaultValue={0} size="xl" showValue />
              <textarea
                rows={3}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-[0.875rem]"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button onClick={() => setReviewModal(false)} className="px-4 py-2 text-[0.875rem] border border-border rounded-lg hover:bg-secondary cursor-pointer">
              Cancel
            </button>
            <button onClick={() => setReviewModal(false)} className="px-4 py-2 text-[0.875rem] bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer">
              Submit Review
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}