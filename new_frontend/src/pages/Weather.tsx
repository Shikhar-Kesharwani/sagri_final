import { CloudRain, Droplets, Eye, Sprout, Sun, Wind } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Field, Select } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { CHART, LoadingBlock, Notice, PageHeader, Panel, Reveal, Section, Tag } from "@/src/app/kit";
import { DISTRICTS } from "@/src/data/places";
import { useProfile } from "@/src/lib/sagri";
import { describeWeather, sprayAdvice, useWeather, type Weather as WeatherData } from "@/src/lib/weather";

function operations(w: WeatherData) {
  const spray = sprayAdvice(w, "chemical fungicide");
  const nextRain = w.daily.find((d) => d.rain >= 50);
  const hot = w.daily[0].max >= 35;
  return [
    { title: "Spraying window", ok: spray.safe, text: spray.text },
    {
      title: "Irrigation",
      ok: !nextRain,
      text: nextRain
        ? `Rain is likely on ${nextRain.label} (${nextRain.rain}%). Skip irrigation until then.`
        : hot
          ? "It's hot and dry, so irrigate in the evening to cut evaporation."
          : "No significant rain this week. Irrigate on your usual schedule.",
    },
    {
      title: "Harvest and drying",
      ok: (w.daily[0].rain ?? 0) < 30 && (w.daily[1]?.rain ?? 0) < 30,
      text:
        (w.daily[0].rain ?? 0) < 30 && (w.daily[1]?.rain ?? 0) < 30
          ? "Two dry days ahead. Good for harvesting and sun-drying grain."
          : "Rain may wet grain left in the open. Cover harvested produce.",
    },
  ];
}

function TempTooltip({ active, payload }: { active?: boolean; payload?: { payload: { label: string; temp: number; rain: number } }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-xl">
      <Text size="xs" tone="muted">
        {p.label}
      </Text>
      <Text mono>
        {p.temp}°C · {p.rain}% rain
      </Text>
    </div>
  );
}

export default function Weather() {
  const [profile, setProfile] = useProfile();
  const weather = useWeather(profile.district);
  const condition = weather ? describeWeather(weather.current.code) : null;

  return (
    <>
      <PageHeader
        eyebrow="Live Weather & Rain Radar"
        title="Hyperlocal Weather & Spray Advisory"
        subtitle="Live agro-meteorological forecast, hourly rain probability, and spraying suitability"
        actions={
          <Field label="Location" htmlFor="loc" className="min-w-56">
            <Select
              id="loc"
              value={profile.district}
              onChange={(e) => setProfile((p) => ({ ...p, district: e.target.value }))}
              options={DISTRICTS.map((d) => ({ value: d.id, label: `${d.name}, ${d.short}` }))}
            />
          </Field>
        }
      />

      {!weather || !condition ? (
        <div className="mt-12">
          <LoadingBlock lines={6} />
        </div>
      ) : (
        <Reveal key={weather.place}>
          {weather.source === "sample" && (
            <div className="mt-8">
              <Notice>Live forecast unavailable right now. Showing a typical day for this season.</Notice>
            </div>
          )}
          <div className="mt-12 grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <Text size="sm" tone="muted">
                  {weather.place} · now
                </Text>
                <Tag tone={weather.source === "live" ? "good" : "neutral"}>{weather.source === "live" ? "Live · Open-Meteo" : "Sample"}</Tag>
              </div>
              <div className="mt-4 flex items-end gap-4">
                <Text size="none" as="div" className="font-serif text-8xl leading-none">
                  {Math.round(weather.current.temp)}°C
                </Text>
                <condition.icon className="mb-3 h-10 w-10 text-wheat" />
              </div>
              <Text size="none" className="mt-2 text-xl">{condition.label}</Text>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 text-sm">
                {[
                  { icon: Droplets, label: "Humidity", value: `${weather.current.humidity}%` },
                  { icon: Wind, label: "Wind speed", value: `${Math.round(weather.current.wind)} km/h` },
                  { icon: CloudRain, label: "Rainfall", value: `${weather.current.precipitation} mm` },
                  { icon: Eye, label: "Visibility", value: `${weather.current.visibility} km` },
                  { icon: Sun, label: "UV index", value: String(weather.current.uv) },
                  { icon: CloudRain, label: "Rain chance today", value: `${weather.daily[0].rain}%` },
                ].map((m) => (
                  <div key={m.label} className="flex items-start gap-3">
                    <m.icon className="mt-0.5 h-4 w-4 text-rain" />
                    <div>
                      <dt className="text-muted-foreground">{m.label}</dt>
                      <dd className="mt-1 font-mono tabular-nums">{m.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="space-y-4 lg:col-span-3">
              <Heading as="h2" family="serif" size="subtitle" className="flex items-center gap-3">
                <Sprout className="h-5 w-5 text-wheat" />
                Farm Operations Advisory
              </Heading>
              {operations(weather).map((op) => (
                <Panel key={op.title} className="flex items-start gap-4">
                  <span className={op.ok ? "mt-2 h-2 w-2 shrink-0 rounded-full bg-leaf" : "mt-2 h-2 w-2 shrink-0 rounded-full bg-alert"} />
                  <div>
                    <Text size="none" className="font-serif text-2xl">{op.title}</Text>
                    <Text size="sm" tone="muted" className="mt-1">
                      {op.text}
                    </Text>
                  </div>
                </Panel>
              ))}
            </div>
          </div>

          <Section title="Hourly temperature" description="Today, from 6 AM to 10 PM.">
            <div className="h-64" role="img" aria-label="Hourly temperature chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weather.hourly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART.wheat} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART.wheat} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="label" stroke={CHART.muted} tickLine={false} axisLine={false} fontSize={12} interval={1} />
                  <YAxis stroke={CHART.muted} tickLine={false} axisLine={false} fontSize={12} unit="°" domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip content={<TempTooltip />} />
                  <Area dataKey="temp" stroke={CHART.wheat} strokeWidth={2} fill="url(#temp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="7-Day Forecast">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4 lg:grid-cols-7">
              {weather.daily.map((day) => {
                const d = describeWeather(day.code);
                return (
                  <div key={day.label} className="bg-background p-5">
                    <Text size="sm" tone="muted">
                      {day.label}
                    </Text>
                    <d.icon className="mt-4 h-6 w-6 text-wheat" />
                    <Text className="mt-4 font-mono tabular-nums">
                      {day.max}° <span className="text-muted-foreground">/ {day.min}°</span>
                    </Text>
                    <Text size="xs" tone="muted" className="mt-1">
                      {d.label} · Rain {day.rain}%
                    </Text>
                  </div>
                );
              })}
            </div>
          </Section>
        </Reveal>
      )}
    </>
  );
}
