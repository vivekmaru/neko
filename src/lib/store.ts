import { create } from "zustand";
import { AGENTS } from "./agents";
import {
  CODEX_TICK_LINES,
  FAKE_COMMANDS,
  HOSTS,
  nid,
  ln,
  seedInbox,
  seedSessions,
  USAGES,
} from "./demo";
import {
  DEFAULT_INBOX_ACTIONS,
  DEFAULT_SHORTCUTS,
  FREE_HOST_CAP,
  FREE_INBOX_ACTION_CAP,
  FREE_SHORTCUT_CAP,
  dictationLimit,
} from "./pro";
import type {
  AppIconId,
  ChatMessage,
  CursorStyle,
  DictationEngine,
  FontId,
  Host,
  InboxActionId,
  InboxItem,
  PushNote,
  Session,
  SessionView,
  Settings,
  Shortcut,
  Transport,
  Usage,
} from "./types";

const SETTINGS_KEY = "neko-settings-v1";

const DEFAULT_SETTINGS: Settings = {
  themeId: "neko",
  font: "jetbrains",
  cursor: "block",
  blink: true,
  chatEnabled: true,
  pro: true,
  onboarded: false,
  dictation: "ondevice",
  notifications: true,
  icon: "cat",
  autoAttach: true,
  gestures: true,
  gesturesHinted: false,
  biometric: true,
  icloud: true,
  lastSyncAt: Date.UTC(2026, 8, 10, 12, 40, 0),
  watchPaired: true,
  byokKey: "",
  dictationUsedMin: 1.2,
  termScale: 1,
  shortcuts: DEFAULT_SHORTCUTS,
  inboxActions: DEFAULT_INBOX_ACTIONS,
  lastSessionId: "s-claude",
};

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      shortcuts: parsed.shortcuts ?? DEFAULT_SETTINGS.shortcuts,
      inboxActions: parsed.inboxActions ?? DEFAULT_SETTINGS.inboxActions,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

type NekoState = {
  ready: boolean;
  settings: Settings;
  hosts: Host[];
  sessions: Session[];
  inbox: InboxItem[];
  usages: Usage[];
  histories: Record<string, string[]>;
  connectingId: string | null;
  composer: string;
  tickCount: number;
  push: PushNote | null;
  revealedHostId: string | null;
  hydrate: () => void;
  patchSettings: (p: Partial<Settings>) => void;
  setTheme: (id: string) => void;
  setFont: (font: FontId) => void;
  setCursor: (cursor: CursorStyle) => void;
  setIcon: (icon: AppIconId) => void;
  setDictation: (d: DictationEngine) => void;
  setComposer: (v: string) => void;
  setView: (sessionId: string, view: SessionView) => void;
  markInbox: (id: string) => void;
  markAllRead: () => void;
  beginConnect: (sessionId: string) => void;
  endConnect: () => void;
  addHost: (input: { name: string; hostname: string; username: string; transport: Transport }) => string | null;
  send: (sessionId: string, text: string, image?: string) => void;
  injectKey: (sessionId: string, key: string) => void;
  runShortcut: (sessionId: string, shortcut: Shortcut) => void;
  approve: (sessionId: string) => void;
  deny: (sessionId: string) => void;
  stopTurn: (sessionId: string) => void;
  tick: () => void;
  notify: (title: string, body: string, sessionId?: string) => void;
  dismissPush: () => void;
  dropHost: (id: string) => void;
  reconnectHost: (id: string) => string | null;
  addShortcut: (input: { label: string; kind: Shortcut["kind"]; payload: string }) => boolean;
  removeShortcut: (id: string) => void;
  toggleInboxAction: (id: InboxActionId) => boolean;
  archiveInbox: (id: string) => void;
  snoozeInbox: (id: string) => void;
  syncIcloud: () => void;
  consumeDictation: (minutes?: number) => boolean;
  setTermScale: (scale: number) => void;
  pairWatch: (paired: boolean) => boolean;
  revealHost: (id: string | null) => void;
  recallHistory: (sessionId: string, direction: 1 | -1) => string | null;
};

function persistSettings(s: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function patchSession(sessions: Session[], id: string, fn: (s: Session) => Session): Session[] {
  return sessions.map((s) => (s.id === id ? fn(s) : s));
}

function patchHost(hosts: Host[], id: string, fn: (h: Host) => Host): Host[] {
  return hosts.map((h) => (h.id === id ? fn(h) : h));
}

export const useNeko = create<NekoState>((set, get) => ({
  ready: false,
  settings: DEFAULT_SETTINGS,
  hosts: HOSTS,
  sessions: seedSessions(),
  inbox: seedInbox(),
  usages: USAGES,
  histories: {
    "s-shell": ["tmux ls", "mosh-server --version", "ls"],
    "s-claude": ["git push origin main"],
    "s-codex": ["vitest run src/lib/gate.test.ts"],
  },
  connectingId: null,
  composer: "",
  tickCount: 0,
  push: null,
  revealedHostId: null,

  hydrate: () => {
    if (get().ready) return;
    set({ settings: loadSettings(), ready: true });
  },

  patchSettings: (p) => {
    const settings = { ...get().settings, ...p };
    persistSettings(settings);
    set({ settings });
  },
  setTheme: (themeId) => get().patchSettings({ themeId }),
  setFont: (font) => get().patchSettings({ font }),
  setCursor: (cursor) => get().patchSettings({ cursor }),
  setIcon: (icon) => get().patchSettings({ icon }),
  setDictation: (dictation) => get().patchSettings({ dictation }),
  setComposer: (composer) => set({ composer }),
  setView: (sessionId, view) =>
    set({ sessions: patchSession(get().sessions, sessionId, (s) => ({ ...s, view })) }),
  markInbox: (id) =>
    set({ inbox: get().inbox.map((i) => (i.id === id ? { ...i, read: true } : i)) }),
  markAllRead: () => set({ inbox: get().inbox.map((i) => ({ ...i, read: true })) }),
  beginConnect: (sessionId) => {
    get().patchSettings({ lastSessionId: sessionId });
    set({ connectingId: sessionId });
  },
  endConnect: () => set({ connectingId: null }),

  addHost: (input) => {
    const { settings, hosts } = get();
    if (!settings.pro && hosts.length >= FREE_HOST_CAP) return null;
    const id = nid("host");
    const host: Host = {
      id,
      name: input.name,
      hostname: input.hostname,
      port: 22,
      username: input.username,
      os: "linux",
      transport: input.transport,
      hookStatus: "offline",
      online: false,
      fingerprint: `SHA256:n3k0/${input.name.slice(0, 8)}+demo`,
    };
    set({ hosts: [...hosts, host] });
    return id;
  },

  send: (sessionId, text, image) => {
    const trimmed = text.trim();
    if (!trimmed && !image) return;
    const session = get().sessions.find((s) => s.id === sessionId);
    if (!session) return;
    set({ composer: "" });

    if (trimmed) {
      const prev = get().histories[sessionId] ?? [];
      set({ histories: { ...get().histories, [sessionId]: [trimmed, ...prev.filter((x) => x !== trimmed)].slice(0, 40) } });
    }

    if (session.pendingApproval && (trimmed === "y" || trimmed === "yes")) {
      get().approve(sessionId);
      return;
    }
    if (session.pendingApproval && (trimmed === "n" || trimmed === "no")) {
      get().deny(sessionId);
      return;
    }

    if (session.agent && session.view === "chat") {
      const userMsg: ChatMessage = { id: nid("m"), kind: "user", text: trimmed || "(image)", image };
      set({
        sessions: patchSession(get().sessions, sessionId, (s) => ({
          ...s,
          status: "thinking",
          lastActiveAt: Date.now(),
          lastSnippet: trimmed || "image attached",
          messages: [...s.messages, userMsg],
          lines: [...s.lines, ln(""), ln("> ", "fg", trimmed, "fg")],
        })),
      });
      window.setTimeout(() => {
        const tool: ChatMessage = {
          id: nid("m"),
          kind: "tool",
          tool: "bash",
          title: "Inspect workspace",
          detail: "listing cwd, checking git status",
          status: "running",
        };
        set({
          sessions: patchSession(get().sessions, sessionId, (s) => ({
            ...s,
            status: "working",
            messages: [...s.messages, tool],
            lines: [...s.lines, ln("  Bash    ", "yellow", "git status --short", "fg")],
          })),
        });
      }, 700);
      window.setTimeout(() => {
        const reply = image
          ? "Got the screenshot. I'll use it as reference on this demo host."
          : `Got it. I'll take "${trimmed.slice(0, 80)}" from here — this is a demo host, so the work stays on this phone session.`;
        set({
          sessions: patchSession(get().sessions, sessionId, (s) => ({
            ...s,
            status: "idle",
            lastSnippet: reply,
            messages: s.messages
              .map((m) => (m.kind === "tool" && m.status === "running" ? { ...m, status: "ok" as const } : m))
              .concat([{ id: nid("m"), kind: "assistant", text: reply }]),
            lines: [...s.lines, ln(reply, "muted")],
          })),
        });
        set({
          inbox: [
            {
              id: nid("i"),
              sessionId,
              kind: "complete",
              title: `${session.agent ? AGENTS[session.agent].name : "Agent"} replied`,
              body: `${session.name}  ·  ${trimmed.slice(0, 60) || "image"}`,
              createdAt: Date.now(),
              read: false,
            },
            ...get().inbox,
          ],
        });
        get().notify(
          `${session.agent ? AGENTS[session.agent].name : "Agent"} replied`,
          trimmed.slice(0, 80) || "Looked at the screenshot",
          sessionId,
        );
      }, 1800);
      return;
    }

    const echo = ln("$ ", "accent", trimmed, "fg");
    const extra =
      FAKE_COMMANDS[trimmed] ??
      (trimmed === "clear"
        ? []
        : [ln("command not found — try ", "muted", "help", "accent")]);
    set({
      sessions: patchSession(get().sessions, sessionId, (s) => ({
        ...s,
        lastActiveAt: Date.now(),
        lastSnippet: trimmed,
        lines: trimmed === "clear" ? [ln("$ ", "accent", "", "fg")] : [...s.lines, echo, ...extra, ln("$ ", "accent", "", "fg")],
      })),
    });
  },

  injectKey: (sessionId, key) => {
    if (key === "Ctrl-C" || key === "Esc") {
      get().stopTurn(sessionId);
      return;
    }
    if (key === "Ctrl-Z") {
      get().stopTurn(sessionId);
      return;
    }
    if (key === "Ctrl-L") {
      set({
        sessions: patchSession(get().sessions, sessionId, (s) => ({
          ...s,
          lines: [ln("$ ", "accent", "", "fg")],
        })),
      });
      return;
    }
    if (key === "Tab") {
      get().setComposer(get().composer + "  ");
      return;
    }
    if (key === "Up") {
      const recalled = get().recallHistory(sessionId, 1);
      if (recalled) get().setComposer(recalled);
      return;
    }
    if (key === "Down") {
      const recalled = get().recallHistory(sessionId, -1);
      get().setComposer(recalled ?? "");
      return;
    }
    if (key === "Ctrl") {
      get().setComposer(get().composer + "^");
      return;
    }
    if (key.length === 1) {
      get().setComposer(get().composer + key);
    }
  },

  runShortcut: (sessionId, shortcut) => {
    if (shortcut.kind === "command") {
      get().send(sessionId, shortcut.payload);
      return;
    }
    get().injectKey(sessionId, shortcut.payload);
  },

  approve: (sessionId) => {
    set({
      sessions: patchSession(get().sessions, sessionId, (s) => ({
        ...s,
        status: "idle",
        pendingApproval: undefined,
        lastSnippet: "Pushed to origin/main",
        lastActiveAt: Date.now(),
        messages: s.messages
          .map((m) => {
            if (m.kind === "tool" && m.status === "running") return { ...m, status: "ok" as const, detail: "pushed 1 commit" };
            return m;
          })
          .filter((m) => m.kind !== "approval")
          .concat([
            {
              id: nid("m"),
              kind: "assistant",
              text: "Pushed to origin/main. Onboarding polish is on the remote.",
            },
          ]),
        lines: [
          ...s.lines,
          ln(""),
          ln("  Approved.", "green"),
          ln("  [main 7e4c2a1] onboarding polish", "muted"),
          ln("  1 file changed, 4 insertions(+), 7 deletions(-)", "muted"),
          ln("  To github.com:odd/neko.git", "muted"),
          ln("     3c91aa0..7e4c2a1  main -> main", "green"),
        ],
      })),
      inbox: get().inbox.map((i) =>
        i.sessionId === sessionId && i.kind === "approval" ? { ...i, read: true, title: "Push approved", kind: "complete" } : i,
      ),
    });
    get().notify("Push approved", "origin/main is up to date", sessionId);
  },

  deny: (sessionId) => {
    set({
      sessions: patchSession(get().sessions, sessionId, (s) => ({
        ...s,
        status: "idle",
        pendingApproval: undefined,
        lastSnippet: "Push denied",
        messages: s.messages
          .filter((m) => m.kind !== "approval")
          .concat([{ id: nid("m"), kind: "assistant", text: "Okay — left the commit local. Say if you want a different remote." }]),
        lines: [...s.lines, ln("  Denied. Commit stays local.", "red")],
      })),
      inbox: get().inbox.map((i) =>
        i.sessionId === sessionId && i.kind === "approval" ? { ...i, read: true, title: "Push denied", kind: "complete" } : i,
      ),
    });
  },

  stopTurn: (sessionId) => {
    set({
      sessions: patchSession(get().sessions, sessionId, (s) => ({
        ...s,
        status: "idle",
        lastSnippet: "Interrupted",
        lines: [...s.lines, ln("^C", "red")],
        messages: s.messages.map((m) =>
          m.kind === "tool" && m.status === "running" ? { ...m, status: "fail" as const, detail: "interrupted" } : m,
        ),
      })),
    });
  },

  tick: () => {
    const count = get().tickCount + 1;
    set({ tickCount: count });
    const working = get().sessions.find((s) => s.id === "s-codex" && s.status === "working");
    if (!working) return;
    if (count === 2) {
      set({
        sessions: patchSession(get().sessions, "s-codex", (s) => ({
          ...s,
          lines: [...s.lines, CODEX_TICK_LINES[0]!],
        })),
      });
    }
    if (count === 4) {
      set({
        sessions: patchSession(get().sessions, "s-codex", (s) => ({
          ...s,
          lines: [...s.lines, CODEX_TICK_LINES[1]!],
        })),
      });
    }
    if (count === 6) {
      set({
        sessions: patchSession(get().sessions, "s-codex", (s) => ({
          ...s,
          status: "idle",
          lastSnippet: "Auth gate extracted. Tests are green.",
          lines: [...s.lines, ...CODEX_TICK_LINES.slice(2)],
          messages: s.messages
            .map((m) =>
              m.kind === "tool" && m.status === "running"
                ? { ...m, status: "ok" as const, detail: "12 passed" }
                : m,
            )
            .concat([
              {
                id: nid("m"),
                kind: "assistant",
                text: "Auth gate extracted. Tests are green — 12 passed.",
              },
            ]),
        })),
        inbox: get().inbox.map((i) =>
          i.id === "i-codex" ? { ...i, kind: "complete", title: "Codex finished tests", read: false } : i,
        ),
      });
      get().notify("Codex finished tests", "api · 12 passed", "s-codex");
    }
  },

  notify: (title, body, sessionId) => {
    if (!get().settings.notifications) return;
    set({ push: { id: nid("p"), title, body, sessionId } });
  },
  dismissPush: () => set({ push: null }),

  dropHost: (id) => {
    const host = get().hosts.find((h) => h.id === id);
    set({
      hosts: patchHost(get().hosts, id, (h) => ({ ...h, online: false })),
      sessions: get().sessions.map((s) => (s.hostId === id ? { ...s, status: "offline" as const } : s)),
      revealedHostId: get().revealedHostId === id ? null : get().revealedHostId,
    });
    if (host) get().notify("Connection dropped", `${host.transport.toUpperCase()} · ${host.name}`);
  },

  reconnectHost: (id) => {
    const host = get().hosts.find((h) => h.id === id);
    if (!host) return null;
    const lastId = get().settings.lastSessionId;
    const onHost = get().sessions.filter((s) => s.hostId === id);
    const target = onHost.find((s) => s.id === lastId) ?? onHost[0] ?? null;
    set({
      hosts: patchHost(get().hosts, id, (h) => ({ ...h, online: true })),
      sessions: get().sessions.map((s) =>
        s.hostId === id && s.status === "offline"
          ? { ...s, status: s.pendingApproval ? "waiting" : "idle" }
          : s,
      ),
    });
    if (get().settings.autoAttach && target) {
      get().beginConnect(target.id);
      return target.id;
    }
    return null;
  },

  addShortcut: (input) => {
    const { settings } = get();
    const cap = settings.pro ? 40 : FREE_SHORTCUT_CAP;
    if (settings.shortcuts.length >= cap) return false;
    const shortcut: Shortcut = { id: nid("k"), ...input };
    get().patchSettings({ shortcuts: [...settings.shortcuts, shortcut] });
    return true;
  },
  removeShortcut: (id) => {
    get().patchSettings({ shortcuts: get().settings.shortcuts.filter((s) => s.id !== id) });
  },
  toggleInboxAction: (id) => {
    const { settings } = get();
    const on = settings.inboxActions.includes(id);
    if (on) {
      if (settings.inboxActions.length <= 1) return false;
      get().patchSettings({ inboxActions: settings.inboxActions.filter((x) => x !== id) });
      return true;
    }
    const cap = settings.pro ? 12 : FREE_INBOX_ACTION_CAP;
    if (settings.inboxActions.length >= cap) return false;
    get().patchSettings({ inboxActions: [...settings.inboxActions, id] });
    return true;
  },
  archiveInbox: (id) => set({ inbox: get().inbox.filter((i) => i.id !== id) }),
  snoozeInbox: (id) =>
    set({
      inbox: get()
        .inbox.map((i) => (i.id === id ? { ...i, read: true } : i))
        .sort((a, b) => Number(a.read) - Number(b.read)),
    }),

  syncIcloud: () => {
    if (!get().settings.icloud) get().patchSettings({ icloud: true });
    window.setTimeout(() => {
      get().patchSettings({ lastSyncAt: Date.now() });
    }, 900);
  },

  consumeDictation: (minutes = 0.15) => {
    const { settings } = get();
    if (settings.dictation !== "cloud") return true;
    const limit = dictationLimit(settings.pro);
    if (settings.dictationUsedMin + minutes > limit) return false;
    get().patchSettings({ dictationUsedMin: Number((settings.dictationUsedMin + minutes).toFixed(2)) });
    return true;
  },

  setTermScale: (scale) => {
    const next = Math.min(1.45, Math.max(0.8, Number(scale.toFixed(2))));
    get().patchSettings({ termScale: next });
  },

  pairWatch: (paired) => {
    if (paired && !get().settings.pro) return false;
    get().patchSettings({ watchPaired: paired });
    return true;
  },

  revealHost: (id) => set({ revealedHostId: id }),

  recallHistory: (sessionId, direction) => {
    const list = get().histories[sessionId] ?? [];
    if (list.length === 0) return null;
    const current = get().composer;
    const idx = list.indexOf(current);
    if (direction === 1) {
      if (idx === -1) return list[0] ?? null;
      return list[Math.min(list.length - 1, idx + 1)] ?? null;
    }
    if (idx <= 0) return null;
    return list[idx - 1] ?? null;
  },
}));
