import { ArrowRight, Play } from "lucide-react";
import { AppLink, LinkButton, PlainLink } from "@/components/ui/app-link";
import { ActionLink, Heading, NavAnchor, Text } from "@/components/ui/primitives";
import { Reveal } from "@/src/app/kit";
import { NAV_ITEMS } from "@/src/data/nav";

const FEATURES = [
  { to: "/crop-recommendation", title: "Crop Recommendation", body: "The three best crops for your soil, season and rainfall, ranked from 22." },
  { to: "/disease-detection", title: "Plant Disease Vision", body: "Photograph a leaf to get a diagnosis and a prescription in under three seconds." },
  { to: "/price-forecasting", title: "Mandi Price Forecaster", body: "Six months of projected prices, so you know whether to hold or sell." },
  { to: "/risk-prediction", title: "Crop Risk Radar", body: "The chance of crop failure, broken down by drought, heat, soil and pests." },
];

const MODELS = [
  { name: "Crop recommendation", detail: "22 crops · N-P-K, pH, temperature, humidity, rainfall" },
  { name: "Leaf disease classifier", detail: "38 disease classes across 14 crops" },
  { name: "Mandi price forecaster", detail: "Monthly outlook with confidence ranges" },
  { name: "Crop failure risk", detail: "Weighted drought, thermal, nutrient and pest factors" },
];

const STATS = [
  { value: "22", label: "crops modelled" },
  { value: "38", label: "leaf diseases recognised" },
  { value: "17", label: "farm tools in one place" },
  { value: "4", label: "Indian languages in Krishi Sahayak" },
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6">
        <PlainLink to="/landing" className="font-serif text-2xl">
          Sagri
        </PlainLink>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <ActionLink tone="muted" onClick={() => scrollTo("features")}>
            Features
          </ActionLink>
          <ActionLink tone="muted" onClick={() => scrollTo("models")}>
            AI models
          </ActionLink>
          <AppLink to="/market-price" tone="muted">
            Mandi rates
          </AppLink>
          <AppLink to="/schemes" tone="muted">
            Schemes
          </AppLink>
          <ActionLink tone="muted" onClick={() => scrollTo("about")}>
            About us
          </ActionLink>
        </nav>
        <LinkButton to="/profile">Farmer login / register</LinkButton>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
          <Reveal>
            <Text size="sm" tone="accent" mono>
              SAGRI · Smart Agriculture Intelligence
            </Text>
            <Heading as="h1" family="serif" size="display" className="mt-6 max-w-4xl">
              Decide what to sow, when to spray and where to sell.
            </Heading>
            <Text size="lg" tone="muted" className="mt-8 max-w-xl">
              AI crop planning, disease diagnosis, mandi forecasts and government schemes, built for Indian farms and
              available in your language.
            </Text>
            <div className="mt-10 flex flex-wrap gap-3">
              <LinkButton to="/dashboard">
                Explore the live platform
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <NavAnchor
                href="/"
                tone="default"
                className="h-11 rounded-full border border-border px-6 font-medium hover:bg-secondary"
              >
                <Play className="h-4 w-4" />
                Watch the season story
              </NavAnchor>
            </div>
          </Reveal>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-16">
          <Heading as="h2" family="serif" size="title">
            Four models, one field.
          </Heading>
          <div className="mt-10 grid border-t border-border sm:grid-cols-2">
            {FEATURES.map((f) => (
              <PlainLink key={f.to} to={f.to} className="group border-b border-border py-10 sm:px-6 sm:odd:pl-0">
                <Text size="none" className="font-serif text-3xl">{f.title}</Text>
                <Text tone="muted" className="mt-3 max-w-sm">
                  {f.body}
                </Text>
                <Text as="span" size="sm" tone="accent" className="mt-6 inline-flex items-center gap-2">
                  Open {f.title}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Text>
              </PlainLink>
            ))}
          </div>
        </section>

        <section className="bg-paper text-ink">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <Text size="none" as="div" tone="ink" className="font-serif text-7xl leading-none">
                  {s.value}
                </Text>
                <Text tone="inkMuted" className="mt-3">
                  {s.label}
                </Text>
              </div>
            ))}
          </div>
        </section>

        <section id="models" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-3">
            <Heading as="h2" family="serif" size="title">
              The models behind it.
            </Heading>
            <ul className="border-t border-border lg:col-span-2">
              {MODELS.map((m) => (
                <li key={m.name} className="flex flex-col gap-1 border-b border-border py-6 sm:flex-row sm:items-baseline sm:justify-between">
                  <Text size="none" className="text-lg">{m.name}</Text>
                  <Text size="sm" tone="muted">
                    {m.detail}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl scroll-mt-8 border-t border-border px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-3">
            <Heading as="h2" family="serif" size="title">
              About SAGRI.
            </Heading>
            <div className="lg:col-span-2">
              <Text size="lg" tone="muted" className="max-w-2xl">
                SAGRI brings soil, weather, market and policy data together, so a small farmer can make the same
                decisions a large agribusiness can, from the same phone they already own.
              </Text>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                {NAV_ITEMS.slice(1, 9).map((n) => (
                  <AppLink key={n.to} to={n.to} tone="muted">
                    {n.label}
                  </AppLink>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 border-t border-border px-6 py-8 text-sm text-muted-foreground">
        <span>SAGRI · Smart Agriculture Intelligence</span>
        <span>Kisan Call Centre 1800-180-1551</span>
      </footer>
    </div>
  );
}
