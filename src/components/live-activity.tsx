import { AgentMark } from "@/components/agent-mark";
import { statusLabel } from "@/components/status-dot";
import { useNeko } from "@/lib/store";
import { Link } from "@tanstack/react-router";

export function LiveActivity() {
  const session = useNeko((s) =>
    s.sessions.find((x) => x.status === "waiting" || x.status === "working" || x.status === "thinking"),
  );
  if (!session) return null;
  return (
    <Link
      to="/session/$id"
      params={{ id: session.id }}
      className="press mx-4 mt-3 flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5"
    >
      <AgentMark id={session.agent} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="truncate">{session.agent ? session.name : session.cwd}</span>
          <span className="text-muted">{statusLabel(session.status)}</span>
        </div>
        <p className="truncate text-xs text-muted">{session.lastSnippet}</p>
      </div>
    </Link>
  );
}
