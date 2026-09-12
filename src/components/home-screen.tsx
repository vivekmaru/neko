import { AgentMark } from "@/components/agent-mark";
import { CatMark } from "@/components/cat-mark";
import { AddHostSheet } from "@/components/sheets/add-host-sheet";
import { LiveActivity } from "@/components/live-activity";
import { StatusDot, statusLabel } from "@/components/status-dot";
import { cn } from "@/lib/cn";
import { useNeko } from "@/lib/store";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export function HomeScreen() {
  const hosts = useNeko((s) => s.hosts);
  const sessions = useNeko((s) => s.sessions);
  const beginConnect = useNeko((s) => s.beginConnect);
  const reconnectHost = useNeko((s) => s.reconnectHost);
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const active = [...sessions].sort((a, b) => b.lastActiveAt - a.lastActiveAt);

  function openSession(id: string) {
    const s = sessions.find((x) => x.id === id);
    const host = hosts.find((h) => h.id === s?.hostId);
    if (host && !host.online) reconnectHost(host.id);
    beginConnect(id);
    void navigate({ to: "/session/$id", params: { id } });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <CatMark className="size-8" />
          <div>
            <h1 className="text-base font-semibold tracking-tight">Neko</h1>
            <p className="text-[11px] text-muted">Demo hosts · local-first</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Add host"
          className="press flex size-11 items-center justify-center rounded-md bg-surface-2 text-fg"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="size-5" />
        </button>
      </header>

      <LiveActivity />

      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        <section className="px-4 pt-5">
          <h2 className="mb-2 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Active sessions</h2>
          <div className="stagger-in grid gap-2">
            {active.map((s) => {
              const host = hosts.find((h) => h.id === s.hostId);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => openSession(s.id)}
                  className="press flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3 text-left"
                >
                  <AgentMark id={s.agent} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{s.agent ? s.name : s.cwd}</span>
                      <span className="text-[11px] text-muted">{host?.name}</span>
                    </div>
                    <p className="truncate text-xs text-muted">{s.lastSnippet}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted">
                      <StatusDot status={s.status} />
                      {statusLabel(s.status)}
                    </span>
                    <span className="font-mono text-[10px] text-subtle">
                      {s.mux}:{s.pane}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-4 pt-6">
          <h2 className="mb-2 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Saved connections</h2>
          <div className="grid gap-2">
            {hosts.map((h) => {
              const count = sessions.filter((s) => s.hostId === h.id).length;
              return (
                <Link
                  key={h.id}
                  to="/host/$id"
                  params={{ id: h.id }}
                  className="press flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3"
                >
                  <span className="flex size-8 items-center justify-center rounded-sm bg-surface-2 font-mono text-xs text-accent">
                    {h.os === "mac" ? "⌘" : h.os === "wsl" ? "W" : "λ"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{h.name}</span>
                      <StatusDot status={h.online ? (h.hookStatus === "attention" ? "attention" : "online") : "offline"} />
                    </div>
                    <p className="truncate text-xs text-muted">
                      {h.username}@{h.hostname}:{h.port} · {h.transport.toUpperCase()}
                    </p>
                  </div>
                  <span className="text-xs text-muted tabular-nums">{count} sess</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <AddHostSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

export function HostOsBadge({ os }: { os: string }) {
  return (
    <span className={cn("rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted")}>{os}</span>
  );
}
