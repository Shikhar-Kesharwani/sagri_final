import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Search } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/form";
import { RowButton, Text } from "@/components/ui/primitives";
import { CROPS } from "@/src/data/crops";
import { DIAGNOSES } from "@/src/data/diseases";
import { COMMODITIES } from "@/src/data/market";
import { SCHEMES } from "@/src/data/catalog";
import { NAV_ITEMS, PROFILE_NAV } from "@/src/data/nav";
import { cn } from "@/lib/cn";

type Entry = { label: string; kind: string; to: string };

const INDEX: Entry[] = [
  ...[...NAV_ITEMS, PROFILE_NAV].map((n) => ({ label: n.label, kind: n.blurb, to: n.to })),
  ...COMMODITIES.map((c) => ({ label: `${c.name} mandi rate`, kind: "Mandi forecast", to: `/price-forecasting?commodity=${c.id}` })),
  ...DIAGNOSES.map((d) => ({ label: `${d.crop} ${d.disease}`, kind: "Leaf disease", to: `/disease-detection?sample=${d.id}` })),
  ...SCHEMES.map((s) => ({ label: s.name, kind: s.full, to: `/schemes?scheme=${s.id}` })),
  ...CROPS.map((c) => ({ label: c.name, kind: "Crop suitability", to: "/crop-recommendation" })),
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? INDEX.filter((e) => `${e.label} ${e.kind}`.toLowerCase().includes(q)) : INDEX.slice(0, NAV_ITEMS.length + 1);
    return list.slice(0, 9);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);
  useEffect(() => setActive(0), [query]);

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    onClose();
    navigate(entry.to);
  };

  return (
    <Dialog open={open} onClose={onClose} title="Search SAGRI" className="max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <TextInput
          ref={input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(results.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter") go(results[active]);
          }}
          placeholder="Search 22 crops, leaf diseases, mandi rates, govt schemes"
          aria-label="Search"
          className="pl-11"
        />
      </div>
      <div className="mt-4 max-h-96 overflow-y-auto" role="listbox">
        {results.length === 0 && (
          <Text size="sm" tone="muted" className="px-3 py-6 text-center">
            Nothing matches "{query}". Try a crop, a disease or a scheme name.
          </Text>
        )}
        {results.map((entry, i) => (
          <RowButton
            key={`${entry.to}-${entry.label}`}
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onClick={() => go(entry)}
            className={cn("flex items-center justify-between gap-4 rounded-lg px-3 py-3", i === active && "bg-secondary")}
          >
            <span>
              <Text as="span" size="sm" className="block">
                {entry.label}
              </Text>
              <Text as="span" size="xs" tone="muted" className="block">
                {entry.kind}
              </Text>
            </span>
            <ArrowRight className={cn("h-4 w-4 shrink-0 text-wheat", i === active ? "opacity-100" : "opacity-0")} />
          </RowButton>
        ))}
      </div>
    </Dialog>
  );
}
