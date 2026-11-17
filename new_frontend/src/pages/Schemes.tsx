import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { ArrowUpRight, FileText } from "lucide-react";
import { AppLink, ExternalButton } from "@/components/ui/app-link";
import { Checkbox } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { PageHeader, Panel, Reveal, Section, Tag } from "@/src/app/kit";
import { SCHEMES } from "@/src/data/catalog";
import { cn } from "@/lib/cn";

type Facts = { land: boolean; aadhaar: boolean; bank: boolean; notTaxpayer: boolean };

export default function Schemes() {
  const [params] = useSearchParams();
  const focus = params.get("scheme");
  const [facts, setFacts] = useState<Facts>({ land: true, aadhaar: true, bank: true, notTaxpayer: true });
  const eligibility = useMemo(
    () => Object.fromEntries(SCHEMES.map((s) => [s.id, s.needs.every((n) => facts[n])])),
    [facts],
  );
  const eligibleCount = Object.values(eligibility).filter(Boolean).length;

  useEffect(() => {
    if (!focus) return;
    window.setTimeout(() => document.getElementById(focus)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, [focus]);

  return (
    <>
      <PageHeader
        eyebrow="Government Schemes"
        title="Government Schemes & Farmer Subsidies"
        subtitle="Direct financial aid, central subsidies, and insurance programs for Indian farmers"
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Panel>
            <Heading as="h2" family="serif" size="subtitle">
              Check your eligibility
            </Heading>
            <div className="mt-4">
              <Checkbox checked={facts.land} onCheckedChange={(v) => setFacts((f) => ({ ...f, land: v }))} label="I own or cultivate farmland in my name" />
              <Checkbox checked={facts.aadhaar} onCheckedChange={(v) => setFacts((f) => ({ ...f, aadhaar: v }))} label="I have an Aadhaar card" />
              <Checkbox checked={facts.bank} onCheckedChange={(v) => setFacts((f) => ({ ...f, bank: v }))} label="My bank account is linked to Aadhaar" />
              <Checkbox checked={facts.notTaxpayer} onCheckedChange={(v) => setFacts((f) => ({ ...f, notTaxpayer: v }))} label="Nobody in my family pays income tax" />
            </div>
            <Text size="none" className="mt-6 border-t border-border pt-4 font-serif text-2xl">
              You may qualify for {eligibleCount} of {SCHEMES.length} schemes.
            </Text>
          </Panel>
        </aside>

        <div className="space-y-6 lg:col-span-2">
          {SCHEMES.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i, 4) * 0.04}>
              <Panel className={cn("scroll-mt-24", focus === s.id && "border-wheat/60")}>
                <div id={s.id} className="scroll-mt-24" />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Heading as="h3" family="serif" size="subtitle">
                      {s.name}
                    </Heading>
                    <Text size="sm" tone="muted">
                      {s.full}
                    </Text>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Tag tone={eligibility[s.id] ? "good" : "neutral"}>{eligibility[s.id] ? "You qualify" : "Check criteria"}</Tag>
                    <Tag>{s.status}</Tag>
                  </div>
                </div>
                <Text size="none" className="mt-6 text-lg">{s.benefit}</Text>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <Text size="sm" tone="muted">
                      Who qualifies
                    </Text>
                    <Text size="sm" className="mt-1">
                      {s.eligibility}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" tone="muted">
                      Documents
                    </Text>
                    <ul className="mt-1 space-y-1 text-sm">
                      {s.documents.map((d) => (
                        <li key={d} className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-wheat" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <ExternalButton href={s.url} className="mt-6">
                  Apply on Official Portal
                  <ArrowUpRight className="h-4 w-4" />
                </ExternalButton>
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>

      <Section title="Need working capital?" description="A Kisan Credit Card gives crop loans at 4% effective interest.">
        <AppLink to="/loans">Check your KCC limit</AppLink>
      </Section>
    </>
  );
}
