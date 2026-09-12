# Neko

Phone client + host hook for steering coding agents on your own machines.

This repo is the **interactive spec** (web UI) plus the **native plan**. The web store still talks to fake hosts. Native work replaces that. Do not ship the demo store.

Repo: [vivekmaru/neko](https://github.com/vivekmaru/neko)

## Continue on your computer

Follow **[HANDOFF.md](HANDOFF.md)** — clone, install Grok Build, paste `GROK_PROMPT.md`.

```bash
git clone https://github.com/vivekmaru/neko.git
cd neko
curl -fsSL https://x.ai/cli/install.sh | bash
grok
```

Then paste `GROK_PROMPT.md`. You want Go 1.23+ and tmux for Phase 0. Xcode 16+ only after Phase 0 is green.

## What's in here

| Path | What |
|---|---|
| `HANDOFF.md` | How to pick this up on a Mac |
| `STATUS.md` | Done vs not done |
| `src/` | Web spec — Home, Chat View, Inbox, Agents, Watch, Pro |
| `NATIVE.md` | Full native plan (protocol, hook, iOS, phases) |
| `AGENTS.md` | Conventions for Grok Build |
| `GROK_PROMPT.md` | First message to paste into `grok` |

## Product in one sentence

Neko is the phone; `neko-hook` is on the Mac/Linux box; Claude/Codex/Grok run in tmux there; approvals and inbox come back to the wrist.
