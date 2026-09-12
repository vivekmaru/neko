import { Group, Section, Toggle } from "@/components/settings-ui";
import { ALL_INBOX_ACTIONS, FREE_INBOX_ACTION_CAP, FREE_SHORTCUT_CAP } from "@/lib/pro";
import { useNeko } from "@/lib/store";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";

export function ShortcutsScreen() {
  const settings = useNeko((s) => s.settings);
  const addShortcut = useNeko((s) => s.addShortcut);
  const removeShortcut = useNeko((s) => s.removeShortcut);
  const toggleInboxAction = useNeko((s) => s.toggleInboxAction);
  const [label, setLabel] = useState("gst");
  const [payload, setPayload] = useState("git status");
  const cap = settings.pro ? 40 : FREE_SHORTCUT_CAP;
  const actionCap = settings.pro ? 12 : FREE_INBOX_ACTION_CAP;

  function add() {
    const ok = addShortcut({ label: label.trim() || payload, kind: "command", payload: payload.trim() });
    if (!ok) {
      toast("Shortcut limit", { description: settings.pro ? "That's plenty." : `Free is ${FREE_SHORTCUT_CAP}. Unlock Pro for unlimited.` });
      return;
    }
    toast("Shortcut saved", { description: `${label} → ${payload}` });
    setLabel("");
    setPayload("");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col overflow-y-auto pb-10">
      <div className="px-4 pt-4">
        <Link to="/settings" className="text-sm text-muted">
          Settings
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Shortcuts</h1>
        <p className="mt-1 text-sm text-muted">
          Keys land on the terminal toolbar. Commands send as if you typed them.
        </p>
      </div>

      <Section title="Toolbar">
        <Group>
          {settings.shortcuts.map((s) => (
            <div key={s.id} className="flex min-h-12 items-center gap-3 border-b border-border px-3 last:border-b-0">
              <span className="rounded-sm bg-surface-2 px-2 py-1 font-mono text-[11px]">{s.label}</span>
              <span className="flex-1 truncate text-xs text-muted">
                {s.kind === "command" ? s.payload : s.payload}
              </span>
              <button type="button" className="text-xs text-red" onClick={() => removeShortcut(s.id)}>
                Remove
              </button>
            </div>
          ))}
        </Group>
        <p className="mt-2 px-1 text-[11px] text-muted">
          {settings.shortcuts.length} / {settings.pro ? "∞" : cap}
        </p>
        <form
          className="mt-3 grid gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none"
            placeholder="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            className="min-h-11 rounded-md border border-border bg-surface px-3 font-mono text-sm outline-none"
            placeholder="git status"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
          <button type="submit" className="press min-h-11 rounded-md bg-accent text-sm font-semibold text-accent-fg">
            Add command shortcut
          </button>
        </form>
      </Section>

      <Section title="Inbox actions">
        <Group>
          {ALL_INBOX_ACTIONS.map((a) => {
            const on = settings.inboxActions.includes(a.id);
            return (
              <Toggle
                key={a.id}
                label={a.label}
                on={on}
                onChange={() => {
                  const ok = toggleInboxAction(a.id);
                  if (!ok) {
                    toast("Inbox action limit", {
                      description: settings.pro ? "Keep at least one action." : `Free is ${actionCap}. Unlock Pro for unlimited.`,
                    });
                  }
                }}
              />
            );
          })}
        </Group>
        <p className="mt-2 px-1 text-[11px] text-muted">Swipe an inbox row to use them.</p>
      </Section>
    </div>
  );
}
