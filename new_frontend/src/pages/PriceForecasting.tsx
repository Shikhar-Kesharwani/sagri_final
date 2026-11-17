import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { LineChart as ChartIcon, Loader2 } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Field, Segmented, Select } from "@/components/ui/form";
import { Text } from "@/components/ui/primitives";
import { CHART, DataTable, NextChapterBanner, PageHeader, Reveal, Section, Stat, Tag, pill } from "@/src/app/kit";
import { COMMODITIES, MANDIS_BY_STATE, commodityById } from "@/src/data/market";
import { formatINR } from "@/src/lib/format";
import { priceForecast, type ForecastPoint } from "@/src/lib/models";
import { useHistory, useProfile } from "@/src/lib/sagri";
import { districtById } from "@/src/data/places";

type Period = "1" | "3" | "6";
const STATES = Object.keys(MANDIS_BY_STATE);

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: ForecastPoint }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-xl">
      {p.actual !== undefined ? (
        <Text mono>
          {p.full}: {formatINR(p.actual)} / qtl
        </Text>
      ) : (
        <Text mono>
          {p.full}: Forecast {formatINR(p.forecast ?? 0)} / qtl
        </Text>
      )}
      {p.band && p.actual === undefined && (
        <Text size="xs" tone="muted" mono>
          (Range: {formatINR(p.band[0])} - {formatINR(p.band[1])})
        </Text>
      )}
    </div>
  );
}

export default function PriceForecasting() {
  const [params] = useSearchParams();
  const { add } = useHistory();
  const [profile] = useProfile();
  const farmDistrict = districtById(profile.district);
  const defaultState = MANDIS_BY_STATE[farmDistrict.state] ? farmDistrict.state : "Punjab";
  const initial = commodityById(params.get("commodity") ?? "wheat").id;
  const [commodity, setCommodity] = useState(initial);
  const [state, setState] = useState(defaultState);
  const [mandi, setMandi] = useState(MANDIS_BY_STATE[defaultState][0].name);
  const [period, setPeriod] = useState<Period>("6");
  const [query, setQuery] = useState({ commodity: initial, state: defaultState, mandi: MANDIS_BY_STATE[defaultState][0].name, period: "6" as Period });
  const [busy, setBusy] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
  const [apiResult, setApiResult] = useState<ReturnType<typeof priceForecast> | null>(null);

  const baseResult = useMemo(
    () => priceForecast(query.commodity, query.state, query.mandi, Number(query.period)),
    [query],
  );

  const result = apiResult ?? baseResult;

  const run = async (next?: Partial<typeof query>) => {
    const q = { commodity, state, mandi, period, ...next };
    setBusy(true);
    setQuery(q);
    try {
      const [forecastRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/api/forecast_price`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop_name: q.commodity,
            state: q.state,
            months_ahead: Number(q.period),
          }),
        }),
        fetch(`${API_BASE}/api/historical_prices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop_name: q.commodity,
            state: q.state,
            months: 6,
          }),
        }),
      ]);

      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        const r = priceForecast(q.commodity, q.state, q.mandi, Number(q.period));
        if (forecastData.forecast && forecastData.forecast.length > 0) {
          const realPoints = [...r.points];
          if (historyRes.ok) {
            try {
              const histData = await historyRes.json();
              if (Array.isArray(histData.history) && histData.history.length > 0) {
                const hist = histData.history;
                let hIdx = 0;
                for (let i = 0; i < realPoints.length; i++) {
                  if (realPoints[i].actual !== undefined && hIdx < hist.length) {
                    realPoints[i] = {
                      ...realPoints[i],
                      actual: Math.round(Number(hist[hIdx++].price)),
                    };
                  }
                }
              }
            } catch {
              // ignore history parse error
            }
          }
          let fIdx = 0;
          for (let i = 0; i < realPoints.length; i++) {
            if (realPoints[i].actual === undefined && fIdx < forecastData.forecast.length) {
              const item = forecastData.forecast[fIdx++];
              const p = Math.round(item.predicted_price);
              realPoints[i] = {
                ...realPoints[i],
                forecast: p,
                band: [Math.round(p * 0.96), Math.round(p * 1.04)],
              };
            }
          }
          const peak = Math.max(...realPoints.map((p) => p.forecast ?? p.actual ?? 0));
          const updated = {
            ...r,
            points: realPoints,
            peak,
            hold: peak > r.today,
          };
          setApiResult(updated);
          add({
            type: "Price",
            title: r.commodity.name,
            result: `Forecast: ${formatINR(peak)} / qtl · ${peak > r.today ? "Hold" : "Sell now"}`,
            details: [
              ["Mandi", r.mandi?.name ?? q.mandi],
              ["Today", `${formatINR(r.today)} / quintal`],
              ["MSP", r.commodity.msp ? formatINR(r.commodity.msp) : "Not covered"],
            ],
          });
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setBusy(false);
    }
    const r = priceForecast(q.commodity, q.state, q.mandi, Number(q.period));
    setApiResult(r);
    add({
      type: "Price",
      title: r.commodity.name,
      result: `Forecast: ${formatINR(r.peak)} / qtl · ${r.hold ? "Hold" : "Sell now"}`,
      details: [
        ["Mandi", r.mandi?.name ?? q.mandi],
        ["Today", `${formatINR(r.today)} / quintal`],
        ["MSP", r.commodity.msp ? formatINR(r.commodity.msp) : "Not covered"],
      ],
    });
  };

  const msp = result.commodity.msp;
  const rawYMin = Math.min(...result.points.map((p) => p.band?.[0] ?? p.actual ?? Infinity), msp ?? Infinity);
  const rawYMax = Math.max(...result.points.map((p) => p.band?.[1] ?? p.actual ?? 0));
  const yMin = Number.isFinite(rawYMin) && rawYMin > 0 ? Math.floor(rawYMin / 100) * 100 : 1500;
  const yMax = Number.isFinite(rawYMax) && rawYMax > 0 ? Math.ceil(rawYMax / 100) * 100 : 3500;

  return (
    <>
      <PageHeader
        eyebrow="Mandi Price Forecaster"
        title="Mandi Price Intelligence & Forecasting"
        subtitle="Autoregressive commodity price trends and selling advice"
      />

      <div className="mt-12 grid items-end gap-6 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto_auto]">
        <Field label="Commodity" htmlFor="commodity">
          <Select id="commodity" value={commodity} onChange={(e) => setCommodity(e.target.value)} options={COMMODITIES.map((c) => ({ value: c.id, label: c.name }))} />
        </Field>
        <Field label="State" htmlFor="state">
          <Select
            id="state"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setMandi(MANDIS_BY_STATE[e.target.value][0].name);
            }}
            options={STATES}
          />
        </Field>
        <Field label="Market (mandi)" htmlFor="mandi">
          <Select id="mandi" value={mandi} onChange={(e) => setMandi(e.target.value)} options={MANDIS_BY_STATE[state].map((m) => m.name)} />
        </Field>
        <Field label="Forecast period">
          <Segmented<Period>
            label="Forecast period"
            value={period}
            onChange={(v) => {
              setPeriod(v);
              run({ period: v });
            }}
            options={[
              { value: "1", label: "1 Month" },
              { value: "3", label: "3 Months" },
              { value: "6", label: "6 Months" },
            ]}
          />
        </Field>
        <Button variant="outline" className={pill} onClick={() => run()} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChartIcon className="h-4 w-4" />}
          Generate Forecast
        </Button>
      </div>

      <Reveal key={JSON.stringify(query)}>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Today's modal price"
            value={formatINR(result.today)}
            note={
              <>
                / quintal ·{" "}
                <span className={result.commodity.dayChange >= 0 ? "text-leaf" : "text-alert"}>
                  {result.commodity.dayChange >= 0 ? "+" : "−"}₹{Math.abs(result.commodity.dayChange)} today
                </span>
              </>
            }
          />
          <Stat
            label={`${query.period}-month projected peak`}
            value={formatINR(result.peak)}
            note={`/ quintal · Expected in Month ${result.peakIndex} (${result.peakLabel})`}
            tone="accent"
          />
          <Stat
            label="Government MSP benchmark"
            value={msp ? formatINR(msp) : "None"}
            note={
              msp
                ? `/ quintal · Market trades ${result.today >= msp ? "+" : "−"}₹${Math.abs(result.today - msp)} ${result.today >= msp ? "above" : "below"} MSP`
                : "Not covered by MSP"
            }
          />
          <Stat
            label="Strategic action"
            value={result.hold ? "HOLD CROP" : "SELL NOW"}
            tone={result.hold ? "good" : "bad"}
            note={result.hold ? `Prices expected to peak in ${result.daysToRise} days` : "Little upside expected — sell at the best nearby mandi"}
          />
        </div>

        <Text size="none" className="mt-16 font-serif text-2xl">Inflation-Adjusted Monthly Price Trajectory (₹ / Quintal)</Text>
        <div className="mt-6 h-80 w-full" role="img" aria-label={`${result.commodity.name} price chart`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={result.points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="label" stroke={CHART.muted} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                stroke={CHART.muted}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={64}
                domain={[Math.floor((yMin - 150) / 100) * 100, Math.ceil(yMax / 100) * 100]}
                tickFormatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area dataKey="band" stroke="none" fill={CHART.wheat} fillOpacity={0.12} isAnimationActive={false} />
              {msp && <ReferenceLine y={msp} stroke={CHART.clay} strokeDasharray="4 4" label={{ value: "MSP", fill: CHART.clay, fontSize: 12, position: "insideTopLeft" }} />}
              <Line dataKey="actual" stroke={CHART.foreground} strokeWidth={2} dot={false} />
              <Line dataKey="forecast" stroke={CHART.wheat} strokeWidth={2} strokeDasharray="6 4" dot={{ r: 3, fill: CHART.wheat }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-foreground" /> Historical Rate
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-6 border-t-2 border-dashed border-wheat" /> AI Predicted Rate
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-sm bg-wheat/20" /> Confidence Band
          </span>
        </div>
      </Reveal>

      <Section title="Nearby mandi arbitrage comparison" description="Net rate is today's price minus the per-quintal transport cost from your farm.">
        <DataTable head={["Mandi Yard", "Distance", "Today's Price", "Net Rate (After Transport)", "Daily Arrival Volume"]}>
          {result.nearby.map((m, i) => (
            <tr key={m.name}>
              <td>
                {m.name} {i === 0 && <Tag tone="good" className="ml-2">Best net</Tag>}
              </td>
              <td className="text-muted-foreground">{m.distance} km</td>
              <td className="font-mono tabular-nums">{formatINR(m.price)} / qtl</td>
              <td className="font-mono tabular-nums">{formatINR(m.net)} / qtl</td>
              <td className="text-muted-foreground">{m.arrivals.toLocaleString("en-IN")} Bags</td>
            </tr>
          ))}
        </DataTable>
      </Section>

      <NextChapterBanner
        nextChapter="Chapter 4 · Selling"
        nextTitle="Check Live Mandi Prices & List Produce"
        nextDesc="Compare real-time wholesale rates across APMC market yards and list your harvest for certified buyers."
        to="/market-price"
      />
    </>
  );
}
