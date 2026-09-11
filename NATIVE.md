# Neko — native product plan

Neko is a **mobile agent terminal**: a phone (and Watch) client that attaches to shells and coding agents running on *your* machines. The web app in this repo is the **interactive spec** — information architecture, themes, Pro surface, and golden-path UX. It is not the shipping runtime.

Do **not** clone Moshi’s name, mark, copy, or assets. Keep the Neko name, cat mark, and original copy.

The web store (`src/lib/store.ts`, `src/lib/demo.ts`) is a **scripted demo**. Native work replaces that with a real hook + transports. Keep the screens; throw away `tick()`.

---

## Goal

Ship an iOS app (Android to follow) that can:

1. Pair a Mac/Linux host via QR / setup command
2. Open a real PTY over SSH (then Mosh, then Eternal Terminal)
3. Attach tmux / herdr / zellij sessions and jump windows
4. Detect hooked agents (Claude Code, Codex, OpenCode, Grok Build, …)
5. Show Chat View, inbox, usage, diffs, approvals
6. Approve/deny from the phone and from Apple Watch
7. Protect keys with Keychain + biometrics
8. Gate extras behind Neko Pro (StoreKit)

---

## Repo layout to create

```
neko/
  AGENTS.md                 # this project's conventions for Grok Build
  NATIVE.md                 # this file
  GROK_PROMPT.md            # paste this to start
  protocol/                 # shared JSON schema + TS + Swift + Kotlin types
  hook/                     # neko-hook daemon (Go)
  apps/ios/                 # SwiftUI client
  apps/android/             # later
  apps/watch/               # WatchKit extension of iOS
  spec/                     # copy of the current web UI (reference only)
```

Move the current web app into `spec/` on the first native commit. Do not keep building features in the web demo.

---

## Architecture

The **phone never runs the agent**. The agent runs in a mux pane on the host. The hook watches that pane and speaks the Neko protocol. The phone is a terminal + control surface.

### Transports

| Name | When | Notes |
|---|---|---|
| SSH | MVP | libssh / SwiftNIO SSH / NMSSH. Keys in Keychain. |
| Mosh | Pro | UDP, state sync. Hard. Do not fake it. |
| Eternal Terminal | Pro | TCP, reconnect. After SSH is solid. |
| Auto | Prefer Mosh if server has `mosh-server`, else ET, else SSH |

### Mux

Talk to them via their control sockets, not by scraping.

- tmux: `tmux -L <socket> list-sessions / list-windows / list-panes`, `attach -t`
- zellij: `zellij list-sessions`, `attach`
- herdr: follow herdr’s documented control API (treat as tmux-like in protocol)
- shell: a bare PTY if no mux

Auto-attach = on reconnect, attach the last `(session, window, pane)` tuple stored on the phone.

---

## Protocol (Phase 0 — do this first)

JSON lines, one object per line, versioned.

```json
{ "v": 1, "t": "hello", "hook": "0.1.0", "host": "studio-mac" }
```

### Phone → hook

| `t` | Payload | Purpose |
|---|---|---|
| `hello` | `client`, `proto` | handshake |
| `list_sessions` | | mux inventory |
| `attach` | `sessionId` | bind PTY |
| `input` | `bytes` (base64) or `text` | keystrokes |
| `resize` | `cols`, `rows` | pty winsize |
| `approve` / `deny` | `approvalId` | agent gate |
| `prompt` | `sessionId`, `text`, `image?` | Chat View send |
| `stop` | `sessionId` | Ctrl-C equivalent |
| `usage` | | ask for agent quotas |

### Hook → phone

| `t` | Payload | Maps to spec |
|---|---|---|
| `sessions` | `[{id,name,mux,pane,cwd,agent?,status,snippet}]` | Home, Jump To |
| `pty` | `sessionId`, `bytes` | Terminal pane |
| `chat` | `sessionId`, `message` | Chat View |
| `approval` | `id,sessionId,command,reason` | Inbox + Watch |
| `inbox` | `kind,title,body,sessionId` | Inbox + push |
| `usage` | `agent,used,limit,window` | Agents rings |
| `diff` | `sessionId`, `unified` | Diff viewer |
| `preview` | `sessionId`, `url` | Web preview |
| `status` | `sessionId`, `idle\|thinking\|working\|waiting\|offline` | Live Activity |

Reuse field names from `src/lib/types.ts`. That file is the schema seed.

Golden paths from `src/lib/demo.ts` become **protocol fixtures / integration tests**, not UI seed data:

1. Claude wants `git push origin main` → `approval` → phone Approve → hook sends `y` to the CLI → `inbox complete`
2. Codex running vitest → `status=working` → `chat.tool` running → tests pass → `status=idle` + push
3. Host drop → sessions `offline` → reconnect + auto-attach last tmux pane

---

## Hook (`neko-hook`)

**Language: Go.** Single static binary. Easy `curl | bash` install.

```
neko-hook setup          # generate host key, print QR / pairing blob
neko-hook run            # launchd / systemd user service
neko-hook status
neko-hook doctor
```

`setup` should:

1. Create `~/.neko/hook.json` (host id, name, mux sockets)
2. Install a user service
3. Print a pairing payload: `{ host, user, port, fingerprint, pairingSecret, mux }`
4. Encode that as QR (phone Easy Pair already exists in the spec)

The hook’s jobs while `run`ning:

- Discover tmux/zellij/herdr sessions every ~1s
- For each pane, detect agent CLIs by process name + argv (`claude`, `codex`, `opencode`, `grok`)
- PTY-sniff or use each agent’s documented control/ACP/hook if it has one (prefer official APIs over scraping)
- Forward PTY bytes when the phone is attached
- Emit `approval` when the agent asks `y/n` for a dangerous command
- Track token usage if the CLI exposes it; otherwise omit rather than invent numbers

**Do not** proxy arbitrary internet SSH through a cloud server. The phone connects **directly** to the host (Tailscale, public IP, or LAN).

---

## iOS app

**SwiftUI, iOS 17+, Swift 6.** One window, iPhone-first, iPad later.

- Terminal rendering: SwiftTerm
- SSH: SwiftNIO SSH or Citadel — **not** shelling out
- Keys: SecKey in Secure Enclave / Keychain. Face ID via LocalAuthentication
- Pairing: Camera QR + paste blob
- Watch: WatchKit companion, Crown = next session
- Billing: StoreKit 2 for Neko Pro

Screens to port from spec (1:1 IA, not 1:1 React): Home, Session, Inbox, Agents, Settings, Watch, Shortcuts, Pro, Host.

Themes: port `src/lib/themes.ts` 1:1. One theme drives chrome **and** terminal.

### What not to port

- `tick()`, `FAKE_COMMANDS`, seed hosts
- TanStack Start, Vite, zustand
- Sandbox PWA / grok preview bridge
- Auth/db helpers from the web scaffold

---

## Phases (execute in order)

### Phase 0 — Protocol + hook (1–2 weeks)

- `protocol/` JSON schema, Go structs, Swift Codable, golden fixtures from demo flows
- `neko-hook setup|run|doctor`
- **Exit:** `neko-hook doctor` green on a Mac with tmux

### Phase 1 — iOS SSH terminal (2–3 weeks)

- Pair host, SSH PTY, Keychain + Face ID
- **Exit:** type `tmux ls` on a real host from the phone

### Phase 2 — Mux + auto-attach (1–2 weeks)

- Session list from hook, Jump To, auto-attach last pane, Easy Pair QR
- **Exit:** kill network, reconnect, land in the same tmux pane

### Phase 3 — Agents (2–3 weeks)

- Detect CLIs, Chat View, Inbox, Approve/Deny, usage rings
- **Exit:** approve a Claude `git push` from the phone

### Phase 4 — Spec parity (2 weeks)

- Diff, files, preview, image paste, shortcuts, gestures, themes, Watch, StoreKit Pro, iCloud hosts+settings only

### Phase 5 — Android + Mosh/ET

---

## Security

- Private keys never leave Keychain
- Host fingerprints pinned after first connect
- Pairing secret is one-time, 10 minutes
- No cloud proxy that can see PTY bytes

## Grok Build CLI

Clone this repo, run `grok`, paste `GROK_PROMPT.md`. Follow phase order. Do not start iOS UI before Phase 0 tests pass. Never add a cloud SSH proxy. Never use Moshi trademarks.
