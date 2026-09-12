import { AgentMark } from "@/components/agent-mark";
import { FaceIdSheet } from "@/components/face-id-sheet";
import { StatusDot } from "@/components/status-dot";
import { useNeko } from "@/lib/store";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";

export function HostScreen({ id }: { id: string }) {
  const host = useNeko((s) => s.hosts.find((h) => h.id === id));
  const allSessions = useNeko((s) => s.sessions);
  const sessions = allSessions.filter((s) => s.hostId === id);
  const beginConnect = useNeko((s) => s.beginConnect);
  const dropHost = useNeko((s) => s.dropHost);
  const reconnectHost = useNeko((s) => s.reconnectHost);
  const autoAttach = useNeko((s) => s.settings.autoAttach);
  const biometric = useNeko((s) => s.settings.biometric);
  const revealed = useNeko((s) => s.revealedHostId === id);
  const revealHost = useNeko((s) => s.revealHost);
  const navigate = useNavigate();
  const [scan, setScan] = useState(false);

  if (!host) {
    return (
      <div className="p-6 text-sm text-muted">
        Host not found.{" "}
        <Link to="/" className="text-accent">
          Home
        </Link>
      </div>
    );
  }

  function attach(sessionId: string) {
    beginConnect(sessionId);
    void navigate({ to: "/session/$id", params: { id: sessionId } });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 pb-8">
      <Link to="/" className="mb-4 text-sm text-muted">
        Home
      </Link>
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-md bg-surface-2 font-mono text-lg text-accent">
          {host.os === "mac" ? "⌘" : "λ"}
        </span>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{host.name}</h1>
          <p className="flex items-center gap-2 text-xs text-muted">
            <StatusDot status={host.online ? (host.hookStatus === "attention" ? "attention" : "online") : "offline"} />
            {host.online
              ? host.hookStatus === "running"
                ? "hook running"
                : host.hookStatus === "attention"
                  ? "hook needs attention"
                  : "hook offline"
              : "disconnected"}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Item k="User" v={host.username} />
        <Item k="Host" v={`${host.hostname}:${host.port}`} />
        <Item k="Transport" v={host.transport.toUpperCase()} />
        <Item k="OS" v={host.os} />
      </dl>

      <div className="mt-3 rounded-md bg-surface px-3 py-2">
        <p className="text-[11px] text-muted">Identity</p>
        <p className="font-mono text-xs">{host.fingerprint}</p>
        <p className="mt-1 font-mono text-xs text-muted">
          {revealed ? "-----BEGIN OPENSSH PRIVATE KEY-----  n3k0DEMO…" : "••••••••••••••••••••"}
        </p>
        <button
          type="button"
          className="mt-2 text-xs font-medium text-accent"
          onClick={() => {
            if (revealed) {
              revealHost(null);
              return;
            }
            if (biometric) setScan(true);
            else revealHost(id);
          }}
        >
          {revealed ? "Hide key" : biometric ? "Unlock with Face ID" : "Reveal key"}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {host.online ? (
          <button
            type="button"
            className="press min-h-11 rounded-md border border-border bg-surface text-sm font-medium"
            onClick={() => dropHost(id)}
          >
            Disconnect
          </button>
        ) : (
          <button
            type="button"
            className="press min-h-11 rounded-md bg-accent text-sm font-semibold text-accent-fg"
            onClick={() => {
              const sid = reconnectHost(id);
              toast(autoAttach ? "Auto-attaching" : "Reconnected", {
                description: `${host.transport.toUpperCase()} · ${host.name}`,
              });
              if (sid) attach(sid);
            }}
          >
            Reconnect
          </button>
        )}
        <button
          type="button"
          className="press min-h-11 rounded-md border border-border bg-surface text-sm font-medium"
          onClick={() => toast("neko-hook install queued", { description: "Demo only — no daemon is started." })}
        >
          Install hooks
        </button>
      </div>

      <h2 className="mt-8 mb-2 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Sessions</h2>
      <div className="grid gap-2">
        {sessions.map((s) => (
          <button
            key={s.id}
            type="button"
            className="press flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3 text-left"
            onClick={() => {
              if (!host.online) reconnectHost(id);
              attach(s.id);
            }}
          >
            <AgentMark id={s.agent} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{s.name}</p>
              <p className="truncate text-xs text-muted">
                {s.mux}:{s.pane} · {s.lastSnippet}
              </p>
            </div>
            <StatusDot status={s.status} />
          </button>
        ))}
        {sessions.length === 0 ? <p className="text-sm text-muted">No sessions on this host yet.</p> : null}
      </div>

      <FaceIdSheet
        open={scan}
        onClose={() => setScan(false)}
        onDone={() => {
          revealHost(id);
          setScan(false);
        }}
      />
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-surface px-3 py-2">
      <dt className="text-[11px] text-muted">{k}</dt>
      <dd className="font-mono text-sm">{v}</dd>
    </div>
  );
}
