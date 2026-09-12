import { useEffect, useRef, useState } from "react";

export function FaceIdSheet({
  open,
  title = "Face ID",
  onDone,
  onClose,
}: {
  open: boolean;
  title?: string;
  onDone: () => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"scan" | "ok">("scan");
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!open) {
      setPhase("scan");
      return;
    }
    const ok = window.setTimeout(() => setPhase("ok"), 900);
    const done = window.setTimeout(() => doneRef.current(), 1300);
    return () => {
      window.clearTimeout(ok);
      window.clearTimeout(done);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-bg/70 p-6" onClick={onClose}>
      <div
        className="flex w-full max-w-xs flex-col items-center rounded-2xl border border-border bg-surface px-6 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex size-20 items-center justify-center">
          <span className={`face-ring absolute inset-0 rounded-full border border-accent/40 ${phase === "scan" ? "" : "opacity-0"}`} />
          <span className={`face-ring face-ring-2 absolute inset-2 rounded-full border border-accent/70 ${phase === "scan" ? "" : "opacity-0"}`} />
          <svg viewBox="0 0 48 48" className="size-10 text-accent" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M10 16V12h4M34 12h4v4M38 32v4h-4M14 36H10v-4" />
            {phase === "ok" ? (
              <path d="M16 24l6 6 12-14" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <circle cx="18" cy="20" r="1.4" fill="currentColor" />
                <circle cx="30" cy="20" r="1.4" fill="currentColor" />
                <path d="M18 30c2.2 2.2 9.8 2.2 12 0" strokeLinecap="round" />
              </>
            )}
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium">{phase === "ok" ? "Recognised" : title}</p>
        <p className="mt-1 text-center text-xs text-muted">
          {phase === "ok" ? "Identity unlocked for this host." : "Look at the camera to unlock the key."}
        </p>
      </div>
    </div>
  );
}
