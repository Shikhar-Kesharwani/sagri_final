import { useMemo, useState } from "react";
import { CheckCircle2, Minus, Plus, ShoppingBasket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/form";
import { Heading, Text } from "@/components/ui/primitives";
import { EmptyState, PageHeader, Panel, Reveal, Tag, pill } from "@/src/app/kit";
import { PRODUCTS, type Product } from "@/src/data/catalog";
import { formatINR } from "@/src/lib/format";
import { useCart } from "@/src/lib/sagri";

const CATEGORIES = ["All", "Cereals", "Pulses", "Oilseeds", "Vegetables", "Cotton"] as const;
type Category = (typeof CATEGORIES)[number];

function Qty({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border" role="group" aria-label={`${label} quantity`}>
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="Decrease" onClick={() => onChange(value - 1)}>
        <Minus className="h-4 w-4" />
      </Button>
      <Text as="span" mono size="sm" className="w-8 text-center">
        {value}
      </Text>
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="Increase" onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function BuySeeds() {
  const [category, setCategory] = useState<Category>("All");
  const [cart, setCart] = useCart();
  const [ordered, setOrdered] = useState<string | null>(null);
  const list = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const setQty = (id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id), qty }))
        .filter((l): l is { product: Product; qty: number } => Boolean(l.product)),
    [cart],
  );
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  const placeOrder = () => {
    setOrdered(`SG-${Date.now().toString().slice(-6)}`);
    setCart({});
  };

  return (
    <>
      <PageHeader
        eyebrow="Buy Certified Seeds"
        title="Certified Seed & Agricultural Store"
        subtitle="Government-certified seeds and inputs with guaranteed germination rates"
      />

      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Category">
        {CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 6) * 0.04}>
              <Panel className="flex h-full flex-col">
                <div className="flex flex-wrap gap-2">
                  {p.badges.map((b) => (
                    <Tag key={b} tone={b === "Certified" ? "good" : "neutral"}>
                      {b}
                    </Tag>
                  ))}
                </div>
                <Heading as="h3" family="serif" size="subtitle" className="mt-4">
                  {p.name}
                </Heading>
                <Text size="sm" tone="muted" className="mt-1">
                  {p.source} · {p.category}
                </Text>
                <ul className="mt-4 flex-1 space-y-1 text-sm">
                  {p.traits.map((t) => (
                    <li key={t} className="text-muted-foreground">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-wheat text-wheat" />
                  {p.rating} ({p.reviews} reviews)
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
                  <Text size="none" className="font-serif text-3xl">
                    {formatINR(p.price)}
                    <span className="text-sm text-muted-foreground"> / {p.unit}</span>
                  </Text>
                  {cart[p.id] ? (
                    <Qty value={cart[p.id]} onChange={(v) => setQty(p.id, v)} label={p.name} />
                  ) : (
                    <Button variant="outline" className="gap-2 rounded-full" onClick={() => setQty(p.id, 1)}>
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </Panel>
            </Reveal>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Panel>
            <Heading as="h2" family="serif" size="subtitle" className="flex items-center gap-3">
              <ShoppingBasket className="h-5 w-5 text-wheat" />
              Your basket
            </Heading>
            {ordered ? (
              <div className="mt-6" role="status">
                <CheckCircle2 className="h-6 w-6 text-leaf" />
                <Text className="mt-3">Order {ordered} placed.</Text>
                <Text size="sm" tone="muted" className="mt-1">
                  Pay cash on delivery. Your local input dealer will call you to confirm the delivery date.
                </Text>
                <Button variant="outline" className={`${pill} mt-6`} onClick={() => setOrdered(null)}>
                  Keep shopping
                </Button>
              </div>
            ) : lines.length === 0 ? (
              <div className="mt-6">
                <EmptyState title="Basket is empty" body="Add certified seeds to get started." />
              </div>
            ) : (
              <>
                <ul className="mt-6">
                  {lines.map((l) => (
                    <li key={l.product.id} className="flex items-center justify-between gap-4 border-b border-border py-3 text-sm">
                      <span>
                        {l.product.name}
                        <span className="block text-xs text-muted-foreground">
                          {l.qty} × {formatINR(l.product.price)} / {l.product.unit}
                        </span>
                      </span>
                      <span className="font-mono tabular-nums">{formatINR(l.product.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-baseline justify-between">
                  <Text size="sm" tone="muted">
                    Total
                  </Text>
                  <Text size="none" className="font-serif text-3xl">{formatINR(total)}</Text>
                </div>
                <Button variant="outline" className={`${pill} mt-6 w-full`} onClick={placeOrder}>
                  Place order · cash on delivery
                </Button>
              </>
            )}
          </Panel>
        </aside>
      </div>
    </>
  );
}
