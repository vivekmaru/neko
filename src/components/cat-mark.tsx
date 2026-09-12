import { cn } from "@/lib/cn";

export function CatMark({ className }: { className?: string; accent?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn(className)}>
      <rect x="1" y="1" width="30" height="30" rx="8" className="fill-surface-2" />
      <path
        className="fill-accent"
        d="M6.2 13.2 L3.4 3.4 L12.6 9.6 H19.4 L28.6 3.4 L25.8 13.2 L26.4 24.8 Q16 30.2 5.6 24.8 Z"
      />
      <rect x="10.2" y="13.4" width="3.6" height="7.4" rx="0.8" className="fill-bg" />
      <rect x="18.2" y="13.4" width="3.6" height="7.4" rx="0.8" className="fill-bg" />
      <path className="fill-bg" d="M16 23.4 L14.2 20.8 H17.8 Z" />
    </svg>
  );
}

export function AppGlyph({ id, className }: { id: string; className?: string }) {
  if (id === "prompt") {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="8" className="fill-surface-2" />
        <path d="M10 16 L14 12 L14 20 Z" className="fill-accent" />
        <rect x="17" y="19" width="7" height="2" rx="1" className="fill-fg" />
      </svg>
    );
  }
  if (id === "radio") {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="8" className="fill-surface-2" />
        <circle cx="16" cy="16" r="3" className="fill-accent" />
        <circle cx="16" cy="16" r="7" className="stroke-accent/70" fill="none" strokeWidth="1.4" />
        <circle cx="16" cy="16" r="11" className="stroke-accent/40" fill="none" strokeWidth="1.2" />
      </svg>
    );
  }
  if (id === "mark") {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="8" className="fill-surface-2" />
        <path d="M9 21 L16 9 L23 21" className="stroke-accent" fill="none" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    );
  }
  return <CatMark className={className} />;
}
