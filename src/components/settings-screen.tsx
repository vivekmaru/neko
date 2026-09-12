import { AppGlyph, CatMark } from "@/components/cat-mark";
import { FaceIdSheet } from "@/components/face-id-sheet";
import { FeatureRow, Group, RowLink, Section, Seg, Toggle } from "@/components/settings-ui";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/cn";
import { dictationLimit, PRO_CORE, PRO_EXTRAS } from "@/lib/pro";
import { useNeko } from "@/lib/store";
import type { AppIconId } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Cloud,
  Fingerprint,
  FolderUp,
  GitBranch,
  Globe,
  Hand,
  Image,
  Inbox,
  KeyRound,
  Keyboard,
  LayoutGrid,
  Mic,
  Palette,
  Radio,
  RefreshCw,
  SquareTerminal,
  Type,
  Watch,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const EXTRA_ICONS: Record<string, React.ReactNode> = {
  mux: <SquareTerminal className="size-4" />,
  attach: <RefreshCw className="size-4" />,
  jump: <LayoutGrid className="size-4" />,
  paste: <Image className="size-4" />,
  diff: <GitBranch className="size-4" />,
  preview: <Globe className="size-4" />,
  watch: <Watch className="size-4" />,
  mosh: <Radio className="size-4" />,
  et: <Radio className="size-4" />,
  files: <FolderUp className="size-4" />,
  byok: <KeyRound className="size-4" />,
  themes: <Palette className="size-4" />,
  fonts: <Type className="size-4" />,
};

const CORE_ICONS: Record<string, React.ReactNode> = {
  hosts: <Wifi className="size-4" />,
  cloud: <Mic className="size-4" />,
  keys: <Keyboard className="size-4" />,
  inbox: <Inbox className="size-4" />,
  sessions: <Activity className="size-4" />,
  usage: <Activity className="size-4" />,
  ssh: <Radio className="size-4" />,
  bio: <Fingerprint className="size-4" />,
  push: <Bell className="size-4" />,
  icloud: <Cloud className="size-4" />,
  gestures: <Hand className="size-4" />,
};

export function SettingsScreen() {
  const settings = useNeko((s) => s.settings);
  const patch = useNeko((s) => s.patchSettings);
  const setTheme = useNeko((s) => s.setTheme);
  const setFont = useNeko((s) => s.setFont);
  const setCursor = useNeko((s) => s.setCursor);
  const setIcon = useNeko((s) => s.setIcon);
  const setDictation = useNeko((s) => s.setDictation);
  const syncIcloud = useNeko((s) => s.syncIcloud);
  const pairWatch = useNeko((s) => s.pairWatch);
  const [scan, setScan] = useState(false);
  const limit = dictationLimit(settings.pro);
  const used = settings.dictationUsedMin;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="px-4 pt-4 pb-2">
        <h1 className="text-base font-semibold tracking-tight">Settings</h1>
        <p className="text-[11px] text-muted">One theme drives the whole app</p>
      </header>

      <Link
        to="/settings/pro"
        className="press mx-4 mt-3 flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3"
      >
        <CatMark className="size-10" />
        <div className="flex-1">
          <p className="text-sm font-medium">{settings.pro ? "Neko Pro" : "Upgrade to Pro"}</p>
          <p className="text-xs text-muted">
            {settings.pro ? "Watch, Mosh, shortcuts, image paste" : "Unlock the daily driver"}
          </p>
        </div>
      </Link>

      <Section title="Appearance">
        <p className="mb-2 px-1 text-xs text-muted">Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={cn(
                "press flex items-center gap-2 rounded-md border px-2.5 py-2 text-left",
                settings.themeId === t.id ? "border-accent" : "border-border",
              )}
            >
              <span className="flex size-7 overflow-hidden rounded-sm border border-border">
                <span className="w-1/2" style={{ background: t.bg }} />
                <span className="w-1/2" style={{ background: t.accent }} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium">{t.name}</span>
                <span className="text-[10px] text-muted capitalize">{t.group}</span>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 mb-2 px-1 text-xs text-muted">Font</p>
        <Seg
          value={settings.font}
          onChange={setFont}
          options={[
            { id: "jetbrains", label: "JetBrains" },
            { id: "ibm", label: "IBM Plex" },
            { id: "fira", label: "Fira Code" },
          ]}
        />

        <p className="mt-4 mb-2 px-1 text-xs text-muted">Cursor</p>
        <Seg
          value={settings.cursor}
          onChange={setCursor}
          options={[
            { id: "block", label: "Block" },
            { id: "underline", label: "Underline" },
            { id: "bar", label: "Bar" },
          ]}
        />

        <Toggle label="Blink cursor" on={settings.blink} onChange={(v) => patch({ blink: v })} />

        <p className="mt-4 mb-2 px-1 text-xs text-muted">App icon</p>
        <div className="flex gap-2">
          {(["cat", "prompt", "radio", "mark"] as AppIconId[]).map((id) => (
            <button
              key={id}
              type="button"
              aria-label={id}
              onClick={() => setIcon(id)}
              className={cn("rounded-md border p-1", settings.icon === id ? "border-accent" : "border-border")}
            >
              <AppGlyph id={id} className="size-10" />
            </button>
          ))}
        </div>
      </Section>

      <Section title="Terminal">
        <Group>
          <Toggle
            label="Auto-attach after reconnect"
            hint="Jump straight back into the last tmux / herdr / zellij pane"
            on={settings.autoAttach}
            onChange={(v) => patch({ autoAttach: v })}
          />
          <Toggle
            label="Terminal gestures"
            hint="Swipe history · pinch zoom · two-finger paste"
            on={settings.gestures}
            onChange={(v) => patch({ gestures: v, gesturesHinted: v ? settings.gesturesHinted : true })}
          />
          <RowLink to="/settings/shortcuts" label="Custom shortcuts" value={`${settings.shortcuts.length}`} icon={<Keyboard className="size-4" />} />
        </Group>
      </Section>

      <Section title="Agents">
        <Group>
          <Toggle label="Chat View" on={settings.chatEnabled} onChange={(v) => patch({ chatEnabled: v })} />
          <Toggle
            label="Push notifications"
            hint="Banners when an agent finishes or needs you"
            on={settings.notifications}
            onChange={(v) => patch({ notifications: v })}
          />
        </Group>
        <p className="mt-4 mb-2 px-1 text-xs text-muted">Dictation</p>
        <Seg
          value={settings.dictation}
          onChange={setDictation}
          options={[
            { id: "ondevice", label: "On-device" },
            { id: "whisper", label: "Whisper" },
            { id: "cloud", label: "Cloud" },
          ]}
        />
        {settings.dictation === "whisper" ? (
          <label className="mt-3 grid gap-1 px-1 text-xs text-muted">
            BYOK · OpenAI API key
            <input
              type="password"
              autoComplete="off"
              placeholder="sk-…"
              className="min-h-11 rounded-md border border-border bg-surface px-3 font-mono text-sm text-fg outline-none"
              value={settings.byokKey}
              onChange={(e) => patch({ byokKey: e.target.value })}
            />
          </label>
        ) : null}
        {settings.dictation === "cloud" ? (
          <div className="mt-3 px-1">
            <div className="mb-1 flex justify-between text-[11px] text-muted">
              <span>Cloud dictation</span>
              <span className="tabular-nums">
                {used.toFixed(1)} / {limit} min
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
              />
            </div>
          </div>
        ) : null}
      </Section>

      <Section title="Security & sync">
        <Group>
          <Toggle
            label="Biometric key protection"
            hint="Face ID before revealing host keys"
            on={settings.biometric}
            onChange={(v) => {
              if (v) setScan(true);
              else patch({ biometric: false });
            }}
          />
          <Toggle
            label="iCloud sync"
            hint={
              settings.lastSyncAt
                ? `Last synced ${new Date(settings.lastSyncAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Hosts, themes, shortcuts"
            }
            on={settings.icloud}
            onChange={(v) => {
              patch({ icloud: v });
              if (v) {
                syncIcloud();
                toast("iCloud", { description: "Syncing hosts, sessions, settings…" });
              }
            }}
          />
        </Group>
        {settings.icloud ? (
          <button
            type="button"
            className="press mt-3 min-h-11 w-full rounded-md border border-border bg-surface text-sm font-medium"
            onClick={() => {
              syncIcloud();
              toast("iCloud", { description: "3 hosts · sessions · settings" });
            }}
          >
            Sync now
          </button>
        ) : null}
      </Section>

      <Section title="Watch">
        <Group>
          <RowLink
            to="/settings/watch"
            label="Apple Watch"
            value={settings.watchPaired ? "Paired · actions on" : "Not paired"}
            icon={<Watch className="size-4" />}
          />
        </Group>
        {!settings.watchPaired ? (
          <button
            type="button"
            className="press mt-3 min-h-11 w-full rounded-md bg-surface text-sm font-medium"
            onClick={() => {
              if (!pairWatch(true)) toast("Neko Pro", { description: "Watch actions are a Pro extra." });
            }}
          >
            Pair Watch
          </button>
        ) : null}
      </Section>

      <Section title="About">
        <p className="px-1 text-sm text-muted">
          Neko is a playable clone of a mobile agent terminal. Sessions run in this preview — they do not SSH into your machines.
        </p>
        <p className="mt-2 px-1 text-xs text-subtle">Version 1.0 · demo hosts</p>
      </Section>

      <FaceIdSheet
        open={scan}
        title="Enable Face ID"
        onClose={() => setScan(false)}
        onDone={() => {
          patch({ biometric: true });
          setScan(false);
          toast("Keys protected", { description: "Host identities stay locked until Face ID." });
        }}
      />
    </div>
  );
}

export function ProScreen() {
  const pro = useNeko((s) => s.settings.pro);
  const patch = useNeko((s) => s.patchSettings);
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col overflow-y-auto px-4 pt-4 pb-10">
      <Link to="/settings" className="mb-4 text-sm text-muted">
        Back
      </Link>
      <CatMark className="size-14" />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Neko Pro</h1>
      <p className="mt-2 text-sm text-muted">
        Free is a full SSH terminal. Pro is the daily driver — mux, Watch, Mosh, and the rest of this list.
      </p>

      <p className="mt-6 mb-2 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Pro</p>
      <Group>
        {PRO_EXTRAS.map((row) => (
          <FeatureRow key={row.id} icon={EXTRA_ICONS[row.id]} label={row.label} />
        ))}
      </Group>

      <p className="mt-6 mb-2 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Core</p>
      <Group>
        {PRO_CORE.map((row) => (
          <FeatureRow key={row.id} icon={CORE_ICONS[row.id]} label={row.label} free={row.free} pro={row.pro} />
        ))}
      </Group>

      <button
        type="button"
        className="press mt-8 min-h-12 rounded-lg bg-accent text-sm font-semibold text-accent-fg"
        onClick={() => patch({ pro: !pro })}
      >
        {pro ? "Pro is on (demo)" : "Unlock Pro"}
      </button>
      <p className="mt-3 text-center text-xs text-subtle">Demo billing — nothing is charged. Turn Pro off to feel the caps.</p>
    </div>
  );
}

