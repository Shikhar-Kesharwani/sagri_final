import {
  Users,
  Activity,
  TrendingUp,
  MapPin,
  Download,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PageHeader, Panel, Tag, Reveal } from "@/src/app/kit";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const stats = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Total Registered Farmers",
      value: "52,341",
      change: "+12.5%",
      trend: "up",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Active Today",
      value: "8,429",
      change: "+8.2%",
      trend: "up",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Total AI Predictions",
      value: "2.1M",
      change: "+15.3%",
      trend: "up",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Covered Villages",
      value: "5,234",
      change: "+23",
      trend: "up",
    },
  ];

  const usageData = [
    { month: "Jan", users: 4000, predictions: 2400 },
    { month: "Feb", users: 3000, predictions: 1398 },
    { month: "Mar", users: 2000, predictions: 9800 },
    { month: "Apr", users: 2780, predictions: 3908 },
    { month: "May", users: 1890, predictions: 4800 },
    { month: "Jun", users: 2390, predictions: 3800 },
  ];

  const cropData = [
    { name: "Wheat", value: 35 },
    { name: "Rice", value: 28 },
    { name: "Cotton", value: 18 },
    { name: "Sugarcane", value: 12 },
    { name: "Others", value: 7 },
  ];

  const diseaseData = [
    { disease: "Leaf Blight", cases: 450 },
    { disease: "Rust", cases: 320 },
    { disease: "Powdery Mildew", cases: 280 },
    { disease: "Wilt", cases: 190 },
    { disease: "Root Rot", cases: 150 },
  ];

  const stateData = [
    { state: "Punjab", farmers: 12500 },
    { state: "Haryana", farmers: 9800 },
    { state: "UP", farmers: 15200 },
    { state: "MP", farmers: 8900 },
    { state: "Rajasthan", farmers: 6500 },
  ];

  const COLORS = ["#16a34a", "#2563eb", "#d97706", "#db2777", "#7c3aed"];

  const recentUsers = [
    { name: "Ramesh Kumar", location: "Ludhiana, Punjab", joined: "2 mins ago", status: "online" },
    { name: "Suresh Patel", location: "Anand, Gujarat", joined: "15 mins ago", status: "online" },
    { name: "Mahesh Singh", location: "Meerut, UP", joined: "1 hour ago", status: "offline" },
    { name: "Harpreet Singh", location: "Karnal, Haryana", joined: "2 hours ago", status: "offline" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Admin Console"
        title="Platform Operations & Telemetry"
        subtitle="Real-time agricultural analytics, platform inference telemetry, and farmer engagement overview."
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter Range
            </Button>
            <Button variant="outline" className="gap-2 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => (
          <Reveal key={s.title} delay={idx * 0.05}>
            <Panel tone="default" className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wheat/10 text-wheat">
                  {s.icon}
                </div>
                <Tag tone="accent">{s.change}</Tag>
              </div>
              <div className="mt-4">
                <div className="font-serif text-3xl font-medium tracking-tight text-foreground">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.title}</div>
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Panel tone="default">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">Platform Usage & Inference Growth</h3>
            <Tag tone="neutral">Monthly Aggregate</Tag>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
                <XAxis dataKey="month" stroke="currentColor" className="text-muted-foreground text-xs" />
                <YAxis stroke="currentColor" className="text-muted-foreground text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="users" name="Active Farmers" stroke="#16a34a" fill="#16a34a" fillOpacity={0.25} />
                <Area type="monotone" dataKey="predictions" name="ML Diagnoses" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel tone="default">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">Crop Sowing Share</h3>
            <Tag tone="neutral">Season 2024</Tag>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {cropData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Charts Row 2 */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Panel tone="default">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">Top Field Pathologies</h3>
            <Tag tone="accent">Neural Vision Alerts</Tag>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
                <XAxis dataKey="disease" stroke="currentColor" className="text-muted-foreground text-xs" />
                <YAxis stroke="currentColor" className="text-muted-foreground text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="cases" name="Reported Incidents" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel tone="default">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">State-wise Agrarian Density</h3>
            <Tag tone="neutral">Regional Coverage</Tag>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" />
                <XAxis type="number" stroke="currentColor" className="text-muted-foreground text-xs" />
                <YAxis dataKey="state" type="category" stroke="currentColor" className="text-muted-foreground text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="farmers" name="Registered Farmers" fill="#16a34a" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* Recent User Activity */}
      <div className="mt-8">
        <Panel tone="default">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-foreground">Real-time Farmer Activity</h3>
            <span className="text-xs text-muted-foreground">Live Telemetry Feed</span>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.map((user) => (
              <div key={user.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wheat/15 font-serif font-semibold text-wheat">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{user.joined}</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      user.status === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-muted"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
