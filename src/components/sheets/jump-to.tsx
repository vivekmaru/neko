import { AgentMark } from "@/components/agent-mark";
import { StatusDot } from "@/components/status-dot";
import { useNeko } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";

export function JumpTo({ onClose }: { onClose: () => void }) {
  const sessions = useNeko((s) => s.sessions);
  const hosts = useNeko((s) => s.hosts);
  const beginConnect = useNeko((s) => s.beginConnect);
  const reconnectHost = useNeko((s) => s.reconnectHost);
  const navigate = useNavigate();

  return (
    <SheetFrame title="Jump To" onClose={onClose}>
      <p className="mb-3 text-xs text-muted">Windows and tabs across tmux, herdr, and zellij.</p>
      {hosts.map((host) => {
        const list = sessions.filter((s) => s.hostId === host.id);
        if (list.length === 0) return null;
        return (
          <div key={host.id} className="mb-4">
            <p className="mb-1 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
              {host.name} · {host.transport}
            </p>
            <ul className="divide-y divide-border rounded-md border border-border">
              {list.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="press flex w-full items-center gap-3 px-3 py-3 text-left"
                    onClick={() => {
                      if (!host.online) reconnectHost(host.id);
                      beginConnect(s.id);
                      void navigate({ to: "/session/$id", params: { id: s.id } });
                      onClose();
                    }}
                  >
                    <AgentMark id={s.agent} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{s.name}</span>
                        <span className="font-mono text-[11px] text-muted">
                          {s.mux}:{s.pane}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted">{s.lastSnippet}</p>
                    </div>
                    <StatusDot status={s.status} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </SheetFrame>
  );
}

export function SheetFrame({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/60 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[82dvh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-border bg-surface p-4 sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
