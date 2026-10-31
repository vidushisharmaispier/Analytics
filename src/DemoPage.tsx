import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Users,
  Settings,
  Search,
  Download,
  Check,
} from "lucide-react";
import { Shop } from "./demos";
import { TeamApp } from "./TeamApp";
import "./demo-page.css";
type Section =
  | "Overview"
  | "Transactions"
  | "Customers"
  | "Reports"
  | "Settings";
const transactions = [
  {
    id: "TX-1001",
    name: "Alex Morgan",
    email: "alex@example.com",
    amount: 249,
    status: "Completed",
    date: "2026-09-28",
  },
  {
    id: "TX-1002",
    name: "Sam Taylor",
    email: "sam@example.com",
    amount: 129,
    status: "Pending",
    date: "2026-09-27",
  },
  {
    id: "TX-1003",
    name: "Jamie Lee",
    email: "jamie@example.com",
    amount: 389,
    status: "Completed",
    date: "2026-09-26",
  },
  {
    id: "TX-1004",
    name: "Jordan Kim",
    email: "jordan@example.com",
    amount: 79,
    status: "Completed",
    date: "2026-09-25",
  },
  {
    id: "TX-1005",
    name: "Casey Brown",
    email: "casey@example.com",
    amount: 199,
    status: "Pending",
    date: "2026-09-24",
  },
  {
    id: "TX-1006",
    name: "Riley Patel",
    email: "riley@example.com",
    amount: 329,
    status: "Completed",
    date: "2026-09-23",
  },
];
function AnalyticsApp() {
  const [section, setSection] = useState<Section>("Overview");
  const [period, setPeriod] = useState("This month");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [asc, setAsc] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [workspace, setWorkspace] = useState("Clarity workspace");
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const money = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  const rows = transactions
    .filter(
      (r) =>
        (r.name + " " + r.id + " " + r.email)
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (status === "All" || r.status === status),
    )
    .sort((a, b) => (asc ? a.amount - b.amount : b.amount - a.amount));
  function exportCSV() {
    const csv = [
      "Transaction,Customer,Amount,Status,Date",
      ...rows.map((r) => `${r.id},${r.name},${r.amount},${r.status},${r.date}`),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "clarity-transactions.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Report downloaded.");
  }
  const nav: [Section, typeof Layers][] = [
    ["Overview", LayoutDashboard],
    ["Transactions", ShoppingBag],
    ["Customers", Users],
    ["Reports", Layers],
    ["Settings", Settings],
  ];
  return (
    <div className="analytics-app">
      <aside className="analytics-sidebar">
        <a className="analytics-brand" href="?demo=dashboard">
          <Layers /> clarity<span>.</span>
        </a>
        <small>WORKSPACE</small>
        <nav aria-label="Dashboard sections">
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              className={section === name ? "chosen" : ""}
              onClick={() => {
                setSection(name);
                setQuery("");
                setStatus("All");
                setNotice("");
              }}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-profile">
          <span>VS</span>
          <div>
            <b>Demo workspace</b>
            <small>Sample data only</small>
          </div>
        </div>
      </aside>
      <div className="analytics-main">
        <div className="analytics-top">
          <span>
            {workspace} / <b>{section}</b>
          </span>
          <span className="live-chip">Interactive demo</span>
        </div>
        <div className="analytics-heading">
          <div>
            <small>YOUR WORKSPACE, AT A GLANCE</small>
            <h1>{section}</h1>
            <p>
              {section === "Overview"
                ? "Welcome back. Here's how your business is doing."
                : section === "Transactions"
                  ? "Review, search and export your sample transactions."
                  : section === "Customers"
                    ? "Meet the people behind the numbers."
                    : section === "Reports"
                      ? "Explore performance across reporting periods."
                      : "Make this workspace feel like yours."}
            </p>
          </div>
          {(section === "Overview" || section === "Reports") && (
            <select
              aria-label="Report period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>This month</option>
              <option>Last month</option>
            </select>
          )}
        </div>
        {(section === "Overview" || section === "Reports") && (
          <>
            <div className="analytics-metrics">
              {[
                [
                  "Revenue",
                  money(period === "This month" ? 24580 : 21240),
                  "+12.8%",
                ],
                [
                  "Customers",
                  period === "This month" ? "1,842" : "1,623",
                  "+8.2%",
                ],
                ["Orders", period === "This month" ? "384" : "341", "+6.4%"],
                [
                  "Conversion rate",
                  period === "This month" ? "3.62%" : "3.21%",
                  "+0.41%",
                ],
              ].map((v) => (
                <article key={v[0]}>
                  <small>{v[0]}</small>
                  <strong>{v[1]}</strong>
                  <span>
                    {v[2]} <small>vs. previous period</small>
                  </span>
                </article>
              ))}
            </div>
            <div className="analytics-chart">
              <div className="analytics-card-heading">
                <div>
                  <h2>Revenue overview</h2>
                  <p>Sample daily revenue · {period.toLowerCase()}</p>
                </div>
                <span>● Revenue</span>
              </div>
              <div
                className="full-bars"
                role="img"
                aria-label={`Daily revenue chart for ${period.toLowerCase()}`}
              >
                {(period === "This month"
                  ? [35, 52, 42, 70, 55, 80, 63, 92, 73, 100, 82, 96]
                  : [28, 36, 50, 42, 60, 55, 72, 65, 80, 70, 85, 78]
                ).map((v, i) => (
                  <div
                    key={i}
                    style={{ height: v + "%" }}
                    title={`Day ${i * 2 + 1}: ${money(v * 24)}`}
                  />
                ))}
              </div>
              <div className="full-chart-labels">
                <span>Day 1</span>
                <span>Day 5</span>
                <span>Day 9</span>
                <span>Day 13</span>
                <span>Day 17</span>
                <span>Day 23</span>
              </div>
            </div>
          </>
        )}
        {(section === "Overview" ||
          section === "Transactions" ||
          section === "Reports") && (
          <section className="analytics-table-card">
            <div className="analytics-card-heading">
              <div>
                <h2>
                  {section === "Overview"
                    ? "Recent transactions"
                    : "Transaction report"}
                </h2>
                <p>{rows.length} matching transactions · sample data</p>
              </div>
              <button className="dashboard-export" onClick={exportCSV}>
                <Download size={15} /> Export CSV
              </button>
            </div>
            <div className="transaction-controls">
              <label>
                <Search size={16} />
                <input
                  aria-label="Search transactions"
                  placeholder="Search customer or transaction…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <select
                aria-label="Filter transaction status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">All statuses</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Customer</th>
                    <th>
                      <button
                        onClick={() => setAsc(!asc)}
                        aria-label="Sort by amount"
                      >
                        Amount {asc ? "↑" : "↓"}
                      </button>
                    </th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>
                        <b>{r.name}</b>
                        <small>{r.email}</small>
                      </td>
                      <td>{money(r.amount)}</td>
                      <td>
                        <span
                          className={"payment-status " + r.status.toLowerCase()}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!rows.length && (
              <p className="empty-result">
                No matching transactions. Try another search or status.
              </p>
            )}
            <p className="export-notice" role="status">
              {notice}
            </p>
          </section>
        )}
        {section === "Customers" && (
          <section className="analytics-table-card">
            <div className="transaction-controls">
              <label>
                <Search size={16} />
                <input
                  aria-label="Search customers"
                  placeholder="Search customers…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            <div className="customer-grid">
              {rows.map((r) => (
                <article key={r.id}>
                  <span>
                    {r.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <h2>{r.name}</h2>
                  <p>{r.email}</p>
                  <small>Sample customer</small>
                  <b>{money(r.amount)} total spent</b>
                </article>
              ))}
            </div>
            {!rows.length && (
              <p className="empty-result">No matching customers.</p>
            )}
          </section>
        )}
        {section === "Settings" && (
          <form
            className="workspace-settings"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
          >
            <h2>Workspace preferences</h2>
            <label>
              Workspace name
              <input
                required
                maxLength={60}
                value={workspace}
                onChange={(e) => {
                  setWorkspace(e.target.value);
                  setSaved(false);
                }}
              />
            </label>
            <label>
              Display currency
              <select
                aria-label="Display currency"
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  setSaved(false);
                }}
              >
                <option value="USD">USD · US Dollar</option>
                <option value="INR">INR · Indian Rupee</option>
                <option value="EUR">EUR · Euro</option>
              </select>
            </label>
            <p>
              Currency changes the display format of sample amounts. Preferences
              apply while this app is open.
            </p>
            <button className="button primary" type="submit">
              Save preferences <Check size={16} />
            </button>
            {saved && <p role="status">Preferences saved for this session.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
export function DemoPage({
  project,
}: {
  project: "dashboard" | "shop" | "tasks";
}) {
  const names = {
    dashboard: "Clarity Dashboard",
    shop: "Forma Store",
    tasks: "Flow Team Workspace",
  };
  useEffect(() => {
    document.title = `${names[project]} | Vidushi Sharama`;
    window.scrollTo(0, 0);
  }, [project]);
  return (
    <div className={"demo-page full-" + project}>
      <div className="demo-page-bar">
        <a href="./#projects">
          <ArrowLeft size={17} /> Back to portfolio
        </a>
        <nav aria-label="Demo applications">
          {Object.entries(names).map(([id, name]) => (
            <a
              key={id}
              href={`?demo=${id}`}
              aria-current={id === project ? "page" : undefined}
            >
              {name}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </nav>
        <span>PERSONAL PROJECT · SAMPLE DATA</span>
      </div>
      <main className="demo-page-main">
        {project === "dashboard" ? (
          <AnalyticsApp />
        ) : project === "shop" ? (
          <>
            <div className="app-intro">
              <span>FORMA STORE</span>
              <p>
                Browse the collection, choose a category and add products to
                your bag.
              </p>
            </div>
            <Shop />
          </>
        ) : (
          <TeamApp />
        )}
      </main>
    </div>
  );
}
