import { useMemo, useState } from "react";
import { CheckCircle2, Phone, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, Tabs, TextArea, TextInput } from "@/components/ui/form";
import { Heading, NavAnchor, Text } from "@/components/ui/primitives";
import { EmptyState, KeyValue, Notice, PageHeader, Panel, Reveal, Tag, pill } from "@/src/app/kit";
import { MSP } from "@/src/data/market";
import { formatDate, formatINR } from "@/src/lib/format";
import { uid } from "@/src/lib/store";
import { useListings, useProfile } from "@/src/lib/sagri";
import { useAuth } from "../app/AuthProvider";

const GRADES = [
  { value: "Premium A-Grade", factor: 1.05 },
  { value: "Standard B-Grade", factor: 1 },
  { value: "Basic C-Grade", factor: 0.92 },
];

type Tab = "new" | "mine";

export default function SellProduce() {
  const [profile] = useProfile();
  const { user } = useAuth();
  const [listings, setListings] = useListings();
  const [tab, setTab] = useState<Tab>("new");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    crop: "Wheat",
    grade: GRADES[0].value,
    quantity: "",
    price: "",
    village: user?.village || profile.village,
    pickup: "",
    phone: user?.phone || profile.phone,
    harvestDate: "",
    notes: "",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const benchmark = useMemo(() => {
    const factor = GRADES.find((g) => g.value === form.grade)?.factor ?? 1;
    return Math.round(MSP[form.crop] * factor);
  }, [form.crop, form.grade]);

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = Number(form.quantity);
    const price = Number(form.price);
    if (!(quantity > 0)) return setError("Enter how many quintals you want to sell.");
    if (!(price > 0)) return setError("Enter your asking price per quintal.");
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, "").slice(-10))) return setError("Enter a valid 10-digit mobile number.");
    setError(null);
    setListings((all) => [
      {
        id: uid(),
        crop: form.crop,
        grade: form.grade,
        quantity,
        price,
        village: form.village,
        pickup: form.pickup || form.village,
        phone: form.phone.replace(/\D/g, "").slice(-10),
        harvestDate: form.harvestDate,
        notes: form.notes,
        at: new Date().toISOString(),
        inquiries: [],
      },
      ...all,
    ]);
    setPublished(true);
    setForm((f) => ({ ...f, quantity: "", price: "", notes: "" }));
    setTab("mine");
  };

  return (
    <>
      <PageHeader
        eyebrow="Sell Crops & Produce"
        title="Sell Your Harvest Direct (MSP+)"
        subtitle="Connect with flour mills, exporters, and wholesale traders without middlemen"
      />

      <div className="mt-10">
        <Tabs<Tab>
          value={tab}
          onChange={(t) => {
            setTab(t);
            setPublished(false);
          }}
          tabs={[
            { value: "new", label: "List New Produce" },
            { value: "mine", label: `My Active Listings (${listings.length})` },
          ]}
        />
      </div>

      {tab === "new" ? (
        <form onSubmit={publish} className="mt-10 grid gap-12 lg:grid-cols-3" noValidate>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            <Field label="Crop type" htmlFor="crop">
              <Select id="crop" value={form.crop} onChange={(e) => set("crop", e.target.value)} options={Object.keys(MSP)} />
            </Field>
            <Field label="Quality grade" htmlFor="grade">
              <Select id="grade" value={form.grade} onChange={(e) => set("grade", e.target.value)} options={GRADES.map((g) => g.value)} />
            </Field>
            <Field label="Quantity available (quintals)" htmlFor="qty">
              <TextInput id="qty" type="number" min={1} inputMode="decimal" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="40" />
            </Field>
            <Field label="Asking price per quintal (₹)" htmlFor="price" hint={`Benchmark: ${formatINR(benchmark)}`}>
              <TextInput id="price" type="number" min={1} inputMode="numeric" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder={String(benchmark)} />
            </Field>
            <Field label="Village" htmlFor="village">
              <TextInput id="village" value={form.village} onChange={(e) => set("village", e.target.value)} />
            </Field>
            <Field label="Farm pickup location" htmlFor="pickup">
              <TextInput id="pickup" value={form.pickup} onChange={(e) => set("pickup", e.target.value)} placeholder="Farm gate or nearest road" />
            </Field>
            <Field label="Contact phone number" htmlFor="phone">
              <TextInput id="phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98XXXXXXXX" />
            </Field>
            <Field label="Expected ready / harvest date" htmlFor="hdate">
              <TextInput id="hdate" type="date" value={form.harvestDate} onChange={(e) => set("harvestDate", e.target.value)} />
            </Field>
            <Field label="Notes for buyers" htmlFor="notes" className="sm:col-span-2">
              <TextArea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Variety, moisture, bagging, anything a buyer should know" />
            </Field>
            {error && (
              <div className="sm:col-span-2">
                <Notice tone="warn">{error}</Notice>
              </div>
            )}
            <div className="sm:col-span-2">
              <Button type="submit" variant="outline" className={pill}>
                <Send className="h-4 w-4" />
                Publish Crop Listing
              </Button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Panel tone="highlight">
              <Text size="sm" tone="muted">
                Government recommended benchmark price · {form.crop}
              </Text>
              <Text size="none" as="div" className="mt-2 font-serif text-5xl leading-none">
                {formatINR(benchmark)}
              </Text>
              <Text size="sm" tone="muted" className="mt-2">
                per quintal, based on {form.crop === "Sugarcane" ? "FRP" : "MSP"} adjusted for {form.grade}
              </Text>
              {Number(form.price) > 0 && (
                <Text size="sm" className="mt-6 border-t border-border pt-4">
                  Your price is{" "}
                  <span className={Number(form.price) >= benchmark ? "text-leaf" : "text-alert"}>
                    {Math.abs(((Number(form.price) - benchmark) / benchmark) * 100).toFixed(1)}%{" "}
                    {Number(form.price) >= benchmark ? "above" : "below"}
                  </span>{" "}
                  the benchmark.
                  {Number(form.quantity) > 0 && <> Total value: {formatINR(Number(form.price) * Number(form.quantity))}.</>}
                </Text>
              )}
            </Panel>
          </aside>
        </form>
      ) : (
        <div className="mt-10 space-y-6">
          {published && (
            <Reveal>
              <div className="flex items-center gap-3 rounded-xl border border-leaf/40 bg-leaf/10 px-4 py-3 text-sm text-leaf" role="status">
                <CheckCircle2 className="h-4 w-4" />
                Your listing is live. Buyers near you will see it and contact you directly.
              </div>
            </Reveal>
          )}
          {listings.length === 0 && (
            <EmptyState
              title="No active listings"
              body="Create a listing to start receiving offers from buyers."
              action={
                <Button variant="outline" className={pill} onClick={() => setTab("new")}>
                  New listing
                </Button>
              }
            />
          )}
          {listings.map((l) => (
            <Panel key={l.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Heading as="h3" family="serif" size="subtitle">
                    {l.quantity} quintals of {l.crop.toLowerCase()}
                  </Heading>
                  <Text size="sm" tone="muted" className="mt-1">
                    {l.grade} · listed {formatDate(l.at)}
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  <Text size="none" as="div" className="font-serif text-3xl">
                    {formatINR(l.price)}
                    <span className="text-sm text-muted-foreground"> /q</span>
                  </Text>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="Remove listing" onClick={() => setListings((all) => all.filter((x) => x.id !== l.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-6 grid gap-x-10 md:grid-cols-2">
                <div>
                  <KeyValue label="Pickup" value={l.pickup} />
                  <KeyValue label="Harvest date" value={l.harvestDate ? formatDate(l.harvestDate) : "Not set"} />
                  <KeyValue label="Contact" value={l.phone} />
                </div>
                <div className="mt-6 md:mt-0">
                  <Text size="sm" tone="muted" className="flex items-center gap-2">
                    Buyer inquiries <Tag tone={l.inquiries.length ? "accent" : "neutral"}>{l.inquiries.length}</Tag>
                  </Text>
                  {l.inquiries.length === 0 ? (
                    <Text size="sm" tone="muted" className="mt-3">
                      No offers yet. Buyers usually respond within 24 hours.
                    </Text>
                  ) : (
                    <ul className="mt-2">
                      {l.inquiries.map((q) => (
                        <li key={q.buyer} className="flex items-center justify-between gap-4 border-b border-border py-3 text-sm last:border-b-0">
                          <span>
                            {q.buyer}
                            <span className="ml-2 font-mono tabular-nums text-muted-foreground">offers {formatINR(q.offer)}</span>
                          </span>
                          <NavAnchor href={`tel:+91${q.phone}`} tone="accent">
                            <Phone className="h-3.5 w-3.5" />
                            Call
                          </NavAnchor>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
