import type { InboxActionId, Shortcut } from "./types";

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: "esc", label: "Esc", kind: "key", payload: "Esc" },
  { id: "ctrl", label: "Ctrl", kind: "key", payload: "Ctrl" },
  { id: "tab", label: "Tab", kind: "key", payload: "Tab" },
  { id: "cc", label: "Ctrl-C", kind: "key", payload: "Ctrl-C" },
  { id: "cz", label: "Ctrl-Z", kind: "key", payload: "Ctrl-Z" },
];

export const DEFAULT_INBOX_ACTIONS: InboxActionId[] = [
  "open",
  "approve",
  "deny",
  "snooze",
  "archive",
];

export const ALL_INBOX_ACTIONS: { id: InboxActionId; label: string }[] = [
  { id: "open", label: "Open session" },
  { id: "approve", label: "Approve" },
  { id: "deny", label: "Deny" },
  { id: "snooze", label: "Snooze" },
  { id: "archive", label: "Archive" },
  { id: "copy", label: "Copy" },
];

export const FREE_HOST_CAP = 2;
export const FREE_SHORTCUT_CAP = 3;
export const FREE_INBOX_ACTION_CAP = 5;
export const FREE_DICTATION_MIN = 3;
export const PRO_DICTATION_MIN = 60;

export function dictationLimit(pro: boolean) {
  return pro ? PRO_DICTATION_MIN : FREE_DICTATION_MIN;
}

export const PRO_EXTRAS: { id: string; label: string; to?: string }[] = [
  { id: "mux", label: "tmux/herdr/zellij sessions" },
  { id: "attach", label: "Auto-attach after reconnect" },
  { id: "jump", label: "Window & tab jump" },
  { id: "paste", label: "Remote image paste" },
  { id: "diff", label: "Diff viewer" },
  { id: "preview", label: "Web preview" },
  { id: "watch", label: "Apple Watch (w/ actions)", to: "/settings/watch" },
  { id: "mosh", label: "Mosh protocol" },
  { id: "et", label: "ET protocol" },
  { id: "files", label: "File sharing" },
  { id: "byok", label: "BYOK dictation (your own API key)" },
  { id: "themes", label: "Custom themes" },
  { id: "fonts", label: "Custom fonts" },
];

export const PRO_CORE: { id: string; label: string; free?: string; pro?: string; to?: string }[] = [
  { id: "hosts", label: "Saved connections", free: "2", pro: "∞" },
  { id: "cloud", label: "Cloud dictation", free: "3 min", pro: "60 min" },
  { id: "keys", label: "Custom shortcuts", free: "3", pro: "∞", to: "/settings/shortcuts" },
  { id: "inbox", label: "Inbox actions", free: "5", pro: "∞" },
  { id: "sessions", label: "Active sessions" },
  { id: "usage", label: "Agent usage", to: "/agents" },
  { id: "ssh", label: "SSH protocol" },
  { id: "bio", label: "Biometric key protection" },
  { id: "push", label: "Push notifications" },
  { id: "icloud", label: "iCloud sync" },
  { id: "gestures", label: "Terminal gestures" },
];
