import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Download, Filter, ArrowUpDown } from "lucide-react";

interface TableRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
  revenue: number;
  lastActive: string;
}

const mockData: TableRow[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active", revenue: 12400, lastActive: "2 min ago" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active", revenue: 8200, lastActive: "1 hr ago" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "Viewer", status: "Pending", revenue: 3100, lastActive: "3 hrs ago" },
  { id: 4, name: "Dave Brown", email: "dave@example.com", role: "Editor", status: "Active", revenue: 15800, lastActive: "5 min ago" },
  { id: 5, name: "Eve Wilson", email: "eve@example.com", role: "Admin", status: "Inactive", revenue: 9600, lastActive: "2 days ago" },
  { id: 6, name: "Frank Garcia", email: "frank@example.com", role: "Viewer", status: "Active", revenue: 4300, lastActive: "12 min ago" },
  { id: 7, name: "Grace Lee", email: "grace@example.com", role: "Editor", status: "Active", revenue: 11200, lastActive: "30 min ago" },
  { id: 8, name: "Henry Martinez", email: "henry@example.com", role: "Viewer", status: "Pending", revenue: 2800, lastActive: "1 day ago" },
];

const statusColor: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Inactive: "bg-destructive/15 text-destructive",
  Pending: "bg-warning/15 text-warning",
};

export function TableSection() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof TableRow>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = mockData
    .filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: keyof TableRow) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map((r) => r.id)));
  };

  const SortIcon = ({ col }: { col: keyof TableRow }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-muted-foreground/50" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />;
  };

  return (
    <SectionWrapper
      id="table"
      title="Tables"
      description="Data tables with sorting, searching, pagination, row selection, and responsive layouts."
    >
      <ComponentCard title="Full-Featured Data Table">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-4 py-2 text-[0.8125rem] rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-56"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] border border-border rounded-lg hover:bg-secondary cursor-pointer">
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <span className="text-[0.75rem] text-muted-foreground">{selected.size} selected</span>
            )}
            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] border border-border rounded-lg hover:bg-secondary cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-[0.8125rem]">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="w-10 p-3">
                  <input
                    type="checkbox"
                    checked={selected.size === paged.length && paged.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </th>
                {[
                  { key: "name", label: "Name" },
                  { key: "role", label: "Role" },
                  { key: "status", label: "Status" },
                  { key: "revenue", label: "Revenue" },
                  { key: "lastActive", label: "Last Active" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="text-left p-3 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => toggleSort(col.key as keyof TableRow)}
                  >
                    <div className="flex items-center gap-1 text-[0.75rem] text-muted-foreground">
                      {col.label}
                      <SortIcon col={col.key as keyof TableRow} />
                    </div>
                  </th>
                ))}
                <th className="w-10 p-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-border last:border-0 transition-colors ${
                    selected.has(row.id) ? "bg-primary/5" : "hover:bg-secondary/30"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="text-[0.8125rem]">{row.name}</p>
                      <p className="text-[0.6875rem] text-muted-foreground">{row.email}</p>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{row.role}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[0.6875rem] rounded-full ${statusColor[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3">${row.revenue.toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground">{row.lastActive}</td>
                  <td className="p-3">
                    <button className="p-1 hover:bg-secondary rounded cursor-pointer">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-[0.75rem] text-muted-foreground">
            Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-secondary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[0.8125rem] cursor-pointer ${
                  p === page ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-secondary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Compact Table">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-[0.75rem]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2 text-muted-foreground">Endpoint</th>
                <th className="text-left px-3 py-2 text-muted-foreground">Method</th>
                <th className="text-left px-3 py-2 text-muted-foreground">Latency</th>
                <th className="text-left px-3 py-2 text-muted-foreground">Status</th>
                <th className="text-right px-3 py-2 text-muted-foreground">Calls/min</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ep: "/api/users", method: "GET", lat: "45ms", status: 200, calls: 1240 },
                { ep: "/api/products", method: "GET", lat: "82ms", status: 200, calls: 860 },
                { ep: "/api/orders", method: "POST", lat: "120ms", status: 201, calls: 340 },
                { ep: "/api/auth/login", method: "POST", lat: "210ms", status: 200, calls: 520 },
                { ep: "/api/search", method: "GET", lat: "180ms", status: 200, calls: 2100 },
                { ep: "/api/webhook", method: "POST", lat: "95ms", status: 500, calls: 15 },
              ].map((r) => (
                <tr key={r.ep + r.method} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="px-3 py-2 font-mono">{r.ep}</td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[0.625rem] font-mono ${
                      r.method === "GET" ? "bg-info/15 text-info" : "bg-success/15 text-success"
                    }`}>
                      {r.method}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{r.lat}</td>
                  <td className="px-3 py-2">
                    <span className={`${r.status >= 400 ? "text-destructive" : "text-success"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{r.calls.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ComponentCard title="Striped Table">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-[0.8125rem]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-[0.75rem] text-muted-foreground">Plan</th>
                <th className="text-center p-3 text-[0.75rem] text-muted-foreground">Users</th>
                <th className="text-center p-3 text-[0.75rem] text-muted-foreground">Storage</th>
                <th className="text-center p-3 text-[0.75rem] text-muted-foreground">Support</th>
                <th className="text-right p-3 text-[0.75rem] text-muted-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plan: "Free", users: "1", storage: "1 GB", support: "Community", price: "$0" },
                { plan: "Starter", users: "5", storage: "10 GB", support: "Email", price: "$12" },
                { plan: "Pro", users: "25", storage: "100 GB", support: "Priority", price: "$49" },
                { plan: "Enterprise", users: "Unlimited", storage: "Unlimited", support: "Dedicated", price: "Custom" },
              ].map((r, i) => (
                <tr key={r.plan} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-secondary/30" : ""}`}>
                  <td className="p-3">{r.plan}</td>
                  <td className="p-3 text-center text-muted-foreground">{r.users}</td>
                  <td className="p-3 text-center text-muted-foreground">{r.storage}</td>
                  <td className="p-3 text-center text-muted-foreground">{r.support}</td>
                  <td className="p-3 text-right">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
