import { cn } from "@/lib/cn";
import { Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-4 py-5">
      <h2 className="mb-3 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}

export function Group({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-xl border border-border bg-surface">{children}</div>;
}

export function Toggle({ label, on, onChange, hint }: { label: string; on: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex min-h-12 items-center justify-between gap-3 px-3">
      <span className="min-w-0">
        <span className="block text-sm">{label}</span>
        {hint ? <span className="block text-[11px] text-muted">{hint}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={cn("relative h-7 w-11 shrink-0 rounded-full transition-colors", on ? "bg-accent" : "bg-surface-2")}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-6 rounded-full transition-transform",
            on ? "translate-x-4 bg-accent-fg" : "bg-muted",
          )}
        />
      </button>
    </label>
  );
}

export function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex rounded-md bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn("h-9 flex-1 rounded-sm text-xs font-medium", value === o.id ? "bg-bg text-fg" : "text-muted")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function RowLink({
  to,
  label,
  value,
  icon,
}: {
  to: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link to={to as "/settings/watch"} className="press flex min-h-12 items-center gap-3 px-3">
      {icon ? <span className="text-muted">{icon}</span> : null}
      <span className="flex-1 text-sm">{label}</span>
      {value ? <span className="text-xs text-muted">{value}</span> : null}
      <ChevronRight className="size-4 text-subtle" />
    </Link>
  );
}

export function FeatureRow({
  icon,
  label,
  free,
  pro,
}: {
  icon: React.ReactNode;
  label: string;
  free?: string;
  pro?: string;
}) {
  return (
    <div className="flex min-h-12 items-center gap-3 border-b border-border px-3 last:border-b-0">
      <span className="flex size-7 items-center justify-center text-muted">{icon}</span>
      <span className="flex-1 text-sm">{label}</span>
      {free && pro ? (
        <span className="text-xs tabular-nums text-muted">
          {free} <span className="text-subtle">→</span> <span className="text-green">{pro}</span>
        </span>
      ) : (
        <Check className="size-4 text-green" strokeWidth={2.4} />
      )}
    </div>
  );
}
