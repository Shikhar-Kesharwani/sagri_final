import { useState } from "react";
import { FlaskConical, Save } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/form";
import { Text } from "@/components/ui/primitives";
import { CHART, Meter, NextChapterBanner, Notice, PageHeader, Panel, Reveal, Section, Tag, pill, statusTone } from "@/src/app/kit";
import { Dialog } from "@/components/ui/dialog";
import { REGIONAL_SOIL, soilScores, type SoilCard } from "@/src/lib/models";
import { useHistory, useProfile } from "@/src/lib/sagri";

const FIELDS: { key: keyof SoilCard; label: string; step: number }[] = [
  { key: "n", label: "Nitrogen (kg/ha)", step: 1 },
  { key: "p", label: "Phosphorus (kg/ha)", step: 0.5 },
  { key: "k", label: "Potassium (kg/ha)", step: 1 },
  { key: "oc", label: "Organic carbon (%)", step: 0.01 },
  { key: "ph", label: "pH", step: 0.1 },
];

export default function SoilHealth() {
  const [profile, setProfile] = useProfile();
  const { add } = useHistory();
  const card = profile.soil ?? REGIONAL_SOIL;
  const report = soilScores(card);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SoilCard>(card);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((p) => ({ ...p, soil: draft }));
    const r = soilScores(draft);
    const lowest = [...r.nutrients].sort((a, b) => a.score - b.score)[0];
    add({
      type: "Soil",
      title: "Soil Health Report",
      result: `${r.overall} / 100`,
      details: [
        ["Lowest", lowest.label],
        ["Action", r.plan[0].detail],
      ],
    });
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        eyebrow="Soil Health & NPK"
        title="Soil Health & Nutrient Analysis"
        subtitle="Comprehensive analysis, N-P-K balances, and organic carbon recommendations"
        actions={
          <Button
            variant="outline"
            className={pill}
            onClick={() => {
              setDraft(card);
              setOpen(true);
            }}
          >
            <FlaskConical className="h-4 w-4" />
            {profile.soil ? "Update soil card values" : "Enter my soil card"}
          </Button>
        }
      />

      {!profile.soil && (
        <div className="mt-8">
          <Notice>These are regional averages for your district. Enter your Soil Health Card values for a report on your own field.</Notice>
        </div>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <Text size="sm" tone="muted">
            Overall soil health
          </Text>
          <Text size="none" as="div" className="mt-2 font-serif text-8xl leading-none">
            {report.overall}
            <span className="text-3xl text-muted-foreground"> / 100</span>
          </Text>
          <Tag tone={report.overall >= 75 ? "good" : report.overall >= 60 ? "accent" : "bad"} className="mt-4">
            {report.overall >= 70 ? "Good Condition" : report.overall >= 50 ? "Fair Condition" : "Poor Condition"}
          </Tag>
          <div className="mt-8 h-72" role="img" aria-label="Nutrient radar chart">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={report.nutrients.map((n) => ({ label: n.label.split(" (")[0], score: n.score, ideal: n.ideal }))} outerRadius="75%">
                <PolarGrid stroke={CHART.grid} />
                <PolarAngleAxis dataKey="label" tick={{ fill: CHART.muted, fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="ideal" stroke={CHART.muted} strokeDasharray="4 4" fill="none" />
                <Radar dataKey="score" stroke={CHART.wheat} fill={CHART.wheat} fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        <div className="lg:col-span-3">
          <ul>
            {report.nutrients.map((n) => (
              <li key={n.key} className="border-b border-border py-5">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <Text>{n.label}</Text>
                  <span className="flex items-center gap-3 text-sm">
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {n.score}% (Ideal: {n.ideal}%) · {n.value}
                      {n.unit && ` ${n.unit}`}
                    </span>
                    <Tag tone={statusTone(n.status)}>{n.status}</Tag>
                  </span>
                </div>
                <Meter value={n.score} tone={n.status === "Optimal" ? "good" : n.status === "Moderate" ? "accent" : "bad"} label={n.label} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Section title="Fertilizer action plan" description="Doses are per acre for this season, ordered by the nutrient gaps in your report.">
        <div className="grid gap-4 md:grid-cols-2">
          {report.plan.map((step, i) => (
            <Panel key={step.title}>
              <div className="flex items-center justify-between gap-3">
                <Text size="xs" tone="accent" mono>
                  Item {i + 1}
                </Text>
                <Tag tone={step.priority === "High" ? "bad" : step.priority === "Medium" ? "accent" : "neutral"}>Priority: {step.priority}</Tag>
              </div>
              <Text size="none" className="mt-2 font-serif text-2xl">{step.title}</Text>
              <Text size="sm" tone="muted" className="mt-2">
                {step.detail}
              </Text>
            </Panel>
          ))}
        </div>
      </Section>

      <NextChapterBanner
        nextChapter="Chapter 2 · Monsoon"
        nextTitle="Recommend Optimal Crops for this Soil"
        nextDesc="Use your verified NPK and pH values to simulate highest yielding Kharif and Rabi crops."
        to="/crop-recommendation"
      />

      <Dialog open={open} onClose={() => setOpen(false)} title="Soil Health Card values">
        <form onSubmit={save} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <Field key={f.key} label={f.label} htmlFor={`soil-${f.key}`}>
                <TextInput
                  id={`soil-${f.key}`}
                  type="number"
                  min={0}
                  step={f.step}
                  required
                  value={draft[f.key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: Number(e.target.value) }))}
                />
              </Field>
            ))}
          </div>
          <Text size="xs" tone="muted">
            You'll find these on the card from your district soil testing lab, or at soilhealth.dac.gov.in.
          </Text>
          <Button type="submit" variant="outline" className={pill}>
            <Save className="h-4 w-4" />
            Save to my profile
          </Button>
        </form>
      </Dialog>
    </>
  );
}
