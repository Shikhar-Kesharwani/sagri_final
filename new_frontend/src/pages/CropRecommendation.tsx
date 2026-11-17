import { useState } from "react";
import { CloudSun, Loader2, MapPinned, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, Slider, Switch, TextInput } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { KeyValue, Meter, NextChapterBanner, PageHeader, Panel, Reveal, Tag, pill } from "@/src/app/kit";
import { CROPS, SEASONS, SOIL_TYPES, type CropProfile, type Season } from "@/src/data/crops";
import { STATES, districtById } from "@/src/data/places";
import { formatINR } from "@/src/lib/format";
import { fertilizerAdvice, recommendCrops, revenuePerAcre, type CropInputs } from "@/src/lib/models";
import { useHistory, useProfile } from "@/src/lib/sagri";
import { useWeather } from "@/src/lib/weather";

const DEFAULTS: CropInputs = {
  n: 118,
  p: 46,
  k: 20,
  ph: 7.2,
  temp: 32,
  humidity: 65,
  rain: 80,
  season: "Kharif",
  soil: "Black",
  irrigation: true,
  greenhouse: false,
};

/** Regional soil-card benchmarks by state, used by "Auto-fill from Regional Benchmark". */
const REGION_SOIL: Record<string, Pick<CropInputs, "n" | "p" | "k" | "ph" | "soil">> = {
  "Madhya Pradesh": { n: 118, p: 46, k: 20, ph: 7.2, soil: "Black" },
  Punjab: { n: 92, p: 42, k: 38, ph: 7.8, soil: "Alluvial" },
  Haryana: { n: 88, p: 40, k: 36, ph: 7.9, soil: "Alluvial" },
  Rajasthan: { n: 40, p: 30, k: 30, ph: 8.1, soil: "Sandy loam" },
  Gujarat: { n: 70, p: 38, k: 45, ph: 7.6, soil: "Black" },
  Maharashtra: { n: 105, p: 44, k: 28, ph: 7.4, soil: "Black" },
  "Uttar Pradesh": { n: 82, p: 46, k: 40, ph: 7.3, soil: "Alluvial" },
  Bihar: { n: 76, p: 48, k: 42, ph: 6.9, soil: "Alluvial" },
  "Tamil Nadu": { n: 68, p: 35, k: 48, ph: 6.8, soil: "Red" },
  Karnataka: { n: 80, p: 40, k: 35, ph: 6.5, soil: "Red" },
  "Andhra Pradesh": { n: 95, p: 42, k: 30, ph: 7.5, soil: "Black" },
  Telangana: { n: 90, p: 40, k: 28, ph: 7.3, soil: "Red" },
  "West Bengal": { n: 75, p: 50, k: 45, ph: 6.2, soil: "Alluvial" },
  Kerala: { n: 55, p: 25, k: 35, ph: 5.5, soil: "Laterite" },
  "Himachal Pradesh": { n: 45, p: 30, k: 50, ph: 6.2, soil: "Sandy loam" },
  Uttarakhand: { n: 60, p: 38, k: 42, ph: 6.5, soil: "Alluvial" },
  Odisha: { n: 65, p: 32, k: 30, ph: 5.8, soil: "Red" },
  Assam: { n: 70, p: 35, k: 40, ph: 5.4, soil: "Alluvial" },
  Chhattisgarh: { n: 75, p: 36, k: 25, ph: 6.4, soil: "Red" },
  Jharkhand: { n: 62, p: 30, k: 28, ph: 6.0, soil: "Red" },
};

const RANKS = ["Best Match", "Strong Alternative", "Viable Crop"];
const phLabel = (ph: number) => (ph < 6.5 ? "Acidic" : ph > 7.5 ? "Alkaline" : "Neutral");

function NutrientControl({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  hint?: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <Field label={`${label} — ${min} to ${max}${unit ? ` ${unit}` : ""}`} htmlFor={id} hint={hint}>
      <div className="flex items-center gap-4">
        <Slider aria-label={label} min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <div className="w-24 shrink-0">
          <TextInput
            id={id}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value)))}
            className="text-right font-mono"
          />
        </div>
      </div>
    </Field>
  );
}

export default function CropRecommendation() {
  const [profile] = useProfile();
  const district = districtById(profile.district);
  const weather = useWeather(profile.district);
  const { add } = useHistory();
  const [state, setState] = useState(district.state);
  const [form, setForm] = useState<CropInputs>({ ...DEFAULTS, irrigation: profile.irrigation });
  // Opens with the benchmark result so the page is never empty.
  const [results, setResults] = useState(() => ({ input: DEFAULTS, top: recommendCrops(DEFAULTS) }));
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof CropInputs>(key: K, value: CropInputs[K]) => setForm((f) => ({ ...f, [key]: value }));

  const autofill = () => setForm((f) => ({ ...f, ...(REGION_SOIL[state] ?? REGION_SOIL["Punjab"] ?? REGION_SOIL["Madhya Pradesh"]) }));
  const detectWeather = () => {
    if (!weather) return;
    setForm((f) => ({ ...f, temp: Math.round(weather.current.temp * 10) / 10, humidity: Math.round(weather.current.humidity) }));
  };

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/predict_crop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: Number(form.n),
          P: Number(form.p),
          K: Number(form.k),
          temperature: Number(form.temp),
          humidity: Number(form.humidity),
          ph: Number(form.ph),
          rainfall: Number(form.rain),
          state: state,
          season: form.season,
          soil_texture: form.soil === "Sandy loam" ? "Sandy" : (form.soil === "Alluvial" ? "Silt" : (form.soil === "Clayey" ? "Clay" : form.soil)),
          irrigation: form.irrigation ? 1 : 0,
          is_controlled_env: form.greenhouse,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.top3 && data.top3.length > 0) {
          const mapped = data.top3.map((item: any, idx: number) => {
            const matchedCrop = CROPS.find(
              (c) =>
                c.id.toLowerCase() === item.crop.toLowerCase() ||
                c.name.toLowerCase().includes(item.crop.toLowerCase())
            ) || CROPS[idx] || CROPS[0];
            const updatedCrop: CropProfile = {
              ...matchedCrop,
              focus: item.note || matchedCrop.focus,
              advice: item.prescription || matchedCrop.advice,
              note: item.note || matchedCrop.note,
            };
            return {
              crop: updatedCrop,
              score: Math.round(Number(item.confidence) * 10) / 10,
              revenue: revenuePerAcre(updatedCrop),
            };
          });
          setResults({ input: form, top: mapped });
          add({
            type: "Crop",
            title: `${mapped[0].crop.name} Recommended`,
            result: `${mapped[0].score}% Suitability`,
            details: [
              ["Runner-up", mapped.slice(1).map((r: any) => r.crop.name).join(", ")],
              ["Soil", `${form.soil}, pH ${form.ph}`],
              ["Rainfall", `${form.rain} mm`],
            ],
          });
          return;
        }
      }
      const top = recommendCrops(form);
      setResults({ input: form, top });
    } catch {
      const top = recommendCrops(form);
      setResults({ input: form, top });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Crop Recommendation"
        title="Smart Crop Recommendation"
        subtitle="Get personalized crop suggestions based on your soil and climate data"
        actions={
          <Button variant="outline" className={pill} onClick={autofill}>
            <MapPinned className="h-4 w-4" />
            Auto-fill from Regional Benchmark ({state})
          </Button>
        }
      />

      <form onSubmit={submit} className="mt-12 grid gap-16 lg:grid-cols-2">
        <div className="space-y-14">
          <fieldset className="space-y-6">
            <legend className="mb-6 font-serif text-3xl">Farm geography & agronomics</legend>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="State" htmlFor="state">
                <Select id="state" value={state} onChange={(e) => setState(e.target.value)} options={STATES} />
              </Field>
              <Field label="Season" htmlFor="season">
                <Select id="season" value={form.season} onChange={(e) => set("season", e.target.value as Season)} options={[...SEASONS]} />
              </Field>
              <Field label="Soil type" htmlFor="soil">
                <Select id="soil" value={form.soil} onChange={(e) => set("soil", e.target.value)} options={SOIL_TYPES} />
              </Field>
              <Field label="Irrigation available" htmlFor="irrigation">
                <Select
                  id="irrigation"
                  value={form.irrigation ? "Yes" : "No"}
                  onChange={(e) => set("irrigation", e.target.value === "Yes")}
                  options={["Yes", "No"]}
                />
              </Field>
            </div>
            <Switch checked={form.greenhouse} onCheckedChange={(v) => set("greenhouse", v)} label="Controlled environment / greenhouse" />
          </fieldset>

          <fieldset className="space-y-6">
            <legend className="mb-6 font-serif text-3xl">Soil macronutrients (NPK)</legend>
            <NutrientControl id="n" label="Nitrogen (N)" value={form.n} onChange={(v) => set("n", v)} min={0} max={140} unit="kg/ha" />
            <NutrientControl id="p" label="Phosphorus (P)" value={form.p} onChange={(v) => set("p", v)} min={5} max={145} unit="kg/ha" />
            <NutrientControl id="k" label="Potassium (K)" value={form.k} onChange={(v) => set("k", v)} min={5} max={205} unit="kg/ha" />
            <NutrientControl
              id="ph"
              label="Soil pH"
              value={form.ph}
              onChange={(v) => set("ph", v)}
              min={3.5}
              max={9.5}
              step={0.1}
              unit=""
              hint={`Current: ${form.ph.toFixed(1)} — ${phLabel(form.ph)}`}
            />
          </fieldset>

          <fieldset>
            <legend className="mb-6 flex w-full flex-wrap items-center justify-between gap-4 font-serif text-3xl">
              Weather & climate data
            </legend>
            <Button variant="outline" className={`${pill} mb-6`} onClick={detectWeather} disabled={!weather}>
              <CloudSun className="h-4 w-4" />
              Auto-detect Current Weather
            </Button>
            <div className="grid gap-6 sm:grid-cols-3">
              <Field label="Temperature (°C)" htmlFor="temp">
                <TextInput id="temp" type="number" step={0.1} min={0} max={50} value={form.temp} onChange={(e) => set("temp", Number(e.target.value))} />
              </Field>
              <Field label="Humidity (%)" htmlFor="hum">
                <TextInput id="hum" type="number" step={0.1} min={0} max={100} value={form.humidity} onChange={(e) => set("humidity", Number(e.target.value))} />
              </Field>
              <Field label="Rainfall (mm)" htmlFor="rain">
                <TextInput id="rain" type="number" step={0.1} min={0} max={400} value={form.rain} onChange={(e) => set("rain", Number(e.target.value))} />
              </Field>
            </div>
          </fieldset>

          <Button type="submit" variant="outline" className={pill} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Get Crop Suggestions
          </Button>
        </div>

        <div className="space-y-12 lg:sticky lg:top-24 lg:self-start" aria-live="polite">
          {results.top.map((r, i) => (
            <Reveal key={`${r.crop.id}-${i}`} delay={i * 0.08}>
              <Panel tone={i === 0 ? "highlight" : "default"}>
                <Tag tone={i === 0 ? "accent" : "neutral"}>
                  #{i + 1} {RANKS[i] ?? "Viable Crop"} · {r.score}% Suitability
                </Tag>
                <Heading as="h3" family="serif" size={i === 0 ? "title" : "subtitle"} className="mt-4">
                  {r.crop.name}
                  {r.crop.alias && <span className="text-muted-foreground"> ({r.crop.alias})</span>}
                </Heading>
                <div className="mt-4">
                  <Meter value={r.score} label={`${r.crop.name} suitability`} tone={i === 0 ? "accent" : "info"} />
                </div>
                {i === 0 && (
                  <Text tone="muted" className="mt-6">
                    Your soil's {results.input.n} kg/ha Nitrogen and {results.input.ph} pH provide ideal conditions for{" "}
                    {r.crop.focus ?? "healthy vegetative growth"}.
                  </Text>
                )}
                {r.crop.note && (
                  <Text size="sm" tone="muted" className="mt-4">
                    {r.crop.note}
                  </Text>
                )}
                <div className="mt-6">
                  <KeyValue label="Expected yield" value={`${r.crop.yield[0]}–${r.crop.yield[1]} Quintals / Acre`} />
                  {i === 0 && (
                    <KeyValue
                      label="Current market rate"
                      value={`${formatINR(r.crop.price)} / Quintal${r.crop.market ? ` (${r.crop.market})` : ""}`}
                    />
                  )}
                  <KeyValue label="Projected revenue" value={<span className="font-mono tabular-nums">{formatINR(r.revenue)} / Acre</span>} />
                </div>
                {r.crop.advice && (
                  <div className="mt-5 rounded-xl border border-wheat/30 bg-wheat/5 p-3.5">
                    <Text size="xs" tone="muted" className="font-semibold uppercase tracking-wider text-wheat">
                      Agronomic Prescription
                    </Text>
                    <Text size="sm" className="mt-1 font-medium text-foreground">
                      {r.crop.advice}
                    </Text>
                  </div>
                )}
                {i === 0 && (
                  <Text size="sm" className="mt-6 border-l-2 border-wheat pl-4">
                    {fertilizerAdvice(results.input)}
                  </Text>
                )}
              </Panel>
            </Reveal>
          ))}
        </div>
      </form>

      <Text size="sm" tone="muted" className="mt-20 max-w-2xl border-t border-border pt-6">
        Projected revenue is lower-bound yield multiplied by today's modal mandi rate. Check the Mandi Forecast before you sow.
      </Text>

      <NextChapterBanner
        nextChapter="Chapter 3 · Growing Season"
        nextTitle="Protect Your Foliage with Disease Vision"
        nextDesc="Monitor your crop's canopy for early blight, rust, or pathogen spots with our deep learning vision model."
        to="/disease-detection"
      />
    </>
  );
}
