# Neko

Phone client + host hook for steering coding agents on your own machines.

This repo is the **interactive spec** (web UI you already tried) plus the **native plan**. The web store still talks to fake hosts. Native work replaces that. Do not ship the demo store.

Private repo: [vivekmaru/neko](https://github.com/vivekmaru/neko).

## What's in here

| Path | What |
|---|---|
| `src/` | Web spec — Home, Chat View, Inbox, Agents, Watch, Pro |
| `NATIVE.md` | Full native plan (protocol, hook, iOS, phases) |
| `AGENTS.md` | Conventions for Grok Build |
| `GROK_PROMPT.md` | Paste this into `grok` to start Phase 0 |

## Continue with Grok Build

1. Clone this repo.
2. Install [Grok Build](https://x.ai/build):

   ```bash
   curl -fsSL https://x.ai/cli/install.sh | bash
   ```

   Windows: `irm https://x.ai/cli/install.ps1 | iex`

3. `cd neko`, run `grok`, paste `GROK_PROMPT.md`.
4. You will also want Go 1.23+ and, for Phase 1, Xcode 16+ on a Mac.

## Product in one sentence

Neko is the phone; `neko-hook` is on the Mac/Linux box; Claude/Codex/Grok run in tmux there; approvals and inbox come back to the wrist.
