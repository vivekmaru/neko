import { cn } from "@/lib/cn";

/** Brand mark — alpaca head, spear ears, long neck. */
export function AlpacaMark({ className }: { className?: string; accent?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn(className)}>
      <rect x="1" y="1" width="30" height="30" rx="8" className="fill-surface-2" />
      <path
        className="fill-accent"
        d="M16 5.6 C14.2 5.6 13.1 7.4 12.8 9.2 C10.4 5.2 8.2 7.6 11.2 11.2 C9.1 12.3 8.5 14.6 10 16.8 L12.2 17.8 L12.6 26.4 Q16 28.8 19.4 26.4 L19.8 17.8 L22 16.8 C23.5 14.6 22.9 12.3 20.8 11.2 C23.8 7.6 21.6 5.2 19.2 9.2 C18.9 7.4 17.8 5.6 16 5.6 Z"
      />
      <rect x="12.6" y="12.2" width="2.4" height="4.2" rx="0.7" className="fill-bg" />
      <rect x="17" y="12.2" width="2.4" height="4.2" rx="0.7" className="fill-bg" />
      <path className="fill-bg" d="M16 18.6 C15.2 18.6 14.6 17.8 16 17.8 C17.4 17.8 16.8 18.6 16 18.6 Z" />
    </svg>
  );
}

/** @deprecated use AlpacaMark — kept so existing imports compile */
export function CatMark(props: { className?: string; accent?: boolean }) {
  return <AlpacaMark {...props} />;
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
  return <AlpacaMark className={className} />;
}
