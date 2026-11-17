import { CHART } from "./kit";

/** Diseased-leaf preview with highlighted infection spots, used for sample diagnoses. */
export function LeafIllustration({ seed }: { seed: string }) {
  // deterministic spot layout per sample
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 9973;
  const rand = (i: number) => {
    const x = Math.sin(h + i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const spots = Array.from({ length: 9 }, (_, i) => ({
    cx: 70 + rand(i) * 60,
    cy: 55 + rand(i + 20) * 95,
    r: 5 + rand(i + 40) * 7,
  }));
  return (
    <svg viewBox="0 0 200 200" className="aspect-square w-full" role="img" aria-label="Leaf with highlighted infection spots">
      <path d="M100 18 C150 40 170 95 140 150 C122 180 100 186 100 186 C100 186 78 180 60 150 C30 95 50 40 100 18Z" fill={CHART.leaf} opacity="0.85" />
      <path d="M100 30 L100 182" stroke="hsl(95, 30%, 36%)" strokeWidth="2" />
      {[60, 85, 110, 135].map((y) => (
        <g key={y} stroke="hsl(95, 30%, 36%)" strokeWidth="1.2">
          <path d={`M100 ${y} L${70} ${y - 18}`} />
          <path d={`M100 ${y} L${130} ${y - 18}`} />
        </g>
      ))}
      {spots.map((s, i) => (
        <g key={i}>
          <circle cx={s.cx} cy={s.cy} r={s.r + 5} fill="none" stroke={CHART.alert} strokeWidth="1" strokeDasharray="2 2" />
          <circle cx={s.cx} cy={s.cy} r={s.r} fill="hsl(28, 40%, 26%)" />
          <circle cx={s.cx} cy={s.cy} r={s.r * 0.45} fill="hsl(38, 50%, 50%)" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}
