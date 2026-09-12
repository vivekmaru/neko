import { cn } from "@/lib/cn";

export function UsageRing({
  value,
  label,
  sub,
  color,
}: {
  value: number;
  label: string;
  sub: string;
  color?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const r = 28;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const stroke = color ?? "var(--accent)";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 72 72" className="size-16">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 36 36)"
        />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          className="fill-fg font-sans text-[11px] font-semibold tabular-nums"
        >
          {Math.round(pct)}
        </text>
      </svg>
      <div className="text-center">
        <div className="text-sm font-medium">{label}</div>
        <div className={cn("text-xs text-muted")}>{sub}</div>
      </div>
    </div>
  );
}
