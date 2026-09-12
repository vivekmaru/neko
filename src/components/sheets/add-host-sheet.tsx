import { cn } from "@/lib/cn";
import { FREE_HOST_CAP } from "@/lib/pro";
import { useNeko } from "@/lib/store";
import type { Transport } from "@/lib/types";
import { toast } from "sonner";
import { useMemo, useState } from "react";

export function AddHostSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addHost = useNeko((s) => s.addHost);
  const pro = useNeko((s) => s.settings.pro);
  const hostCount = useNeko((s) => s.hosts.length);
  const [tab, setTab] = useState<"pair" | "manual">("pair");
  const [name, setName] = useState("homelab");
  const [hostname, setHostname] = useState("homelab.tailnet");
  const [username, setUsername] = useState("joel");
  const [transport, setTransport] = useState<Transport>("mosh");

  const cells = useMemo(() => {
    const out: boolean[] = [];
    for (let i = 0; i < 21 * 21; i++) out.push(((i * 17 + 3) ^ (i * 13)) % 5 > 1);
    return out;
  }, []);

  if (!open) return null;

  function saveHost(input: { name: string; hostname: string; username: string; transport: Transport }) {
    const id = addHost(input);
    if (!id) {
      toast("Host limit", { description: pro ? "That's plenty." : `Free is ${FREE_HOST_CAP} saved connections. Unlock Pro for unlimited.` });
      return;
    }
    toast("Host saved", { description: `${input.username}@${input.hostname} · ${input.transport.toUpperCase()}` });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/60 p-3 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex gap-1 rounded-md bg-surface-2 p-1">
          {(["pair", "manual"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "h-9 flex-1 rounded-sm text-sm font-medium capitalize",
                tab === t ? "bg-bg text-fg" : "text-muted",
              )}
            >
              {t === "pair" ? "Easy Pair" : "Manual"}
            </button>
          ))}
        </div>

        {tab === "pair" ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-center text-sm text-muted">
              Run <span className="font-mono text-fg">neko-hook host setup</span> on the machine, then scan.
            </p>
            <div className="grid grid-cols-[repeat(21,8px)] gap-px rounded-md bg-fg p-2">
              {cells.map((on, i) => (
                <span key={i} className={on ? "size-2 bg-bg" : "size-2 bg-fg"} />
              ))}
            </div>
            <button
              type="button"
              className="press min-h-11 w-full rounded-md bg-accent text-sm font-semibold text-accent-fg"
              onClick={() => saveHost({ name: "homelab", hostname: "homelab.tailnet", username: "joel", transport: "mosh" })}
            >
              Simulate scan
            </button>
            <p className="text-center text-[11px] text-muted">
              {hostCount} saved · {pro ? "unlimited" : `${FREE_HOST_CAP} on Free`}
            </p>
          </div>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              saveHost({ name, hostname, username, transport });
            }}
          >
            <Field label="Name" value={name} onChange={setName} />
            <Field label="Host" value={hostname} onChange={setHostname} />
            <Field label="User" value={username} onChange={setUsername} />
            <label className="grid gap-1 text-xs text-muted">
              Transport
              <select
                className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm text-fg"
                value={transport}
                onChange={(e) => setTransport(e.target.value as Transport)}
              >
                <option value="auto">Auto</option>
                <option value="mosh">Mosh</option>
                <option value="ssh">SSH</option>
                <option value="et">Eternal Terminal</option>
              </select>
            </label>
            <button type="submit" className="press min-h-11 rounded-md bg-accent text-sm font-semibold text-accent-fg">
              Save host
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-xs text-muted">
      {label}
      <input
        className="min-h-11 rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none focus:border-border-strong"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
