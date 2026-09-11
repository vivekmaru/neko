import { cn } from "@/lib/cn";
import type { SessionStatus } from "@/lib/types";

export function StatusDot({ status }: { status: SessionStatus | "online" | "offline" | "attention" }) {
  const color =
    status === "waiting"
      ? "bg-orange"
      : status === "working" || status === "thinking" || status === "online"
        ? "bg-green"
        : status === "attention"
          ? "bg-yellow"
          : status === "offline"
            ? "bg-red"
            : "bg-subtle";
  const pulse = status === "working" || status === "thinking" || status === "waiting";
  return (
    <span className={cn("inline-block size-1.5 rounded-full", color, pulse && "pulse-dot")} />
  );
}

export function statusLabel(status: SessionStatus) {
  if (status === "thinking") return "Thinking";
  if (status === "working") return "Working";
  if (status === "waiting") return "Needs you";
  if (status === "offline") return "Offline";
  return "Idle";
}
