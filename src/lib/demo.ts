import type { ChatMessage, Host, InboxItem, Session, TermLine, Usage } from "./types";

let n = 0;
export function nid(prefix = "n") {
  n += 1;
  return `${prefix}-${n}-${Math.random().toString(36).slice(2, 6)}`;
}

export function sp(...xs: string[]): TermLine["parts"] {
  const parts: TermLine["parts"] = [];
  for (let i = 0; i < xs.length; i += 2) {
    parts.push({ t: xs[i] ?? "", c: (xs[i + 1] as TermLine["parts"][0]["c"]) ?? "fg" });
  }
  return parts;
}

export function ln(...xs: string[]): TermLine {
  return { id: nid("l"), parts: sp(...xs) };
}

const T0 = Date.UTC(2026, 8, 10, 11, 20, 0);

export const HOSTS: Host[] = [
  {
    id: "studio-mac",
    name: "studio-mac",
    hostname: "studio-mac.tailnet",
    port: 22,
    username: "joel",
    os: "mac",
    transport: "mosh",
    hookStatus: "running",
    online: true,
    fingerprint: "SHA256:n3k0/studio+8a1Lm",
  },
  {
    id: "build-box",
    name: "build-box",
    hostname: "build.internal",
    port: 22,
    username: "deploy",
    os: "linux",
    transport: "mosh",
    hookStatus: "running",
    online: true,
    fingerprint: "SHA256:n3k0/build+Qw9eR",
  },
  {
    id: "spark",
    name: "spark",
    hostname: "spark.lab",
    port: 22,
    username: "grok",
    os: "linux",
    transport: "ssh",
    hookStatus: "attention",
    online: true,
    fingerprint: "SHA256:n3k0/spark+7c2Fa",
  },
];

const claudeLines: TermLine[] = [
  ln("joel@studio-mac ", "muted", "~/src/neko ", "accent", "main ", "green", "tmux:1.0", "subtle"),
  ln("claude", "orange", "  ", "fg", "opus-4.1", "muted", "  ·  onboarding polish", "subtle"),
  ln(""),
  ln("> ship the onboarding polish and push", "fg"),
  ln(""),
  ln("I'll tighten the hero copy, then commit and push.", "muted"),
  ln(""),
  ln("  Read    ", "muted", "src/components/onboarding.tsx", "cyan"),
  ln("  Read    ", "muted", "src/styles.css", "cyan"),
  ln("  Update  ", "muted", "src/components/onboarding.tsx", "green"),
  ln("    skip label, tighter hero, one primary action", "subtle"),
  ln("  Bash    ", "muted", "git diff --stat", "yellow"),
  ln("  Bash    ", "muted", "git log -5 --oneline", "yellow"),
  ln(""),
  ln("  Bash    ", "orange", "git push origin main", "fg"),
  ln("  Run git push origin main?", "yellow"),
  ln(""),
  ln("  git push origin main", "fg"),
  ln("  To github.com:odd/neko.git", "muted"),
  ln(""),
  ln("  Waiting for approval  ·  y / n", "orange"),
];

const claudeMessages: ChatMessage[] = [
  { id: "m1", kind: "user", text: "ship the onboarding polish and push" },
  {
    id: "m2",
    kind: "assistant",
    text: "I'll tighten the hero copy, then commit and push.",
    thinking: "Onboarding is a single screen. Keep one primary action, drop the extra skip row.",
  },
  {
    id: "m3",
    kind: "tool",
    tool: "read",
    title: "Read onboarding.tsx",
    detail: "src/components/onboarding.tsx  ·  186 lines",
    status: "ok",
  },
  {
    id: "m4",
    kind: "tool",
    tool: "edit",
    title: "Update onboarding.tsx",
    detail: "skip label, tighter hero, one primary action",
    status: "ok",
    diff: `@@ -12,9 +12,7 @@
-  <p className="text-muted">Pair a host, or try the demo.</p>
-  <button>Skip</button>
+  <p className="text-muted">Demo hosts are ready.</p>
   <button>Open Home</button>`,
  },
  {
    id: "m5",
    kind: "tool",
    tool: "bash",
    title: "git push origin main",
    detail: "To github.com:odd/neko.git",
    status: "running",
  },
  {
    id: "m6",
    kind: "approval",
    command: "git push origin main",
    reason: "Claude wants to push 1 commit to origin/main",
  },
];

const codexLines: TermLine[] = [
  ln("deploy@build-box ", "muted", "~/src/api ", "accent", "feat/auth ", "green", "herdr:api", "subtle"),
  ln("codex", "cyan", "  ", "fg", "gpt-5.3-codex", "muted", "  ·  refactor auth middleware", "subtle"),
  ln(""),
  ln("> extract the gate into its own module and add tests", "fg"),
  ln(""),
  ln("Working through the auth gate now.", "muted"),
  ln(""),
  ln("  Search  ", "muted", "requireUserId|authMiddleware", "cyan"),
  ln("  Read    ", "muted", "src/lib/auth.ts", "cyan"),
  ln("  Write   ", "muted", "src/lib/gate.ts", "green"),
  ln("  Update  ", "muted", "src/routes/api.ts", "green"),
  ln("  Write   ", "muted", "src/lib/gate.test.ts", "green"),
  ln("  Bash    ", "yellow", "vitest run src/lib/gate.test.ts", "fg"),
];

const codexMessages: ChatMessage[] = [
  { id: "c1", kind: "user", text: "extract the gate into its own module and add tests" },
  { id: "c2", kind: "assistant", text: "Working through the auth gate now." },
  {
    id: "c3",
    kind: "tool",
    tool: "search",
    title: "Search requireUserId",
    detail: "12 hits in src/",
    status: "ok",
  },
  {
    id: "c4",
    kind: "tool",
    tool: "write",
    title: "Write src/lib/gate.ts",
    detail: "extracted authMiddleware + requireUserId",
    status: "ok",
  },
  {
    id: "c5",
    kind: "tool",
    tool: "bash",
    title: "vitest run src/lib/gate.test.ts",
    detail: "running…",
    status: "running",
  },
];

const grokLines: TermLine[] = [
  ln("grok@spark ", "muted", "~/src/neko ", "accent", "main ", "green", "tmux:build", "subtle"),
  ln("grok", "fg", "  ", "fg", "grok-4", "muted", "  ·  clone the mobile terminal", "subtle"),
  ln(""),
  ln("> clone the whole agent terminal app", "fg"),
  ln(""),
  ln("Done. Preview is live with demo hosts.", "green"),
  ln(""),
  ln("  Home with three hosts and live sessions", "muted"),
  ln("  Chat View over the same session", "muted"),
  ln("  Inbox approvals, usage rings, themes", "muted"),
  ln(""),
  ln("  14 files  ·  typecheck clean", "accent"),
];

const grokMessages: ChatMessage[] = [
  { id: "g1", kind: "user", text: "clone the whole agent terminal app" },
  {
    id: "g2",
    kind: "plan",
    text: "1. Home + hosts\n2. Terminal + Chat View\n3. Inbox + approvals\n4. Agents & usage\n5. Settings / themes",
  },
  {
    id: "g3",
    kind: "tool",
    tool: "write",
    title: "Scaffold app shell",
    detail: "routes, store, theme tokens",
    status: "ok",
  },
  {
    id: "g4",
    kind: "assistant",
    text: "Done. Preview is live with demo hosts. Home, Chat View, Inbox approvals, usage rings, and themes are wired.",
  },
];

const shellLines: TermLine[] = [
  ln("joel@studio-mac ", "muted", "~ ", "accent", "zsh", "subtle"),
  ln("last login: Thu Sep 10 22:14 from 100.x.tailscale", "muted"),
  ln(""),
  ln("$ ", "accent", "tmux ls", "fg"),
  ln("agents: 3 windows (attached)", "fg"),
  ln("preview: 1 windows (attached)", "fg"),
  ln("$ ", "accent", "mosh-server --version", "fg"),
  ln("mosh-server 1.4.0", "muted"),
  ln("$ ", "accent", "", "fg"),
];

const openLines: TermLine[] = [
  ln("deploy@build-box ", "muted", "~/src/web ", "accent", "herdr:web", "subtle"),
  ln("opencode", "muted", "  ", "fg", "sonnet-4", "muted"),
  ln(""),
  ln("> outline a plan for the billing portal", "fg"),
  ln(""),
];

const openMessages: ChatMessage[] = [
  { id: "o1", kind: "user", text: "outline a plan for the billing portal" },
  {
    id: "o2",
    kind: "plan",
    text: "Stripe Customer Portal for web purchases.\n\n- Billing portal link in Settings → Pro\n- License key stays the source of truth\n- Cancel / invoice history via Stripe, not the stores\n- 3-device membership unchanged",
  },
  {
    id: "o3",
    kind: "assistant",
    text: "Plan is ready. Say go and I'll open the first file.",
  },
];

export function seedSessions(): Session[] {
  return [
    {
      id: "s-claude",
      hostId: "studio-mac",
      name: "claude",
      mux: "tmux",
      pane: "1.0",
      cwd: "~/src/neko",
      agent: "claude",
      model: "opus-4.1",
      branch: "main",
      status: "waiting",
      view: "chat",
      lines: claudeLines,
      messages: claudeMessages,
      pendingApproval: {
        id: "a-push",
        command: "git push origin main",
        reason: "Claude wants to push 1 commit to origin/main",
      },
      lastActiveAt: T0 - 40_000,
      lastSnippet: "Waiting for approval  ·  git push origin main",
    },
    {
      id: "s-codex",
      hostId: "build-box",
      name: "api",
      mux: "herdr",
      pane: "0.1",
      cwd: "~/src/api",
      agent: "codex",
      model: "gpt-5.3-codex",
      branch: "feat/auth",
      status: "working",
      view: "chat",
      lines: codexLines,
      messages: codexMessages,
      lastActiveAt: T0 - 8_000,
      lastSnippet: "vitest run src/lib/gate.test.ts",
    },
    {
      id: "s-grok",
      hostId: "spark",
      name: "build",
      mux: "tmux",
      pane: "2.0",
      cwd: "~/src/neko",
      agent: "grok",
      model: "grok-4",
      branch: "main",
      status: "idle",
      view: "chat",
      lines: grokLines,
      messages: grokMessages,
      lastActiveAt: T0 - 5 * 60_000,
      lastSnippet: "Done. Preview is live with demo hosts.",
    },
    {
      id: "s-shell",
      hostId: "studio-mac",
      name: "zsh",
      mux: "shell",
      pane: "3.0",
      cwd: "~",
      status: "idle",
      view: "terminal",
      lines: shellLines,
      messages: [],
      lastActiveAt: T0 - 12 * 60_000,
      lastSnippet: "mosh-server 1.4.0",
    },
    {
      id: "s-open",
      hostId: "build-box",
      name: "web",
      mux: "herdr",
      pane: "1.2",
      cwd: "~/src/web",
      agent: "opencode",
      model: "sonnet-4",
      branch: "main",
      status: "idle",
      view: "chat",
      lines: openLines,
      messages: openMessages,
      lastActiveAt: T0 - 18 * 60_000,
      lastSnippet: "Plan is ready. Say go and I'll open the first file.",
    },
  ];
}

export function seedInbox(): InboxItem[] {
  return [
    {
      id: "i-push",
      sessionId: "s-claude",
      kind: "approval",
      title: "Approve git push",
      body: "claude · studio-mac  ·  git push origin main",
      createdAt: T0 - 38_000,
      read: false,
    },
    {
      id: "i-codex",
      sessionId: "s-codex",
      kind: "tool",
      title: "Codex is running tests",
      body: "api · build-box  ·  vitest run src/lib/gate.test.ts",
      createdAt: T0 - 6_000,
      read: false,
    },
    {
      id: "i-grok",
      sessionId: "s-grok",
      kind: "complete",
      title: "Grok Build finished",
      body: "build · spark  ·  clone the mobile terminal",
      createdAt: T0 - 5 * 60_000,
      read: true,
    },
    {
      id: "i-open",
      sessionId: "s-open",
      kind: "question",
      title: "Plan ready — continue?",
      body: "web · build-box  ·  billing portal outline",
      createdAt: T0 - 18 * 60_000,
      read: true,
    },
  ];
}

export const USAGES: Usage[] = [
  { agent: "claude", account: "joel@studio", used: 62, limit: 100, windowLabel: "5h window" },
  { agent: "codex", account: "plus", used: 28, limit: 50, windowLabel: "resets 02:00" },
  { agent: "grok", account: "super", used: 11, limit: 40, windowLabel: "daily" },
  { agent: "opencode", account: "anthropic", used: 4, limit: 30, windowLabel: "5h window" },
];

export const FILE_TREE = [
  {
    name: "src",
    children: [
      { name: "components", children: [{ name: "onboarding.tsx" }, { name: "chat-pane.tsx" }, { name: "terminal-pane.tsx" }] },
      { name: "lib", children: [{ name: "store.ts" }, { name: "gate.ts" }, { name: "themes.ts" }] },
      { name: "routes", children: [{ name: "index.tsx" }, { name: "session.$id.tsx" }] },
      { name: "styles.css" },
    ],
  },
  { name: "package.json" },
  { name: "startup.sh" },
];

export const SAMPLE_DIFF = `diff --git a/src/components/onboarding.tsx b/src/components/onboarding.tsx
index 1a2b3c4..5d6e7f8 100644
--- a/src/components/onboarding.tsx
+++ b/src/components/onboarding.tsx
@@ -8,14 +8,11 @@ export function Onboarding({ onDone }: Props) {
   return (
     <section className="flex min-h-dvh flex-col justify-end gap-6 p-6">
       <CatMark className="size-16" />
-      <h1 className="text-3xl font-semibold">Welcome to Neko</h1>
-      <p className="text-muted">
-        Pair a host with Easy Pair, or skip and try the demo machines.
-      </p>
-      <button className="text-muted">Skip for now</button>
+      <h1 className="text-3xl font-semibold tracking-tight">Neko</h1>
+      <p className="text-muted">Demo hosts are ready. Steer agents from your phone.</p>
       <button onClick={onDone}>Open Home</button>
     </section>
   );
 }`;

export const CODEX_TICK_LINES: TermLine[] = [
  ln("  ✓ gate rejects missing user  ", "green", "4ms", "subtle"),
  ln("  ✓ gate scopes query by userId  ", "green", "3ms", "subtle"),
  ln("  ✓ 12 passed", "green"),
  ln(""),
  ln("Auth gate extracted. Tests are green.", "fg"),
];

export const FAKE_COMMANDS: Record<string, TermLine[]> = {
  ls: [
    ln("onboarding.tsx  ", "cyan", "chat-pane.tsx  ", "cyan", "terminal-pane.tsx", "cyan"),
    ln("store.ts        ", "cyan", "themes.ts      ", "cyan", "gate.ts", "cyan"),
  ],
  "git status": [
    ln("On branch main", "fg"),
    ln("Your branch is ahead of 'origin/main' by 1 commit.", "yellow"),
    ln("  (use \"git push\" to publish your local commits)", "muted"),
  ],
  "git diff --stat": [ln(" src/components/onboarding.tsx | 9 ", "fg", "+++------", "muted")],
  help: [
    ln("Try: ls, git status, claude, clear", "muted"),
    ln("Approvals: y / n   ·   Ctrl-C stops a turn", "muted"),
  ],
};
