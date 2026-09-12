# Status — 12 Sep 2026

## Done (this chat)

Interactive **web spec** in `src/`. Playable demo of the product, not the shipping runtime.

Screens: onboarding, Home, session (Chat View + terminal), Inbox (swipe), Agents/usage, host detail (reconnect, Face ID keys), Settings, Shortcuts, Watch mock, Pro comparison.

Also: themes, Pro caps, push banner, dictation/BYOK gates, auto-attach overlay, add-host sheet, Jump To / diff / files / preview sheets.

Store is scripted (`src/lib/store.ts`, `src/lib/demo.ts`). Hosts are fake. Approvals do not touch a real git remote.

Brand: Neko, cat mark, mint accent. Not Moshi.

Repo docs: `NATIVE.md`, `AGENTS.md`, `GROK_PROMPT.md`, `HANDOFF.md`.

## Not started (your computer)

| Phase | Work | Exit |
|---|---|---|
| 0 | `protocol/` + `neko-hook` (Go) | `go test ./...` and `neko-hook doctor` green with tmux |
| 1 | iOS SSH PTY + Keychain + Face ID | type `tmux ls` on a real host from the phone |
| 2 | Mux list, Jump To, auto-attach, Easy Pair QR | drop network, reconnect, same pane |
| 3 | Agent detect, Chat View, Inbox, Approve/Deny | approve a real Claude `git push` from the phone |
| 4 | Diff, files, preview, Watch, StoreKit Pro, iCloud settings | spec parity |
| 5 | Android + Mosh + Eternal Terminal | later |

## First native commit should

1. Move `src/` → `spec/` (reference only).
2. Add `protocol/` and `hook/`.
3. Leave the web demo frozen.

## Do not treat as source of truth

- `src/lib/store.ts` `tick()`, `FAKE_COMMANDS`, seed hosts
- TanStack Start / Vite / zustand
- Any sandbox PWA / preview-bridge leftovers (none should be in this repo)
