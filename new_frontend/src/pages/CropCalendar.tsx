import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { EmptyState, PageHeader, Reveal, Section, Tag, statusTone } from "@/src/app/kit";
import { CALENDAR_TEMPLATES, stageTimeline } from "@/src/data/calendar";
import { cn } from "@/lib/cn";
import { useCalendarCrops, useCalendarDone } from "@/src/lib/sagri";

const month = (d: Date) => new Intl.DateTimeFormat("en-US", { month: "short" }).format(d);

/** Compact stage window: "Nov 1–15", "Jan", "Dec–Feb". */
function windowLabel(from: Date, to: Date) {
  const lastDay = new Date(to.getFullYear(), to.getMonth() + 1, 0).getDate();
  if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) {
    return from.getDate() === 1 && to.getDate() === lastDay ? month(from) : `${month(from)} ${from.getDate()}–${to.getDate()}`;
  }
  const days = (to.getTime() - from.getTime()) / 86400_000;
  return days >= 28 ? `${month(from)}–${month(to)}` : `${month(from)} ${from.getDate()} – ${month(to)} ${to.getDate()}`;
}

export default function CropCalendar() {
  const [crops, setCrops] = useCalendarCrops();
  const [done, setDone] = useCalendarDone();
  const plans = crops.map((id) => CALENDAR_TEMPLATES.find((t) => t.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const available = CALENDAR_TEMPLATES.filter((t) => !crops.includes(t.id));

  return (
    <>
      <PageHeader
        eyebrow="AI Crop Calendar"
        title="Agricultural Crop Cycle & Operations Calendar"
        subtitle="Stage-by-stage schedule for sowing, irrigation, fertilizer top-dressing, and harvesting"
      />

      <div className="mt-10">
        <Text size="sm" tone="muted">
          Add a crop
        </Text>
        <div className="mt-3 flex flex-wrap gap-2">
          {available.length === 0 && (
            <Text size="sm" tone="muted">
              All supported crops are on your calendar.
            </Text>
          )}
          {available.map((t) => (
            <Chip key={t.id} onClick={() => setCrops((c) => [...c, t.id])}>
              <Plus className="h-3.5 w-3.5" />
              {t.crop} · {t.season}
            </Chip>
          ))}
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="mt-12">
          <EmptyState title="No crops on your calendar" body="Add a crop above to see its stage-by-stage schedule." />
        </div>
      ) : (
        <div className="mt-4 grid gap-x-12 lg:grid-cols-2">
          {plans.map((plan, pi) => {
            const stages = stageTimeline(plan);
            return (
              <Reveal key={plan.id} delay={pi * 0.06}>
                <Section
                  title={`${plan.crop} (${plan.season} Season)`}
                  action={
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label={`Remove ${plan.crop}`} onClick={() => setCrops((c) => c.filter((x) => x !== plan.id))}>
                      <X className="h-4 w-4" />
                    </Button>
                  }
                >
                  <ol className="relative border-l border-border">
                    {stages.map((stage, si) => {
                      const key = `${plan.id}:${stage.name}:${stage.fromDate.getFullYear()}`;
                      const status = done[key] ? "Completed" : stage.status;
                      return (
                        <li key={stage.name} className="relative pb-8 pl-8 last:pb-0">
                          <span
                            className={cn(
                              "absolute -left-2 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2",
                              status === "Completed" && "border-leaf bg-leaf",
                              status === "Active" && "border-wheat bg-wheat",
                              status === "Upcoming" && "border-wheat bg-background",
                              status === "Pending" && "border-border bg-background",
                            )}
                          />
                          <div className="flex flex-wrap items-center gap-3">
                            <Heading as="h3" size="small">
                              Stage {si + 1}: {stage.name}
                            </Heading>
                            <Tag tone={status === "Pending" ? "neutral" : statusTone(status)}>{status}</Tag>
                          </div>
                          <Text size="sm" tone="muted" mono className="mt-1">
                            {windowLabel(stage.fromDate, stage.toDate)}
                          </Text>
                          {stage.status !== "Completed" && (
                            <Chip
                              active={Boolean(done[key])}
                              size="sm"
                              className="mt-3"
                              onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                            >
                              <Check className="h-3.5 w-3.5" />
                              {done[key] ? "Marked done" : "Mark done"}
                            </Chip>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </Section>
              </Reveal>
            );
          })}
        </div>
      )}
    </>
  );
}
