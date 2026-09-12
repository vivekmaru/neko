import { SAMPLE_DIFF } from "@/lib/demo";
import { SheetFrame } from "@/components/sheets/jump-to";

export function DiffSheet({ onClose }: { onClose: () => void }) {
  return (
    <SheetFrame title="Working tree" onClose={onClose}>
      <p className="mb-3 text-xs text-muted">src/components/onboarding.tsx · 1 file</p>
      <pre className="overflow-x-auto rounded-md bg-bg p-3 font-mono text-[11px] leading-5">
        {SAMPLE_DIFF.split("\n").map((line, i) => {
          const c =
            line.startsWith("+") && !line.startsWith("+++")
              ? "text-green"
              : line.startsWith("-") && !line.startsWith("---")
                ? "text-red"
                : line.startsWith("@@")
                  ? "text-cyan"
                  : "text-muted";
          return (
            <div key={i} className={c}>
              {line || " "}
            </div>
          );
        })}
      </pre>
    </SheetFrame>
  );
}
