import { useState, useEffect } from "react";
import { CheckCircle2, Save, Sparkles, User, ShieldCheck, ArrowRight, Award, LogOut } from "lucide-react";
import { AppLink } from "@/components/ui/app-link";
import { Button } from "@/components/ui/button";
import { Chip, Field, Select, Switch, TextInput } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { Meter, Notice, PageHeader, Panel, Section, pill } from "@/src/app/kit";
import { SOIL_TYPES } from "@/src/data/crops";
import { DISTRICTS } from "@/src/data/places";
import { type SoilCard } from "@/src/lib/models";
import { profileCompletion, useProfile, type Profile as ProfileData } from "@/src/lib/sagri";
import { useAuth } from "../app/AuthProvider";

const CROP_OPTIONS = ["Wheat", "Rice", "Soybean", "Chickpea", "Mustard", "Cotton", "Maize", "Sugarcane", "Tomato", "Onion"];
const SOIL_FIELDS: { key: keyof SoilCard; label: string; step: number }[] = [
  { key: "n", label: "N (kg/ha)", step: 1 },
  { key: "p", label: "P (kg/ha)", step: 0.5 },
  { key: "k", label: "K (kg/ha)", step: 1 },
  { key: "oc", label: "OC (%)", step: 0.01 },
  { key: "ph", label: "pH", step: 0.1 },
];

export default function Profile() {
  const [saved, setSaved] = useProfile();
  const { user, openModal, quickLoginAsFarmer, quickLoginAsAdmin, logout, updatePoints } = useAuth();
  const [draft, setDraft] = useState<ProfileData>(saved);
  const [soil, setSoil] = useState<Record<keyof SoilCard, string>>(() => {
    const s = saved.soil;
    return { n: s ? String(s.n) : "", p: s ? String(s.p) : "", k: s ? String(s.k) : "", oc: s ? String(s.oc) : "", ph: s ? String(s.ph) : "" };
  });
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const completion = profileCompletion(saved);

  useEffect(() => {
    if (user) {
      const cleanName = user.name.replace(/\s*\(.*?\)/, "").trim();
      const districtId = user.district ? user.district.toLowerCase() : saved.district;
      setDraft((prev) => ({
        ...prev,
        name: cleanName || prev.name,
        phone: user.phone || prev.phone,
        district: districtId,
        village: user.village || prev.village,
      }));
    }
  }, [user]);
  const set = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setStatus("idle");
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const filled = Object.values(soil).filter((v) => v.trim() !== "");
    if (filled.length > 0 && filled.length < 5) return setStatus("error");
    if (draft.phone && !/^[6-9]\d{9}$/.test(draft.phone.replace(/\D/g, "").slice(-10))) return setStatus("error");
    const card = filled.length === 5 ? (Object.fromEntries(Object.entries(soil).map(([k, v]) => [k, Number(v)])) as SoilCard) : null;
    setSaved({ ...draft, name: draft.name.trim() || "Farmer", soil: card });
    updatePoints(10); // Reward farmer with 10 points for updating profile
    setStatus("saved");
  };

  return (
    <>
      <PageHeader eyebrow="Farm Profile" title="Your farm, in one place." subtitle="Every SAGRI recommendation uses these details. They stay synced to your account." />

      {/* Account Identity & Switching Banner */}
      <div className="mt-8 rounded-3xl border border-wheat/30 bg-gradient-to-r from-card via-card/85 to-wheat/10 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-wheat/20 text-wheat border border-wheat/30 font-serif text-2xl font-bold shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "RK"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Heading as="h3" family="serif" size="title" className="text-2xl text-foreground">
                  {user ? user.name : "Guest Farmer"}
                </Heading>
                {user?.role === "admin" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-leaf/20 px-2.5 py-0.5 text-xs font-semibold text-leaf">
                    🌾 Verified Farmer
                  </span>
                )}
              </div>
              <Text size="xs" tone="muted" className="mt-1">
                {user ? `${user.email} · ${user.district}, ${user.state}` : "Local Browser Session"}
              </Text>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-wheat/30 bg-wheat/10 px-4 py-2 text-sm font-semibold text-wheat">
              <Sparkles className="h-4 w-4" />
              <span>{user?.points ?? 250} Krishi Points</span>
            </div>
            {user?.role === "farmer" ? (
              <Button variant="outline" size="default" className="rounded-full text-xs" onClick={quickLoginAsAdmin}>
                Switch to Admin
              </Button>
            ) : (
              <Button variant="outline" size="default" className="rounded-full text-xs" onClick={quickLoginAsFarmer}>
                Switch to Farmer
              </Button>
            )}
            <Button variant="outline" size="default" className="rounded-full text-xs" onClick={openModal}>
              Switch Account
            </Button>
            {user && (
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" onClick={logout} title="Sign Out">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-md">
        <div className="flex items-baseline justify-between">
          <Text size="sm" tone="muted">
            Profile completion
          </Text>
          <Text size="none" className="font-serif text-3xl">{completion.pct}%</Text>
        </div>
        <div className="mt-2">
          <Meter value={completion.pct} label="Profile completion" />
        </div>
      </div>

      <form onSubmit={save} className="mt-4" noValidate>
        <Section title="Farmer">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Full name" htmlFor="name">
              <TextInput id="name" value={draft.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Mobile number" htmlFor="phone" hint="Buyers and experts use this to reach you">
              <TextInput id="phone" type="tel" value={draft.phone} onChange={(e) => set("phone", e.target.value)} placeholder="98XXXXXXXX" autoComplete="tel" />
            </Field>
            <Field label="Village" htmlFor="village">
              <TextInput id="village" value={draft.village} onChange={(e) => set("village", e.target.value)} />
            </Field>
            <Field label="District" htmlFor="pdistrict">
              <Select id="pdistrict" value={draft.district} onChange={(e) => set("district", e.target.value)} options={DISTRICTS.map((d) => ({ value: d.id, label: `${d.name}, ${d.state}` }))} />
            </Field>
          </div>
        </Section>

        <Section title="Land and crops">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Cultivated land (acres)" htmlFor="pacres">
              <TextInput id="pacres" type="number" min={0.1} step={0.1} value={draft.acres} onChange={(e) => set("acres", Number(e.target.value))} />
            </Field>
            <Field label="Soil type" htmlFor="psoil">
              <Select id="psoil" value={draft.soilType} onChange={(e) => set("soilType", e.target.value)} options={SOIL_TYPES} />
            </Field>
            <div className="flex items-end pb-2">
              <Switch checked={draft.irrigation} onCheckedChange={(v) => set("irrigation", v)} label="Irrigation available" />
            </div>
          </div>
          <Text size="sm" tone="muted" className="mt-8">
            Crops you grow
          </Text>
          <div className="mt-3 flex flex-wrap gap-2">
            {CROP_OPTIONS.map((c) => (
              <Chip
                key={c}
                active={draft.crops.includes(c)}
                onClick={() => set("crops", draft.crops.includes(c) ? draft.crops.filter((x) => x !== c) : [...draft.crops, c])}
              >
                {c}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title="Soil Health Card" description="Enter all five values from your latest card, or leave them blank.">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
            {SOIL_FIELDS.map((f) => (
              <Field key={f.key} label={f.label} htmlFor={`p-${f.key}`}>
                <TextInput
                  id={`p-${f.key}`}
                  type="number"
                  min={0}
                  step={f.step}
                  value={soil[f.key]}
                  onChange={(e) => {
                    setSoil((s) => ({ ...s, [f.key]: e.target.value }));
                    setStatus("idle");
                  }}
                />
              </Field>
            ))}
          </div>
        </Section>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Button type="submit" variant="outline" className={pill}>
            <Save className="h-4 w-4" />
            Save profile
          </Button>
          {status === "saved" && (
            <span className="flex items-center gap-2 text-sm text-leaf" role="status">
              <CheckCircle2 className="h-4 w-4" />
              Saved. (+10 Krishi Points earned) <AppLink to="/dashboard">Back to dashboard</AppLink>
            </span>
          )}
        </div>
        {status === "error" && (
          <div className="mt-6 max-w-xl">
            <Notice tone="warn">Check your details: the mobile number needs 10 digits, and the soil card needs all five values or none.</Notice>
          </div>
        )}
      </form>

      {/* Rewards Milestones Grid */}
      <div className="mt-16">
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-5 w-5 text-wheat" />
          <Heading as="h3" family="serif" size="subtitle">
            Krishi Rewards & Milestones
          </Heading>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-wheat/30 bg-card p-4">
            <div className="text-xs font-mono text-wheat">+50 Points</div>
            <div className="text-sm font-semibold text-foreground mt-1">Complete Soil Card</div>
            <div className="text-xs text-muted-foreground mt-1">Fill all 5 NPK & pH soil metrics</div>
          </div>
          <div className="rounded-2xl border border-leaf/30 bg-card p-4">
            <div className="text-xs font-mono text-leaf">+10 Points</div>
            <div className="text-sm font-semibold text-foreground mt-1">Leaf Disease Scan</div>
            <div className="text-xs text-muted-foreground mt-1">Run AI diagnosis on any crop leaf</div>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-card p-4">
            <div className="text-xs font-mono text-primary">+5 Points</div>
            <div className="text-sm font-semibold text-foreground mt-1">Check Mandi Rates</div>
            <div className="text-xs text-muted-foreground mt-1">Compare nearby APMC market prices</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground">+15 Points</div>
            <div className="text-sm font-semibold text-foreground mt-1">Community Discussion</div>
            <div className="text-xs text-muted-foreground mt-1">Post advice or question in forum</div>
          </div>
        </div>
      </div>

      <Panel className="mt-16 max-w-xl">
        <Text size="sm" tone="muted">
          Privacy
        </Text>
        <Text size="sm" className="mt-2">
          Your profile is stored securely on this device. Clearing your browser data resets it.
        </Text>
      </Panel>
    </>
  );
}
