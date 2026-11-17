import { useState } from "react";
import { CalendarCheck, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, TextInput } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { KeyValue, PageHeader, Panel, Reveal, Section, Tag, pill } from "@/src/app/kit";
import { MACHINES, type Machine } from "@/src/data/catalog";
import { formatDate, formatINR } from "@/src/lib/format";
import { uid } from "@/src/lib/store";
import { useBookings, useProfile } from "@/src/lib/sagri";

const tomorrow = () => new Date(Date.now() + 86400_000).toISOString().slice(0, 10);

export default function RentMachinery() {
  const [profile] = useProfile();
  const [bookings, setBookings] = useBookings();
  const [selected, setSelected] = useState<Machine | null>(null);
  const [date, setDate] = useState(tomorrow());
  const [quantity, setQuantity] = useState(1);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const open = (m: Machine) => {
    setSelected(m);
    setDate(tomorrow());
    setQuantity(m.per === "acre" ? Math.max(1, Math.round(profile.acres)) : 4);
    setConfirmed(null);
  };

  const book = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setBookings((b) => [
      { id: uid(), machine: selected.name, date, quantity, unit: selected.per, amount: selected.rate * quantity },
      ...b,
    ]);
    setConfirmed(selected.owner);
  };

  return (
    <>
      <PageHeader
        eyebrow="Book Equipment & Machinery"
        title="Book Agricultural Machinery & Equipment"
        subtitle="Rent tractors, harvesters, and spraying drones near your village with verified operators"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MACHINES.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.05}>
            <Panel className="flex h-full flex-col">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-wheat" />
                  {m.place} ({m.distance} km away)
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-wheat text-wheat" />
                  {m.rating} ({m.bookings} rentals)
                </span>
              </div>
              <Heading as="h3" family="serif" size="subtitle" className="mt-4">
                {m.name}
              </Heading>
              <Text size="sm" tone="muted" className="mt-1">
                Owner: {m.owner}
              </Text>
              <Text size="sm" className="mt-4 flex-1">
                {m.includes}
              </Text>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <Text size="none" className="font-serif text-3xl">
                  {formatINR(m.rate)}
                  <span className="text-sm text-muted-foreground"> / {m.per}</span>
                  {m.dayRate && (
                    <span className="block font-sans text-sm text-muted-foreground">or {formatINR(m.dayRate)} / day</span>
                  )}
                </Text>
                <Button className="rounded-full" onClick={() => open(m)}>
                  Book Equipment
                </Button>
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>

      {bookings.length > 0 && (
        <Section title="Your bookings">
          <ul className="border-t border-border">
            {bookings.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-4 text-sm">
                <span>
                  {b.machine}
                  <span className="block text-muted-foreground">
                    {formatDate(b.date)} · {b.quantity} {b.unit}
                    {b.quantity > 1 ? "s" : ""}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="font-mono tabular-nums">{formatINR(b.amount)}</span>
                  <Tag tone="good">Confirmed</Tag>
                  <Button variant="ghost" className="rounded-full text-muted-foreground" onClick={() => setBookings((all) => all.filter((x) => x.id !== b.id))}>
                    Cancel
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Dialog open={selected !== null} onClose={() => setSelected(null)} title={confirmed ? "Booking confirmed" : `Book ${selected?.name ?? ""}`}>
        {selected &&
          (confirmed ? (
            <div role="status">
              <CalendarCheck className="h-6 w-6 text-leaf" />
              <Text className="mt-3">
                {confirmed} will reach your farm on {formatDate(date)}.
              </Text>
              <Text size="sm" tone="muted" className="mt-1">
                Pay the operator after the work is done. You can cancel for free until the day before.
              </Text>
              <Button variant="outline" className={`${pill} mt-6`} onClick={() => setSelected(null)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={book} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date" htmlFor="bdate">
                  <TextInput id="bdate" type="date" min={tomorrow()} required value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Field label={`Number of ${selected.per}s`} htmlFor="bqty">
                  <TextInput id="bqty" type="number" min={1} max={200} required value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
                </Field>
              </div>
              <div>
                <KeyValue label="Rate" value={`${formatINR(selected.rate)} / ${selected.per}`} />
                <KeyValue label="Includes" value={selected.includes} />
                <KeyValue label="Estimated total" value={<span className="font-serif text-2xl">{formatINR(selected.rate * quantity)}</span>} />
              </div>
              <Button type="submit" variant="outline" className={pill}>
                Confirm booking
              </Button>
            </form>
          ))}
      </Dialog>
    </>
  );
}
