export type Color =
  | "fg"
  | "muted"
  | "subtle"
  | "accent"
  | "green"
  | "red"
  | "yellow"
  | "blue"
  | "cyan"
  | "orange"
  | "magenta";

export type AgentId =
  | "claude"
  | "codex"
  | "opencode"
  | "grok"
  | "cursor"
  | "kimi"
  | "qwen";

export type Transport = "auto" | "ssh" | "mosh" | "et";
export type Mux = "tmux" | "herdr" | "zellij" | "shell";
export type SessionStatus = "idle" | "thinking" | "working" | "waiting" | "offline";
export type SessionView = "terminal" | "chat";
export type CursorStyle = "block" | "underline" | "bar";
export type FontId = "jetbrains" | "ibm" | "fira";
export type AppIconId = "alpaca" | "cat" | "prompt" | "radio" | "mark";
export type DictationEngine = "ondevice" | "whisper" | "cloud";
export type ShortcutKind = "key" | "command";
export type InboxActionId = "open" | "approve" | "deny" | "snooze" | "archive" | "copy";

export type TermPart = { t: string; c?: Color };
export type TermLine = { id: string; parts: TermPart[] };

export type ToolKind = "bash" | "read" | "edit" | "write" | "search" | "task";

export type ChatMessage =
  | { id: string; kind: "user"; text: string; image?: string }
  | { id: string; kind: "assistant"; text: string; thinking?: string }
  | {
      id: string;
      kind: "tool";
      tool: ToolKind;
      title: string;
      detail: string;
      status: "running" | "ok" | "fail";
      diff?: string;
    }
  | { id: string; kind: "plan"; text: string }
  | { id: string; kind: "approval"; command: string; reason: string };

export type Approval = {
  id: string;
  command: string;
  reason: string;
};

export type Host = {
  id: string;
  name: string;
  hostname: string;
  port: number;
  username: string;
  os: "mac" | "linux" | "wsl";
  transport: Transport;
  hookStatus: "running" | "attention" | "offline";
  online: boolean;
  fingerprint: string;
};

export type Session = {
  id: string;
  hostId: string;
  name: string;
  mux: Mux;
  pane: string;
  cwd: string;
  agent?: AgentId;
  model?: string;
  branch?: string;
  status: SessionStatus;
  view: SessionView;
  lines: TermLine[];
  messages: ChatMessage[];
  pendingApproval?: Approval;
  lastActiveAt: number;
  lastSnippet: string;
};

export type InboxKind = "approval" | "question" | "tool" | "complete" | "start";

export type InboxItem = {
  id: string;
  sessionId: string;
  kind: InboxKind;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
};

export type Usage = {
  agent: AgentId;
  account: string;
  used: number;
  limit: number;
  windowLabel: string;
};

export type Shortcut = {
  id: string;
  label: string;
  kind: ShortcutKind;
  payload: string;
};

export type PushNote = {
  id: string;
  title: string;
  body: string;
  sessionId?: string;
};

export type Settings = {
  themeId: string;
  font: FontId;
  cursor: CursorStyle;
  blink: boolean;
  chatEnabled: boolean;
  pro: boolean;
  onboarded: boolean;
  dictation: DictationEngine;
  notifications: boolean;
  icon: AppIconId;
  autoAttach: boolean;
  gestures: boolean;
  gesturesHinted: boolean;
  biometric: boolean;
  icloud: boolean;
  lastSyncAt: number | null;
  watchPaired: boolean;
  byokKey: string;
  dictationUsedMin: number;
  termScale: number;
  shortcuts: Shortcut[];
  inboxActions: InboxActionId[];
  lastSessionId: string | null;
};
