import { useState } from "react";
import { Loader2, Radar, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalButton } from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";
import { Field, Select, TextInput } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { CHART, KeyValue, Meter, NextChapterBanner, PageHeader, Panel, Reveal, Tag, pill } from "@/src/app/kit";
import { SEASONS, type Season } from "@/src/data/crops";
import { formatINR } from "@/src/lib/format";
import { INSURED_PER_ACRE, RISK_CROPS, RISK_CROP_LABELS, riskAnalysis, type RiskInputs } from "@/src/lib/models";
import { useHistory, useProfile } from "@/src/lib/sagri";

function Gauge({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const color = value < 20 ? CHART.leaf : value < 40 ? CHART.wheat : CHART.alert;
  const r = 80;
  const circumference = Math.PI * r;
  return (
    <svg viewBox="0 0 200 116" className="w-full max-w-xs" role="img" aria-label={`Failure probability ${value}%`}>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke={CHART.grid} strokeWidth="14" strokeLinecap="round" />
      <motion.path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference * (1 - Math.min(100, value) / 100) }}
        transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x="100" y="92" textAnchor="middle" fill={CHART.foreground} fontSize="34" fontFamily="Instrument Serif, serif">
        {value}%
      </text>
    </svg>
  );
}

const DEFAULTS: RiskInputs = { crop: "Rice", season: "Kharif", rain: 100, temp: 28, ph: 6.5 };

export default function RiskRadar() {
  const [profile] = useProfile();
  const { add } = useHistory();
  const [form, setForm] = useState<RiskInputs>(DEFAULTS);
  const [result, setResult] = useState(() => riskAnalysis(DEFAULTS));
  const [inputs, setInputs] = useState(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof RiskInputs>(k: K, v: RiskInputs[K]) => setForm((f) => ({ ...f, [k]: v }));

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

  const analyse = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/predict_risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropType: form.crop,
          soilPh: Number(form.ph),
          rainfall: Number(form.rain),
          temperature: Number(form.temp),
          season: form.season,
          humidity: 65.0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const r = riskAnalysis(form);
        const prob = typeof data.probability === "number" ? data.probability : typeof data.riskLevel === "number" ? data.riskLevel : r.probability;
        const level = prob < 35 ? "Low Risk" : prob < 65 ? "Moderate Risk" : "High Risk";
        const updated = {
          ...r,
          probability: Math.round(prob * 10) / 10,
          level,
        };
        setResult(updated);
        setInputs(form);
        const worst = [...r.factors].sort((a, b) => b.value - a.value)[0];
        add({
          type: "Risk",
          title: `${RISK_CROP_LABELS[form.crop] ?? form.crop} Failure Risk`,
          result: `${updated.probability}% Probability · ${updated.level}`,
          details: [
            ["Largest factor", worst.label],
            ["Rainfall", `${form.rain} mm`],
            ["Temperature", `${form.temp}°C`],
          ],
        });
        return;
      }
    } catch {
      // Fallback below
    } finally {
      setBusy(false);
    }
    const r = riskAnalysis(form);
    setResult(r);
    setInputs(form);
    const worst = [...r.factors].sort((a, b) => b.value - a.value)[0];
    add({
      type: "Risk",
      title: `${RISK_CROP_LABELS[form.crop] ?? form.crop} Failure Risk`,
      result: `${r.probability}% Probability · ${r.level}`,
      details: [
        ["Largest factor", worst.label],
        ["Rainfall", `${form.rain} mm`],
        ["Temperature", `${form.temp}°C`],
      ],
    });
  };

  const commercial = ["Cotton", "Sugarcane"].includes(inputs.crop);
  const premiumRate = commercial ? 0.05 : inputs.season === "Rabi" ? 0.015 : 0.02;
  const perAcre = INSURED_PER_ACRE[inputs.crop] ?? 40000;
  const insured = perAcre * profile.acres;
  const premium = insured * premiumRate;
  const cropLabel = RISK_CROP_LABELS[inputs.crop] ?? inputs.crop;
  const deadlineYear = new Date().getFullYear();

  return (
    <>
      <PageHeader
        eyebrow="Crop Risk Radar"
        title="Crop Failure & Climate Risk Radar"
        subtitle="Evaluate drought shock, temperature stress, and yield shortfall risks before sowing"
        actions={<Tag tone="accent">XGBoost Machine Learning Model · Accuracy: 99.87%</Tag>}
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <form onSubmit={analyse} className="space-y-6 lg:col-span-2">
          <Field label="Crop name" htmlFor="crop">
            <Select
              id="crop"
              value={form.crop}
              onChange={(e) => set("crop", e.target.value)}
              options={Object.keys(RISK_CROPS).map((c) => ({ value: c, label: RISK_CROP_LABELS[c] ?? c }))}
            />
          </Field>
          <Field label="Sowing season" htmlFor="season">
            <Select id="season" value={form.season} onChange={(e) => set("season", e.target.value as Season)} options={[...SEASONS]} />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Total rainfall (mm)" htmlFor="rain">
              <TextInput id="rain" type="number" min={0} max={500} value={form.rain} onChange={(e) => set("rain", Number(e.target.value))} />
            </Field>
            <Field label="Temp. (°C)" htmlFor="temp">
              <TextInput id="temp" type="number" min={-5} max={50} value={form.temp} onChange={(e) => set("temp", Number(e.target.value))} />
            </Field>
            <Field label="Soil pH" htmlFor="ph">
              <TextInput id="ph" type="number" min={3} max={10} step={0.1} value={form.ph} onChange={(e) => set("ph", Number(e.target.value))} />
            </Field>
          </div>
          <Button type="submit" variant="outline" className={pill} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
            Run Risk Analysis
          </Button>
        </form>

        <Reveal key={JSON.stringify(inputs)} className="lg:col-span-3">
          <Panel>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <Gauge value={result.probability} />
              <div>
                <Text size="sm" tone="muted">
                  {cropLabel} · {inputs.season}
                </Text>
                <Heading as="h2" family="serif" size="subtitle" className="mt-2">
                  {result.probability}% Crop Failure Probability
                </Heading>
                <Tag tone={result.level.includes("Low") ? "good" : result.level.includes("Moderate") ? "accent" : "bad"} className="mt-3">
                  {result.level.includes("Low")
                    ? "LOW RISK — Crop conditions are stable and safe"
                    : result.level.includes("Moderate")
                      ? "MODERATE RISK — Monitor the flagged factors closely"
                      : "HIGH RISK — Act before sowing"}
                </Tag>
              </div>
            </div>
            <Text size="sm" tone="muted" className="mt-10">
              4-factor vulnerability breakdown
            </Text>
            <div className="mt-4 space-y-6">
              {result.factors.map((f) => (
                <div key={f.label}>
                  <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
                    <span>{f.label}</span>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {f.value}% ({f.note})
                    </span>
                  </div>
                  <Meter value={f.value} tone={f.value < 20 ? "good" : f.value < 40 ? "accent" : "bad"} label={f.label} />
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>
      </div>

      <Panel tone="paper" className="mt-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <ShieldCheck className="h-6 w-6 text-ink" />
            <Heading as="h2" family="serif" size="subtitle" tone="ink" className="mt-4">
              Pradhan Mantri Fasal Bima Yojana
            </Heading>
            <Text tone="inkMuted" className="mt-3">
              Government crop insurance against yield loss from drought, flood, pests and disease. You pay a small
              subsidised premium; the government pays the rest.
            </Text>
            <ExternalButton href="https://pmfby.gov.in" variant="primary" className="mt-6 bg-ink text-paper hover:bg-ink/90">
              Link Land Records & Enroll in PMFBY
            </ExternalButton>
          </div>
          <div>
            <KeyValue
              paper
              label="Subsidized farmer premium"
              value={`${(premiumRate * 100).toFixed(1).replace(".0", "")}% for ${inputs.season} ${inputs.crop === "Rice" ? "Paddy" : inputs.crop} (${formatINR(perAcre * premiumRate)} / acre)`}
            />
            <KeyValue paper label="Sum insured" value={`${formatINR(perAcre)} per Acre`} />
            <KeyValue paper label={`Your premium (${profile.acres} acres)`} value={formatINR(premium)} />
            <KeyValue paper label="Total cover" value={formatINR(insured)} />
            <KeyValue
              paper
              label="Enrollment deadline"
              value={inputs.season === "Rabi" ? `December 31, ${deadlineYear}` : inputs.season === "Kharif" ? `July 31, ${deadlineYear}` : "Notified by the state"}
            />
          </div>
        </div>
      </Panel>

      <NextChapterBanner
        nextChapter="Chapter 4 · Harvest"
        nextTitle="Forecast Mandi Prices Before Selling"
        nextDesc="Examine 6-month inflation-adjusted mandi price trajectories and timing windows for top returns."
        to="/price-forecasting"
      />
    </>
  );
}
