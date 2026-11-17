import { useState } from "react";
import { Calculator, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Select, TextInput } from "@/components/ui/form";
import { Heading, NavAnchor, Text } from "@/components/ui/primitives";
import { KeyValue, Meter, PageHeader, Panel, Reveal, Section, Stat, pill } from "@/src/app/kit";
import { formatINR } from "@/src/lib/format";
import { SCALE_OF_FINANCE, kccLimit } from "@/src/lib/models";
import { useProfile } from "@/src/lib/sagri";

const DOCUMENTS = [
  "Land ownership record (Khata/Khasra)",
  "Aadhaar & Identity proof",
  "6-month bank statement",
  "Two passport-size photographs",
  "Crop sowing details for this season",
];

export default function Loans() {
  const [profile] = useProfile();
  const [acres, setAcres] = useState(String(profile.acres));
  const [crop, setCrop] = useState(profile.crops.find((c) => c in SCALE_OF_FINANCE) ?? "Wheat");
  const [result, setResult] = useState<ReturnType<typeof kccLimit> | null>(null);
  const [docs, setDocs] = useState<Record<string, boolean>>(() => Object.fromEntries(DOCUMENTS.slice(0, 3).map((d) => [d, true])));
  const ready = DOCUMENTS.filter((d) => docs[d]).length;

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const a = Number(acres);
    if (a > 0) setResult(kccLimit(crop, a));
  };

  const concessional = result ? Math.min(result.total, 300000) : 0;

  return (
    <>
      <PageHeader
        eyebrow="Check Kisan Loans"
        title="Agricultural Credit & KCC Limit Checker"
        subtitle="Calculate eligible loan limits, subvented interest, and required documentation"
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Stat label="Maximum credit" value="Up to ₹3 Lakhs" note="At the concessional, subvented rate" />
        <Stat label="Interest rate" value="4% per annum" note="With prompt repayment subsidy (7% base rate)" tone="accent" />
        <Stat label="Tenure" value="Up to 5 years" note="Renewed annually against your crop plan" />
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <form onSubmit={calculate} className="space-y-6">
          <Heading as="h2" family="serif" size="subtitle">
            Credit limit calculator
          </Heading>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Total cultivated land (in acres)" htmlFor="acres">
              <TextInput id="acres" type="number" min={0.1} step={0.1} required value={acres} onChange={(e) => setAcres(e.target.value)} />
            </Field>
            <Field label="Main crop grown" htmlFor="kcrop">
              <Select id="kcrop" value={crop} onChange={(e) => setCrop(e.target.value)} options={Object.keys(SCALE_OF_FINANCE)} />
            </Field>
          </div>
          <Button type="submit" variant="outline" className={pill}>
            <Calculator className="h-4 w-4" />
            Calculate Credit Limit
          </Button>
          <Text size="xs" tone="muted">
            Uses indicative district scale-of-finance figures. Your bank applies the official figure for your district.
          </Text>
        </form>

        <div aria-live="polite">
          {result ? (
            <Reveal key={`${crop}-${acres}`}>
              <Panel tone="highlight">
                <Text size="sm" tone="muted">
                  Eligible KCC Limit
                </Text>
                <Text size="none" as="div" className="mt-2 font-serif text-6xl leading-none">
                  {formatINR(result.total)}
                </Text>
                <Text className="mt-3">at 4% annual interest{result.total > 300000 && " on the first ₹3,00,000"}</Text>
                <div className="mt-8">
                  <KeyValue label={`Crop cost (${formatINR(result.sof)}/acre)`} value={formatINR(result.cultivation)} />
                  <KeyValue label="Post-harvest and household (10%)" value={formatINR(result.postHarvest)} />
                  <KeyValue label="Farm asset maintenance (20%)" value={formatINR(result.maintenance)} />
                  <KeyValue label="At 4% effective interest" value={formatINR(concessional)} />
                  {result.total > 300000 && <KeyValue label="At the bank's normal rate" value={formatINR(result.total - 300000)} />}
                </div>
              </Panel>
            </Reveal>
          ) : (
            <Panel>
              <Text size="none" className="font-serif text-3xl">Your limit appears here.</Text>
              <Text tone="muted" className="mt-3">
                Your KCC limit is the crop's scale of finance times your acreage, plus 10% for post-harvest needs and 20%
                for maintaining farm assets.
              </Text>
            </Panel>
          )}
        </div>
      </div>

      <Section title="Documents checklist" description={`${ready} of ${DOCUMENTS.length} ready. Take these to any bank branch or cooperative society.`}>
        <div className="max-w-xl">
          <Meter value={(ready / DOCUMENTS.length) * 100} tone="good" label="Documents ready" />
          <div className="mt-4">
            {DOCUMENTS.map((d) => (
              <Checkbox key={d} checked={Boolean(docs[d])} onCheckedChange={(v) => setDocs((all) => ({ ...all, [d]: v }))} label={d} />
            ))}
          </div>
          <NavAnchor href="tel:18001801551" tone="accent" className="mt-6">
            <Phone className="h-4 w-4" />
            Questions? Call the Kisan Call Centre on 1800-180-1551
          </NavAnchor>
        </div>
      </Section>
    </>
  );
}
