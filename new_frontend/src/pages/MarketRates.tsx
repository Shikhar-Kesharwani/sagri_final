import { useMemo, useState } from "react";
import { Navigation, TrendingUp } from "lucide-react";
import { ExternalButton, AppLink } from "@/components/ui/app-link";
import { Chip } from "@/components/ui/form";
import { Text } from "@/components/ui/primitives";
import { Change, PageHeader, Panel, Reveal, Section, Stat, Tag } from "@/src/app/kit";
import { MARKET_BOARD } from "@/src/data/market";
import { districtById } from "@/src/data/places";
import { formatINR } from "@/src/lib/format";
import { useProfile } from "@/src/lib/sagri";

export default function MarketRates() {
  const [profile] = useProfile();
  const farmDistrict = districtById(profile.district);
  const defaultState = MARKET_BOARD[farmDistrict.state] ? farmDistrict.state : "Punjab";
  const states = Object.keys(MARKET_BOARD);
  const [state, setState] = useState(defaultState);
  const board = MARKET_BOARD[state];

  const best = useMemo(() => {
    const map = new Map<string, { price: number; mandi: string; change: number }>();
    board.forEach((m) =>
      m.rates.forEach((r) => {
        const cur = map.get(r.crop);
        if (!cur || r.price > cur.price) map.set(r.crop, { price: r.price, mandi: m.mandi, change: r.change });
      }),
    );
    return Array.from(map, ([crop, v]) => ({ crop, ...v }));
  }, [board]);

  return (
    <>
      <PageHeader
        eyebrow="Mandi Market Rates"
        title="Mandi Market Rates"
        subtitle="Real-time wholesale prices across nearby agricultural market committees (APMC yards)"
        actions={<AppLink to="/price-forecasting">See the six-month forecast</AppLink>}
      />

      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="State">
        {states.map((s) => (
          <Chip key={s} active={s === state} onClick={() => setState(s)}>
            {s}
          </Chip>
        ))}
      </div>

      <Reveal key={state}>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {best.map((b) => (
            <Stat
              key={b.crop}
              label={`Best ${b.crop} rate`}
              value={`${formatINR(b.price)} / quintal`}
              note={
                <>
                  {b.mandi} · <Change value={b.change} />
                </>
              }
            />
          ))}
        </div>

        <Section title="Nearby mandis" description="Sorted by distance from your farm.">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...board]
              .sort((a, b) => a.distance - b.distance)
              .map((m) => (
                <Panel key={m.mandi} className="flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Text size="none" className="font-serif text-2xl">{m.mandi}</Text>
                      {m.address && (
                        <Text size="sm" tone="muted" className="mt-1">
                          {m.address}
                        </Text>
                      )}
                    </div>
                    <Tag>{m.distance} km away</Tag>
                  </div>
                  <ul className="mt-6 flex-1">
                    {m.rates.map((r) => {
                      const top = best.find((b) => b.crop === r.crop)?.mandi === m.mandi;
                      return (
                        <li key={r.crop} className="flex items-center justify-between border-b border-border py-3 text-sm last:border-b-0">
                          <span className="flex items-center gap-2">
                            {r.crop}
                            {top && <TrendingUp className="h-3.5 w-3.5 text-leaf" aria-label="Best price" />}
                          </span>
                          <span className="flex items-center gap-4">
                            <span className="font-mono tabular-nums">{formatINR(r.price)}/qtl</span>
                            <span className="flex items-center gap-1">
                              <Change value={r.change} />
                              <span className="text-xs text-muted-foreground">trend</span>
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <ExternalButton
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.query)}`}
                    className="mt-6 self-start"
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions on Google Maps
                  </ExternalButton>
                </Panel>
              ))}
          </div>
        </Section>
      </Reveal>

      <Text size="xs" tone="muted" className="mt-12">
        Rates are modal prices reported to Agmarknet. Changes are against last week's average.
      </Text>
    </>
  );
}
