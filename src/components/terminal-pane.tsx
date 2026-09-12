import { cn } from "@/lib/cn";
import { useNeko } from "@/lib/store";
import type { Color, Session, TermPart } from "@/lib/types";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const COLOR: Record<Color, string> = {
  fg: "text-fg",
  muted: "text-muted",
  subtle: "text-subtle",
  accent: "text-accent",
  green: "text-green",
  red: "text-red",
  yellow: "text-yellow",
  blue: "text-blue",
  cyan: "text-cyan",
  orange: "text-orange",
  magenta: "text-magenta",
};

let gesturedHintLocked = false;

export function TerminalPane({ session }: { session: Session }) {
  const cursor = useNeko((s) => s.settings.cursor);
  const blink = useNeko((s) => s.settings.blink);
  const scale = useNeko((s) => s.settings.termScale);
  const gestures = useNeko((s) => s.settings.gestures);
  const hinted = useNeko((s) => s.settings.gesturesHinted);
  const patch = useNeko((s) => s.patchSettings);
  const setTermScale = useNeko((s) => s.setTermScale);
  const setComposer = useNeko((s) => s.setComposer);
  const recallHistory = useNeko((s) => s.recallHistory);
  const send = useNeko((s) => s.send);
  const bottom = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number; dist: number; fingers: number } | null>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [session.lines.length, session.status]);

  useEffect(() => {
    if (!gestures || hinted || gesturedHintLocked) return;
    gesturedHintLocked = true;
    toast("Gestures", { description: "Swipe for history · pinch to zoom · two-finger paste" });
    patch({ gesturesHinted: true });
  }, [gestures, hinted, patch]);

  function pointerCount(e: React.PointerEvent | React.TouchEvent) {
    if ("touches" in e) return e.touches.length;
    return 1;
  }

  function distOf(e: React.TouchEvent) {
    if (e.touches.length < 2) return 0;
    const a = e.touches[0]!;
    const b = e.touches[1]!;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  return (
    <div
      className="term-scroll h-full overflow-y-auto bg-bg px-3 py-3 font-mono leading-5"
      style={{ fontSize: `${12 * scale}px` }}
      onTouchStart={(e) => {
        if (!gestures) return;
        start.current = {
          x: e.touches[0]?.clientX ?? 0,
          y: e.touches[0]?.clientY ?? 0,
          dist: distOf(e),
          fingers: e.touches.length,
        };
      }}
      onTouchMove={(e) => {
        if (!gestures || !start.current) return;
        if (e.touches.length === 2 && start.current.dist > 0) {
          const d = distOf(e);
          const ratio = d / start.current.dist;
          setTermScale(scale * ratio);
          start.current.dist = d;
        }
      }}
      onTouchEnd={(e) => {
        if (!gestures || !start.current) return;
        const t = e.changedTouches[0];
        const dx = (t?.clientX ?? 0) - start.current.x;
        const dy = (t?.clientY ?? 0) - start.current.y;
        const fingers = start.current.fingers;
        start.current = null;
        if (fingers >= 2 && Math.abs(dx) < 24 && Math.abs(dy) < 24) {
          const paste = session.lastSnippet || "git status";
          send(session.id, paste.startsWith("Waiting") ? "git status" : paste);
          toast("Pasted", { description: "Two-finger paste" });
          return;
        }
        if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) {
          const recalled = recallHistory(session.id, dx > 0 ? 1 : -1);
          if (recalled) setComposer(recalled);
          else if (dx < 0) setComposer("");
        }
      }}
      onPointerDown={(e) => {
        if (!gestures || e.pointerType === "touch") return;
        start.current = { x: e.clientX, y: e.clientY, dist: 0, fingers: pointerCount(e) };
      }}
      onPointerUp={(e) => {
        if (!gestures || e.pointerType === "touch" || !start.current) return;
        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;
        start.current = null;
        if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy)) {
          const recalled = recallHistory(session.id, dx > 0 ? 1 : -1);
          if (recalled) setComposer(recalled);
          else if (dx < 0) setComposer("");
        }
      }}
    >
      {session.lines.map((line) => (
        <div key={line.id} className="whitespace-pre-wrap">
          {line.parts.map((p, i) => (
            <Part key={i} part={p} />
          ))}
        </div>
      ))}
      <div ref={bottom} className="mt-0.5 inline-flex items-center">
        <Cursor style={cursor} blink={blink} />
      </div>
    </div>
  );
}

function Part({ part }: { part: TermPart }) {
  return <span className={cn(COLOR[part.c ?? "fg"])}>{part.t}</span>;
}

function Cursor({ style, blink }: { style: "block" | "underline" | "bar"; blink: boolean }) {
  const cls = cn("inline-block bg-accent", blink && "cursor-blink");
  if (style === "bar") return <span className={cn(cls, "h-4 w-px")} />;
  if (style === "underline") return <span className={cn(cls, "h-px w-2 align-bottom")} />;
  return <span className={cn(cls, "h-4 w-2")} />;
}
