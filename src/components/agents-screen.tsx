import { AgentMark } from "@/components/agent-mark";
import { StatusDot, statusLabel } from "@/components/status-dot";
import { UsageRing } from "@/components/usage-ring";
import { AGENTS } from "@/lib/agents";
import { useNeko } from "@/lib/store";
import type { Session, SessionStatus } from "@/lib/types";
import { Link } from "@tanstack/react-router";

const COLUMNS: { id: SessionStatus; title: string }[] = [
  { id: "waiting", title: "Needs you" },
  { id: "working", title: "Working" },
  { id: "thinking", title: "Thinking" },
  { id: "idle", title: "Idle" },
];

export function AgentsScreen() {
  const allSessions = useNeko((s) => s.sessions);
  const usages = useNeko((s) => s.usages);
  const hosts = useNeko((s) => s.hosts);
  const sessions = allSessions.filter((s) => s.agent);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-base font-semibold tracking-tight">Agents & usage</h1>
        <p className="text-[11px] text-muted">One board for every hooked CLI</p>
      </header>

      <section className="px-4 pt-3">
        <h2 className="mb-3 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Windows</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {usages.map((u) => (
            <UsageRing
              key={u.agent}
              value={(u.used / u.limit) * 100}
              label={AGENTS[u.agent].short}
              sub={`${u.used}/${u.limit} · ${u.windowLabel}`}
              color={AGENTS[u.agent].color}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 px-4 py-5 lg:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = sessions.filter((s) => s.status === col.id);
          return (
            <div key={col.id}>
              <h2 className="mb-2 flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                {col.title}
                <span className="tabular-nums">{items.length}</span>
              </h2>
              <div className="grid gap-2">
                {items.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border px-3 py-4 text-xs text-subtle">Empty</p>
                ) : (
                  items.map((s) => <AgentCard key={s.id} session={s} host={hosts.find((h) => h.id === s.hostId)?.name} />)
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function AgentCard({ session, host }: { session: Session; host?: string }) {
  return (
    <Link
      to="/session/$id"
      params={{ id: session.id }}
      className="press flex items-start gap-3 rounded-lg border border-border bg-surface px-3 py-3"
    >
      <AgentMark id={session.agent} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          {session.agent ? AGENTS[session.agent].name : session.name}
          <StatusDot status={session.status} />
        </div>
        <p className="text-[11px] text-muted">
          {host} · {session.mux} {session.pane}
        </p>
        <p className="mt-1 truncate text-xs text-muted">{session.lastSnippet}</p>
      </div>
      <span className="text-[11px] text-subtle">{statusLabel(session.status)}</span>
    </Link>
  );
}
