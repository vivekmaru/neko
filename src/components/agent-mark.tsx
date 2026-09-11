import { AGENTS } from "@/lib/agents";
import { cn } from "@/lib/cn";
import type { AgentId } from "@/lib/types";

export function AgentMark({
  id,
  size = "md",
}: {
  id?: AgentId;
  size?: "sm" | "md" | "lg";
}) {
  const agent = id ? AGENTS[id] : null;
  const dim = size === "sm" ? "size-6 text-[10px]" : size === "lg" ? "size-10 text-sm" : "size-8 text-[11px]";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm font-mono font-semibold tracking-tight",
        dim,
      )}
      style={{
        background: agent ? `color-mix(in oklab, ${agent.color} 22%, transparent)` : "var(--surface-2)",
        color: agent?.color ?? "var(--muted)",
        border: `1px solid color-mix(in oklab, ${agent?.color ?? "var(--fg)"} 35%, transparent)`,
      }}
      aria-hidden
    >
      {agent?.glyph ?? ">"}
    </span>
  );
}
