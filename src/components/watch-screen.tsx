import { AgentMark } from "@/components/agent-mark";
import { statusLabel } from "@/components/status-dot";
import { useNeko } from "@/lib/store";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMemo, useState } from "react";

export function WatchScreen() {
  const sessions = useNeko((s) => s.sessions);
  const hosts = useNeko((s) => s.hosts);
  const settings = useNeko((s) => s.settings);
  const pairWatch = useNeko((s) => s.pairWatch);
  const approve = useNeko((s) => s.approve);
  const deny = useNeko((s) => s.deny);
  const beginConnect = useNeko((s) => s.beginConnect);
  const navigate = useNavigate();
  const ordered = useMemo(() => {
    const rank = (status: string) =>
      status === "waiting" ? 0 : status === "working" || status === "thinking" ? 1 : 2;
    return [...sessions].sort((a, b) => {
      const d = rank(a.status) - rank(b.status);
      return d !== 0 ? d : b.lastActiveAt - a.lastActiveAt;
    });
  }, [sessions]);
  const [idx, setIdx] = useState(0);
  const session = ordered[idx % Math.max(ordered.length, 1)];
  const host = hosts.find((h) => h.id === session?.hostId);

  function cycle() {
    if (!ordered.length) return;
    setIdx((i) => (i + 1) % ordered.length);
  }

  function open() {
    if (!session) return;
    beginConnect(session.id);
    void navigate({ to: "/session/$id", params: { id: session.id } });
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pt-4 pb-10">
      <Link to="/settings" className="mb-4 text-sm text-muted">
        Settings
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Apple Watch</h1>
      <p className="mt-1 text-sm text-muted">Approve, jump sessions, and see live activity from the wrist.</p>

      {!settings.watchPaired ? (
        <div className="mt-8 flex flex-col items-center">
          <WatchBezel>
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
              <p className="text-sm font-medium">Not paired</p>
              <p className="text-[11px] text-muted">Neko complications stay on this watch.</p>
            </div>
          </WatchBezel>
          <button
            type="button"
            className="press mt-6 min-h-12 w-full max-w-xs rounded-lg bg-accent text-sm font-semibold text-accent-fg"
            onClick={() => {
              if (!pairWatch(true)) toast("Neko Pro", { description: "Watch actions are a Pro extra." });
            }}
          >
            Pair Watch
          </button>
          {!settings.pro ? <p className="mt-2 text-xs text-muted">Watch actions need Neko Pro.</p> : null}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            <WatchBezel>
              {session ? (
                <div className="flex h-full w-full flex-col px-3.5 py-3">
                  <button type="button" className="text-left" onClick={open}>
                    <div className="flex items-center justify-between text-[10px] text-muted">
                      <span>Neko</span>
                      <span className="tabular-nums">9:41</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <AgentMark id={session.agent} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{session.name}</p>
                        <p className="truncate text-[10px] text-muted">
                          {host?.name} · {session.mux}:{session.pane}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] font-medium text-accent">{statusLabel(session.status)}</p>
                    <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-muted">{session.lastSnippet}</p>
                  </button>
                  {session.pendingApproval ? (
                    <div className="mt-auto grid grid-cols-2 gap-1.5 pt-3">
                      <button
                        type="button"
                        className="press min-h-9 rounded-md bg-accent text-[11px] font-semibold text-accent-fg"
                        onClick={() => approve(session.id)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="press min-h-9 rounded-md bg-surface-2 text-[11px] font-medium"
                        onClick={() => deny(session.id)}
                      >
                        Deny
                      </button>
                    </div>
                  ) : (
                    <p className="mt-auto pt-3 text-[10px] text-subtle">Digital Crown · next session</p>
                  )}
                </div>
              ) : (
                <p className="p-4 text-sm text-muted">No sessions</p>
              )}
            </WatchBezel>
            <button
              type="button"
              aria-label="Digital Crown"
              onClick={cycle}
              className="absolute top-[56px] -right-5 flex h-16 w-10 items-center justify-center"
            >
              <span className="watch-crown h-11 w-3 rounded-full" />
            </button>
            <span className="absolute top-[128px] -right-1.5 h-7 w-1.5 rounded-full bg-neutral-700" />
          </div>
          <p className="mt-5 text-center text-xs text-muted">
            Crown cycles sessions. Approve and Deny fire on the paired host.
          </p>
          <button
            type="button"
            className="press mt-4 text-xs text-muted"
            onClick={() => pairWatch(false)}
          >
            Unpair Watch
          </button>
        </div>
      )}
    </div>
  );
}

function WatchBezel({ children }: { children: React.ReactNode }) {
  return (
    <div className="watch-bezel relative h-[280px] w-[230px] rounded-[48px] p-[10px]">
      <div className="h-full overflow-hidden rounded-[38px] bg-bg">{children}</div>
    </div>
  );
}
