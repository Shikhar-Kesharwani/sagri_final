import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  Cloud,
  CloudSun,
  Droplet,
  FileText,
  Landmark,
  MessageCircle,
  ScanLine,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Sprout,
  Tractor,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppLink, PlainLink } from "@/components/ui/app-link";
import { Progress } from "@/components/ui/progress";
import { Heading, Text } from "@/components/ui/primitives";
import { Change, DataTable, LoadingBlock, PageHeader, Reveal, Section } from "@/src/app/kit";
import { NAV_ITEMS } from "@/src/data/nav";
import { DASHBOARD_RATES } from "@/src/data/market";
import { AGRO_ZONES, districtById } from "@/src/data/places";
import { formatINR, greeting } from "@/src/lib/format";
import { firstName, profileCompletion, useProfile } from "@/src/lib/sagri";
import { describeWeather, sprayAdvice, useWeather } from "@/src/lib/weather";
import { useAuth } from "../app/AuthProvider";

const FEATURES = [
  { to: "/disease-detection", title: "Plant Disease Vision", body: "Identify 38 leaf pathogens with CIBRC remedies", icon: ScanLine },
  { to: "/crop-recommendation", title: "Crop Recommendation", body: "Multi-variable soil mapping for 22 crops", icon: Sprout },
  { to: "/price-forecasting", title: "Mandi Price Forecaster", body: "6-month inflation-adjusted price predictions", icon: TrendingUp },
  { to: "/risk-prediction", title: "Crop Risk Radar", body: "Drought, heat, and yield shortfall detector", icon: Bell },
  { to: "/soil-health", title: "Soil Health & NPK", body: "Nutrient deficit and fertilizer calculator", icon: Droplet },
  { to: "/weather", title: "Live Weather & Rain Radar", body: "Hourly temperatures, spray advisories & 7-day outlook", icon: CloudSun },
  { to: "/market-price", title: "Mandi Market Rates", body: "Compare live modal prices across regional yards", icon: TrendingUp },
  { to: "/crop-calendar", title: "AI Crop Calendar", body: "Stage-by-stage sowing, irrigation and harvest scheduler", icon: Calendar },
  { to: "/schemes", title: "Government Schemes", body: "PM-Kisan, PMFBY & subsidy eligibility checker", icon: FileText },
  { to: "/expert-connect", title: "Krishi Sahayak AI Expert", body: "Conversational agronomist advisory in 5 Indic languages", icon: MessageCircle },
  { to: "/community", title: "Farmer Community Forum", body: "Ask questions, share harvest photos and crop knowledge", icon: Users },
  { to: "/history", title: "Audit & Prediction History", body: "Complete log of past diagnostics and recommendations", icon: CheckCircle2 },
];

const INITIAL_TASKS = [
  { id: 1, title: "Water wheat field (Section A)", time: "Today, 06:00 AM", priority: "high", done: false },
  { id: 2, title: "Apply NPK 12:32:16 to paddy seedlings", time: "Today, 10:30 AM", priority: "medium", done: false },
  { id: 3, title: "Inspect soil moisture sensor in block 2", time: "Tomorrow, 08:00 AM", priority: "low", done: false },
  { id: 4, title: "Check local mandi grain arrivals & rates", time: "In 2 days", priority: "medium", done: false },
];

export default function CommandCentre() {
  const [profile] = useProfile();
  const { user } = useAuth();
  const displayName = user?.name ? user.name.replace(/\s*\(.*?\)/, "").trim() : profile.name;
  const activeDistrictId = user?.district ? user.district.toLowerCase() : profile.district;
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const district = districtById(activeDistrictId);
  const weather = useWeather(activeDistrictId);
  const completion = profileCompletion(profile);
  const advice = weather ? sprayAdvice(weather) : null;
  const humidDay = weather?.daily.slice(1).find((d) => d.rain >= 50);
  // Regional estimate from humidity and rain outlook until a field sensor is linked.
  const moisture = weather
    ? Math.round(Math.min(90, Math.max(20, weather.current.humidity + (weather.daily[0]?.rain ?? 0) / 10)))
    : 64;
  const moistureLabel = moisture >= 45 && moisture <= 75 ? "Optimal" : moisture < 45 ? "Low" : "High";
  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Farm Command Centre"
        title={`${greeting()}, ${firstName(displayName)}.`}
        subtitle={`${AGRO_ZONES[district.id] ?? district.name} Agro-Climatic Zone · Soil Moisture: ${moistureLabel} (${moisture}%)`}
        actions={
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <AppLink to="/disease-detection">
              Scan Leaf Disease
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </AppLink>
            <AppLink to="/crop-recommendation">
              Get Crop Recommendations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </AppLink>
          </div>
        }
      />

      <div className="mt-8 mb-12 rounded-3xl border border-wheat/30 bg-gradient-to-r from-card via-card/85 to-wheat/10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-wheat/30 bg-wheat/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-wheat mb-2">
            <Sparkles className="h-3.5 w-3.5 text-wheat" />
            <span>Interactive 3D Visualizer</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-foreground">
            Experience the Season in Five Chapters
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Watch the living 3D soil, crop sprouting, monsoon rainfall, foliar canopy, and harvest animations unfold in real time.
          </p>
        </div>
        <PlainLink
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-wheat px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-wheat/90 transition-all shadow-md shrink-0"
        >
          <span>Open 3D Season Story</span>
          <ArrowRight className="h-4 w-4" />
        </PlainLink>
      </div>

      {/* Marketplace & Services Grid */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-wheat" />
            <Heading as="h3" family="serif" size="subtitle">
              Marketplace & Direct Services
            </Heading>
          </div>
          <Text size="xs" tone="muted">
            Direct farmer transactions · Zero commission
          </Text>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PlainLink
            to="/sell-crops"
            className="group relative overflow-hidden rounded-3xl border border-wheat/30 bg-gradient-to-br from-card via-card to-wheat/10 p-6 transition-all hover:border-wheat hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wheat/15 border border-wheat/30 text-wheat mb-4 group-hover:scale-105 transition-transform">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <Heading as="h4" family="serif" size="small" className="text-foreground">
              Sell Produce
            </Heading>
            <p className="mt-1 text-xs text-muted-foreground">
              List your harvest directly to millers & get MSP+ rates
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-wheat">
              <span>Get Best Price</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </PlainLink>

          <PlainLink
            to="/buy-seeds"
            className="group relative overflow-hidden rounded-3xl border border-leaf/30 bg-gradient-to-br from-card via-card to-leaf/10 p-6 transition-all hover:border-leaf hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf/15 border border-leaf/30 text-leaf mb-4 group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <Heading as="h4" family="serif" size="small" className="text-foreground">
              Buy Certified Seeds
            </Heading>
            <p className="mt-1 text-xs text-muted-foreground">
              Certified high-germination seed varieties with subsidy
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-leaf">
              <span>Browse Seeds</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </PlainLink>

          <PlainLink
            to="/loans"
            className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 p-6 transition-all hover:border-primary hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-primary mb-4 group-hover:scale-105 transition-transform">
              <Landmark className="h-6 w-6" />
            </div>
            <Heading as="h4" family="serif" size="small" className="text-foreground">
              Check Kisan Loans
            </Heading>
            <p className="mt-1 text-xs text-muted-foreground">
              Calculate KCC limits & 4% subvented credit eligibility
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-primary">
              <span>View Schemes</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </PlainLink>

          <PlainLink
            to="/rent-machinery"
            className="group relative overflow-hidden rounded-3xl border border-alert/30 bg-gradient-to-br from-card via-card to-alert/10 p-6 transition-all hover:border-alert hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-alert/15 border border-alert/30 text-alert mb-4 group-hover:scale-105 transition-transform">
              <Tractor className="h-6 w-6" />
            </div>
            <Heading as="h4" family="serif" size="small" className="text-foreground">
              Rent Machinery
            </Heading>
            <p className="mt-1 text-xs text-muted-foreground">
              Book tractors, harvesters & spray drones near your village
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-alert">
              <span>Book Equipment</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </PlainLink>
        </div>
      </div>

      <Section tone="paper" eyebrow="Your Tools" title="Twelve models, one for every decision across the farming cycle.">
        <ul className="border-t border-line">
          {FEATURES.map((f, i) => {
            const Icon = f.icon ?? NAV_ITEMS.find((n) => n.to === f.to)?.icon ?? Sprout;
            return (
              <li key={f.to} className="border-b border-line">
                <Reveal delay={i * 0.03}>
                  <PlainLink to={f.to} className="group relative overflow-hidden">
                    <span className="absolute inset-0 origin-left scale-x-0 bg-ink/5 transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="relative grid grid-cols-12 items-center gap-4 py-6 md:py-8">
                      <Text as="span" size="xs" tone="inkMuted" mono className="col-span-1">
                        {String(i + 1).padStart(2, "0")}
                      </Text>
                      <span className="col-span-10 transition-transform duration-500 group-hover:translate-x-2 sm:col-span-5 flex items-center gap-3">
                        <Icon className="h-5 w-5 text-wheat shrink-0" />
                        <Heading as="h3" family="serif" size="subtitle" tone="ink">
                          {f.title}
                        </Heading>
                      </span>
                      <Text as="span" size="sm" tone="inkMuted" className="col-span-10 col-start-2 sm:col-span-5 sm:col-start-auto">
                        {f.body}
                      </Text>
                      <span className="col-span-1 col-start-12 row-start-1 flex justify-end text-ink sm:row-start-auto">
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </PlainLink>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>

      <section className="mt-28 lg:mt-36">
        <Reveal>
          <Text size="sm" tone="muted">
            {today}
          </Text>
          <Heading as="h2" family="serif" size="title" className="mt-3">
            Today on your farm
          </Heading>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-border">
          <Reveal className="lg:pr-12">
            <CloudSun className="h-6 w-6 text-rain" strokeWidth={1.5} />
            <Heading as="h3" size="small" className="mt-6">
              Weather · {district.name}
            </Heading>
            {!weather ? (
              <div className="mt-5">
                <LoadingBlock lines={3} />
              </div>
            ) : (
              <>
                <Text size="none" as="div" className="mt-4 font-serif text-6xl leading-none">
                  {weather.current.temp.toFixed(1)}°C
                </Text>
                <Text size="sm" tone="muted" className="mt-2">
                  {describeWeather(weather.current.code).label} · Humidity {weather.current.humidity}% · Rain Chance{" "}
                  {weather.daily[0]?.rain ?? 0}% · Wind {Math.round(weather.current.wind)} km/h
                </Text>
                {advice && (
                  <Text size="sm" className={advice.safe ? "mt-3 max-w-xs text-leaf" : "mt-3 max-w-xs text-alert"}>
                    {advice.text}
                  </Text>
                )}
                <div className="mt-6 grid max-w-xs grid-cols-5 gap-2 border-t border-border pt-4 text-center">
                  {weather.daily.slice(0, 5).map((day) => {
                    const Icon = describeWeather(day.code).icon;
                    return (
                      <div key={day.label}>
                        <Text size="xs" tone="muted">
                          {day.label}
                        </Text>
                        <Icon className="mx-auto mt-2 h-4 w-4 text-rain" strokeWidth={1.5} />
                        <Text size="xs" mono className="mt-2">
                          {day.max}°C
                        </Text>
                        {day.rain >= 40 && (
                          <Text size="xs" tone="muted" mono>
                            {day.rain}%
                          </Text>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <AppLink to="/weather" className="mt-6">
              Full forecast
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </AppLink>
          </Reveal>

          <Reveal delay={0.1} className="lg:px-12">
            <Bell className="h-6 w-6 text-wheat" strokeWidth={1.5} />
            <Heading as="h3" size="small" className="mt-6">
              Farm alerts & notices
            </Heading>
            <ul className="mt-5 divide-y divide-border">
              <li className="py-3">
                <Text size="sm" className="text-alert">
                  Urgent: High humidity expected {humidDay?.label ?? "Thursday"} — monitor pulses for aphid pests
                </Text>
              </li>
              <li className="py-3">
                <Text size="sm">Rabi wheat sowing window opens on 1 November.</Text>
                <AppLink to="/crop-calendar" tone="muted" className="mt-1">
                  Open calendar
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </AppLink>
              </li>
              <li className="py-3">
                <Text size="sm">PMFBY Rabi enrolment closes on 31 December.</Text>
                <AppLink to="/schemes?scheme=pmfby" tone="muted" className="mt-1">
                  View scheme
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </AppLink>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="lg:pl-12">
            <Sprout className="h-6 w-6 text-leaf" strokeWidth={1.5} />
            <Heading as="h3" size="small" className="mt-6">
              Your farm
            </Heading>
            <Text size="sm" tone="muted" className="mt-3 max-w-xs">
              {completion.missing.length
                ? `${completion.pct}% Complete (Missing: ${completion.missing.join(", ")})`
                : "100% Complete — every suggestion now fits your farm."}
            </Text>
            <div className="mt-6 max-w-xs">
              <Progress value={completion.pct} />
              <Text size="xs" tone="muted" className="mt-2">
                Profile {completion.pct}% complete
              </Text>
            </div>
            <AppLink to="/profile" className="mt-6">
              {completion.missing.length ? "Complete your profile" : "Edit your profile"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </AppLink>
          </Reveal>
        </div>

        {/* Today's Farm Tasks Checklist */}
        <Reveal className="mt-16 rounded-3xl border border-border bg-card/60 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-wheat" />
              <div>
                <Heading as="h3" family="serif" size="subtitle">
                  Today's Field Tasks
                </Heading>
                <Text size="xs" tone="muted">
                  {tasks.filter((t) => !t.done).length} operations pending for optimal crop yield
                </Text>
              </div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              {tasks.filter((t) => t.done).length} / {tasks.length} Completed
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-start gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all ${
                  task.done
                    ? "border-border/40 bg-secondary/30 opacity-60 line-through"
                    : "border-border bg-card hover:border-wheat/50 hover:bg-wheat/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => {}}
                  className="mt-0.5 h-4 w-4 rounded accent-wheat cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {task.title}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{task.time}</span>
                    <span>•</span>
                    <span
                      className={`capitalize font-mono text-[10px] px-2 py-0.5 rounded-full ${
                        task.priority === "high"
                          ? "bg-alert/15 text-alert"
                          : task.priority === "medium"
                          ? "bg-wheat/15 text-wheat"
                          : "bg-leaf/15 text-leaf"
                      }`}
                    >
                      {task.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <Heading as="h3" family="serif" size="subtitle" className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-wheat" strokeWidth={1.5} />
              Live mandi commodity rates
            </Heading>
            <AppLink to="/market-price">
              All markets
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </AppLink>
          </div>
          <DataTable head={["Commodity", "Mandi Yard", "Today's Modal Price", "24h Change", "Action"]}>
            {DASHBOARD_RATES.map((row) => (
              <tr key={row.commodity}>
                <td>{row.commodity}</td>
                <td className="text-muted-foreground">{row.mandi}</td>
                <td className="font-mono tabular-nums">{formatINR(row.price)} / quintal</td>
                <td>
                  <Change value={row.change} />
                </td>
                <td>
                  <AppLink to={`/price-forecasting?commodity=${row.id}`}>
                    Forecast
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </AppLink>
                </td>
              </tr>
            ))}
          </DataTable>
        </Reveal>

        <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-8">
          {[
            { label: "Government schemes", to: "/schemes" },
            { label: "Your history", to: "/history" },
            { label: "Talk to an expert", to: "/expert-connect" },
            { label: "Sell your harvest", to: "/sell" },
          ].map((link) => (
            <AppLink key={link.to} to={link.to} tone="muted">
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </AppLink>
          ))}
        </div>
      </section>
    </>
  );
}
