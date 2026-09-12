import { FREE_SHORTCUT_CAP } from "@/lib/pro";
import { useNeko } from "@/lib/store";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

export function KeyboardToolbar({ sessionId }: { sessionId: string }) {
  const runShortcut = useNeko((s) => s.runShortcut);
  const injectKey = useNeko((s) => s.injectKey);
  const shortcuts = useNeko((s) => s.settings.shortcuts);
  const pro = useNeko((s) => s.settings.pro);
  const visible = pro ? shortcuts : shortcuts.slice(0, FREE_SHORTCUT_CAP);

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-t border-border bg-surface px-2 py-1.5">
      {visible.map((k) => (
        <button
          key={k.id}
          type="button"
          className="press h-9 shrink-0 rounded-sm bg-surface-2 px-2.5 font-mono text-[11px] font-medium"
          onClick={() => runShortcut(sessionId, k)}
        >
          {k.label}
        </button>
      ))}
      <span className="ml-auto flex gap-0.5">
        <Pad onClick={() => injectKey(sessionId, "Left")}>
          <ArrowLeft className="size-4" />
        </Pad>
        <div className="flex flex-col gap-0.5">
          <Pad onClick={() => injectKey(sessionId, "Up")}>
            <ArrowUp className="size-4" />
          </Pad>
          <Pad onClick={() => injectKey(sessionId, "Down")}>
            <ArrowDown className="size-4" />
          </Pad>
        </div>
        <Pad onClick={() => injectKey(sessionId, "Right")}>
          <ArrowRight className="size-4" />
        </Pad>
      </span>
    </div>
  );
}

function Pad({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="press flex size-8 items-center justify-center rounded-sm bg-surface-2 text-muted" onClick={onClick}>
      {children}
    </button>
  );
}
