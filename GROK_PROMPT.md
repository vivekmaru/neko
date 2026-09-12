Read HANDOFF.md, STATUS.md, AGENTS.md, and NATIVE.md all the way through before writing code.

This repo is Neko — a legally distinct mobile agent terminal (phone + Watch + host hook). The web UI in src/ is a finished interactive spec: Home, Chat View, Inbox, Agents, Settings, Shortcuts, Watch, Pro, host detail. It is not the shipping runtime.

Current state (12 Sep 2026): spec UI complete. protocol/ and hook/ do not exist. No Swift yet.

Do not rebuild, restyle, or add features to the web demo. Do not port store.ts tick() or fake hosts. Do not add a cloud SSH proxy. Do not use the name Moshi or copy its assets.

Start Phase 0 from NATIVE.md, and only Phase 0:

1. Move src/ to spec/ so the web UI is frozen reference.
2. Create protocol/ — JSON-lines schema (v=1 events in NATIVE.md). Seed field names from spec/lib/types.ts (or src/lib/types.ts if you have not moved it yet).
3. Add golden fixtures from the Claude approval, Codex test-run, and reconnect flows in spec/lib/demo.ts.
4. Create hook/ as a Go module: neko-hook setup | run | doctor. doctor must detect tmux and print sessions. setup writes ~/.neko/hook.json and prints a pairing blob.
5. go test ./... must pass. Every protocol event in NATIVE.md needs a fixture test.
6. Stop at the Phase 0 exit criteria. Do not start Xcode, Watch, StoreKit, Mosh, or Android until doctor is green on a machine with tmux.

When Phase 0 is done, continue Phase 1 from NATIVE.md (iOS SSH PTY + Keychain keys).
