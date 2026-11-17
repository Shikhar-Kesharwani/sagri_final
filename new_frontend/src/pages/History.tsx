import { useMemo, useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/form";
import { RowButton, Text } from "@/components/ui/primitives";
import { EmptyState, KeyValue, PageHeader, Stat, Tag } from "@/src/app/kit";
import { LinkButton } from "@/components/ui/app-link";
import { cn } from "@/lib/cn";
import { useHistory, type HistoryType } from "@/src/lib/sagri";

const TYPES: (HistoryType | "All")[] = ["All", "Disease", "Crop", "Price", "Risk", "Soil"];
const LABEL: Record<HistoryType, string> = {
  Disease: "Leaf Pathology Scan",
  Crop: "Crop Recommendation",
  Price: "Price Forecast",
  Risk: "Risk Analysis",
  Soil: "Soil Report",
};
const TONE: Record<HistoryType, "bad" | "good" | "accent" | "info" | "warn"> = {
  Disease: "bad",
  Crop: "good",
  Price: "accent",
  Risk: "warn",
  Soil: "info",
};

export default function History() {
  const { entries, setEntries } = useHistory();
  const [filter, setFilter] = useState<HistoryType | "All">("All");
  const [open, setOpen] = useState<string | null>(null);
  const list = filter === "All" ? entries : entries.filter((e) => e.type === filter);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = entries.filter((e) => {
      const d = new Date(e.at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total: entries.length, thisMonth };
  }, [entries]);

  return (
    <>
      <PageHeader
        eyebrow="Audit & Prediction History"
        title="AI Prediction & Diagnostic History"
        subtitle="Audit log of all past leaf disease scans, crop suggestions, and price forecasts"
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Stat label="Total predictions" value={stats.total} />
        <Stat label="This month" value={stats.thisMonth} />
        <Stat label="Success rate" value={stats.total ? "100%" : "–"} note="Predictions completed without error" tone="good" />
      </div>

      <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {TYPES.map((t) => (
          <Chip key={t} active={filter === t} onClick={() => setFilter(t)}>
            {t === "All" ? "All" : LABEL[t]}
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        {list.length === 0 ? (
          <EmptyState
            title="No reports yet"
            body="Run a diagnosis or a forecast and it will be saved here automatically."
            action={<LinkButton to="/disease-detection">Scan a leaf</LinkButton>}
          />
        ) : (
          <ul className="border-t border-border">
            {list.map((e) => (
              <li key={e.id} className="border-b border-border">
                <RowButton
                  aria-expanded={open === e.id}
                  onClick={() => setOpen(open === e.id ? null : e.id)}
                  className="grid grid-cols-1 items-center gap-2 py-5 sm:grid-cols-12 sm:gap-6"
                >
                  <span className="sm:col-span-3">
                    <Tag tone={TONE[e.type]}>{LABEL[e.type]}</Tag>
                  </span>
                  <span className="sm:col-span-5">
                    <Text as="span" className="block">
                      {e.title} ({e.result})
                    </Text>
                  </span>
                  <Text as="span" size="sm" tone="muted" className="sm:col-span-2">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(e.at))}
                  </Text>
                  <span className="flex items-center gap-2 text-sm text-wheat sm:col-span-2 sm:justify-end">
                    <span>{open === e.id ? "Hide report" : "View Diagnostic Report"}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", open === e.id && "rotate-180")} />
                  </span>
                </RowButton>
                {open === e.id && (
                  <div className="pb-6 sm:ml-auto sm:w-5/6">
                    <div className="max-w-lg">
                      {e.details.map(([k, v]) => (
                        <KeyValue key={k} label={k} value={v} />
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-4 gap-2 rounded-full text-muted-foreground"
                      onClick={() => setEntries((all) => all.filter((x) => x.id !== e.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete report
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
