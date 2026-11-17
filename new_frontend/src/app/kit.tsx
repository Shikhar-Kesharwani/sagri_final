import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, Inbox, Sparkles } from "lucide-react";
import { Heading, Text } from "@/components/ui/primitives";
import { Link, useLocation } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { CHAPTERS, chapterFor } from "@/src/data/nav";
import { districtById } from "@/src/data/places";
import { useProfile } from "@/src/lib/sagri";
import { describeWeather, useWeather } from "@/src/lib/weather";
import { cn } from "@/lib/cn";

/** Class names that turn the base Button into the app's pill button. */
export const pill = "h-11 gap-2 rounded-full px-6";

/** Chart colours mirrored from the CSS tokens (SVG attributes cannot read CSS variables). */
export const CHART = {
  wheat: "hsl(41, 62%, 64%)",
  leaf: "hsl(95, 30%, 54%)",
  rain: "hsl(205, 30%, 64%)",
  clay: "hsl(16, 55%, 54%)",
  alert: "hsl(4, 62%, 60%)",
  grid: "hsl(32, 12%, 18%)",
  muted: "hsl(35, 12%, 62%)",
  card: "hsl(30, 12%, 9%)",
  foreground: "hsl(40, 30%, 92%)",
};

/** Kharif runs June–October, Rabi November–March, Zaid April–May. */
export function currentSeason(date = new Date()) {
  const m = date.getMonth() + 1;
  return m >= 6 && m <= 10 ? "Kharif" : m >= 4 && m <= 5 ? "Zaid" : "Rabi";
}

/**
 * Tool page opening. A full-bleed band lit with the sky colour of the season chapter the tool
 * belongs to, with the same chapter rail as the home page's scroll story, so every page reads
 * as a continuation of that story.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const chapter = chapterFor(pathname);
  const [profile] = useProfile();
  const district = districtById(profile.district);
  const weather = useWeather(profile.district);
  const condition = weather ? describeWeather(weather.current.code) : null;
  // The home page's sun travels left to right across the season.
  const sunX = 18 + chapter.at * 64;
  return (
    <header className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-border/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${chapter.sky}, hsl(var(--background)) 92%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 h-96 w-96 -translate-x-1/2 rounded-full opacity-[0.22] blur-3xl"
        style={{ left: `${sunX}%`, background: "radial-gradient(circle, hsl(40, 90%, 72%) 0%, hsl(26, 70%, 45%) 100%)" }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 pt-8 lg:px-10 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-wheat/30 bg-background/70 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition-all hover:border-wheat hover:bg-wheat/10 shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-wheat transition-transform group-hover:-translate-x-1" />
            <span>Season Story</span>
          </Link>
          <span className="text-muted-foreground/40 font-mono">/</span>
          <span className="text-xs font-serif text-wheat tracking-wide">
            {chapter.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link to="/weather" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
            {condition && <condition.icon className="h-3.5 w-3.5 text-rain" strokeWidth={1.5} />}
            {district.name}, {district.state}
            {weather && condition && ` · ${Math.round(weather.current.temp)}°C ${condition.label}`}
          </Link>
          <span className="opacity-30">|</span>
          <Link to="/profile" className="transition-colors hover:text-foreground">
            {profile.name} · {profile.acres} Acres ({currentSeason()})
          </Link>
        </div>
      </div>
      <div className="relative mx-auto flex max-w-7xl items-end justify-between gap-12 px-6 pb-16 pt-10 lg:px-10 lg:pb-24 lg:pt-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-wheat/25 bg-wheat/10 px-3.5 py-1 text-xs text-wheat mb-4 font-mono uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-wheat" />
            <span>{chapter.label}</span>
            <span className="opacity-40">·</span>
            <span>{eyebrow}</span>
          </div>
          <Heading as="h1" family="serif" size="display" className="mt-2">
            {title}
          </Heading>
          {subtitle && (
            <Text size="lg" tone="muted" className="mt-6 max-w-xl">
              {subtitle}
            </Text>
          )}
          {actions && <div className="mt-10 flex flex-wrap items-end gap-3 print:hidden">{actions}</div>}
        </motion.div>

        <nav
          aria-label="Season Timeline"
          className="hidden shrink-0 flex-col items-end gap-3.5 rounded-2xl border border-border/40 bg-background/80 px-6 py-5 backdrop-blur-md lg:flex print:hidden shadow-xl"
        >
          <div className="text-[10px] uppercase font-mono tracking-widest text-wheat/80 mb-1">Season Timeline</div>
          {CHAPTERS.map((c) => {
            const active = c.key === chapter.key;
            return (
              <Link key={c.key} to={c.to} aria-current={active ? "step" : undefined} className="group flex items-center gap-3">
                <Text
                  as="span"
                  size="xs"
                  tone={active ? "default" : "muted"}
                  className={cn("transition-all", active ? "opacity-100 text-wheat font-semibold" : "opacity-50 group-hover:opacity-100")}
                >
                  {c.label}
                </Text>
                <span
                  className={cn(
                    "block h-px w-10 origin-right transition-all duration-300",
                    active ? "scale-x-100 bg-wheat h-0.5 shadow-[0_0_8px_rgba(217,170,89,0.8)]" : "scale-x-[0.35] bg-foreground opacity-30 group-hover:scale-x-75 group-hover:opacity-70",
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function NextChapterBanner({
  nextChapter,
  nextTitle,
  nextDesc,
  to,
}: {
  nextChapter: string;
  nextTitle: string;
  nextDesc: string;
  to: string;
}) {
  return (
    <div className="mt-20 border-t border-border pt-10">
      <Link
        to={to}
        className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-card via-card/90 to-wheat/10 p-6 md:p-8 transition-all hover:border-wheat/40 hover:shadow-2xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-wheat">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next Season Step</span>
              <span>·</span>
              <span>{nextChapter}</span>
            </div>
            <h4 className="mt-2 font-serif text-2xl md:text-3xl text-foreground group-hover:text-wheat transition-colors">
              {nextTitle}
            </h4>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {nextDesc}
            </p>
          </div>
          <div className="shrink-0 inline-flex items-center gap-2 rounded-full border border-wheat/30 bg-wheat/10 px-6 py-3 text-sm font-medium text-wheat group-hover:bg-wheat group-hover:text-primary-foreground transition-all shadow-md">
            <span>Proceed to Next Step</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function Section({
  title,
  eyebrow,
  description,
  action,
  children,
  className,
  tone = "default",
}: {
  title: React.ReactNode;
  eyebrow?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "paper";
}) {
  if (tone === "paper") {
    return (
      <section className={cn("relative left-1/2 mt-24 w-screen -translate-x-1/2 bg-paper text-ink lg:mt-32", className)}>
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-12 lg:px-10 lg:py-40">
          <Reveal className="lg:col-span-4">
            {eyebrow && (
              <Text size="sm" tone="inkMuted">
                {eyebrow}
              </Text>
            )}
            <Heading as="h2" family="serif" size="title" tone="ink" className="mt-4">
              {title}
            </Heading>
            {description && (
              <Text size="sm" tone="inkMuted" className="mt-4 max-w-xs">
                {description}
              </Text>
            )}
            {action && <div className="mt-8">{action}</div>}
          </Reveal>
          <div className="lg:col-span-8">{children}</div>
        </div>
      </section>
    );
  }
  return (
    <section className={cn("mt-24 lg:mt-32", className)}>
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          {eyebrow && (
            <Text size="sm" tone="accent" className="mb-3">
              {eyebrow}
            </Text>
          )}
          <Heading as="h2" family="serif" size="title">
            {title}
          </Heading>
          {description && (
            <Text size="sm" tone="muted" className="mt-4 max-w-xl">
              {description}
            </Text>
          )}
        </div>
        {action}
      </Reveal>
      {children}
    </section>
  );
}

export function Panel({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "paper" | "highlight";
}) {
  return (
    <div
      className={cn(
        tone === "default" && "border-t border-border pt-8",
        tone === "highlight" && "border-t-2 border-wheat pt-8",
        tone === "paper" && "rounded-2xl bg-paper p-6 text-ink sm:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  tone?: "default" | "good" | "bad" | "accent";
}) {
  return (
    <div className="border-t border-border pt-5">
      <Text size="sm" tone="muted">
        {label}
      </Text>
      <Text size="none"
        as="div"
        className={cn(
          "mt-3 font-serif text-5xl leading-none",
          tone === "good" && "text-leaf",
          tone === "bad" && "text-alert",
          tone === "accent" && "text-wheat",
        )}
      >
        {value}
      </Text>
      {note && (
        <Text size="sm" tone="muted" className="mt-2">
          {note}
        </Text>
      )}
    </div>
  );
}

type TagTone = "neutral" | "good" | "warn" | "bad" | "info" | "accent";
const tagTones: Record<TagTone, string> = {
  neutral: "border-border text-muted-foreground",
  good: "border-leaf/40 bg-leaf/10 text-leaf",
  warn: "border-clay/40 bg-clay/10 text-clay",
  bad: "border-alert/40 bg-alert/10 text-alert",
  info: "border-rain/40 bg-rain/10 text-rain",
  accent: "border-wheat/40 bg-wheat/10 text-wheat",
};

export function Tag({ tone = "neutral", children, className }: { tone?: TagTone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium", tagTones[tone], className)}>
      {children}
    </span>
  );
}

export const statusTone = (status: string): TagTone =>
  /optimal|low risk|completed|eligible|safe|^low$/i.test(status)
    ? "good"
    : /moderate|upcoming|active/i.test(status)
      ? "accent"
      : /high|deficit|^low/i.test(status)
        ? "bad"
        : "neutral";

export function Meter({ value, tone = "accent", label }: { value: number; tone?: "accent" | "good" | "bad" | "info"; label?: string }) {
  return (
    <div
      role="meter"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "h-full rounded-full",
          tone === "accent" && "bg-wheat",
          tone === "good" && "bg-leaf",
          tone === "bad" && "bg-alert",
          tone === "info" && "bg-rain",
        )}
      />
    </div>
  );
}

export function KeyValue({
  label,
  value,
  className,
  paper = false,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
  paper?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 border-b py-3 last:border-b-0",
        paper ? "border-line" : "border-border",
        className,
      )}
    >
      <Text size="sm" tone={paper ? "inkMuted" : "muted"}>
        {label}
      </Text>
      <Text as="div" size="sm" tone={paper ? "ink" : "default"} className="text-right">
        {value}
      </Text>
    </div>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      <Inbox className="h-6 w-6 text-muted-foreground" />
      <Text size="none" className="mt-4 font-serif text-2xl">{title}</Text>
      {body && (
        <Text size="sm" tone="muted" className="mt-2 max-w-sm">
          {body}
        </Text>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
        tone === "info" ? "border-rain/30 bg-rain/5 text-rain" : "border-clay/40 bg-clay/10 text-clay",
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function LoadingBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/** Shared table look: hairline rows, muted headers. */
export function DataTable({ head, children, className }: { head: React.ReactNode[]; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            {head.map((h, i) => (
              <th key={i} scope="col" className={cn("pb-3 pr-6 font-normal", i === head.length - 1 && "pr-0 text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:py-4 [&_td]:pr-6 [&_td:last-child]:pr-0 [&_td:last-child]:text-right [&_tr]:border-b [&_tr]:border-border">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function Change({ value }: { value: number }) {
  return (
    <span className={cn("font-mono tabular-nums", value >= 0 ? "text-leaf" : "text-alert")}>
      {value >= 0 ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}
