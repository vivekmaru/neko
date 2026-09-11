Read AGENTS.md and NATIVE.md all the way through.

This repo is Neko, a legally distinct mobile agent terminal. The existing web UI in src/ is the interactive product spec — Home, Chat View, Inbox, Agents, Settings, Watch, Pro. It is not the shipping runtime.

Do not rebuild or restyle the web demo. Do not add a cloud SSH proxy. Do not use the name Moshi.

Start Phase 0 from NATIVE.md:

1. Create protocol/ with the JSON-lines schema (v=1 events listed in NATIVE.md). Seed field names from src/lib/types.ts.
2. Add golden fixtures from the Claude approval, Codex test-run, and reconnect flows in demo.ts.
3. Create hook/ as a Go module: neko-hook setup | run | doctor. doctor must detect tmux and print sessions.
4. go test ./... must pass.
5. Stop at the Phase 0 exit criteria. Do not start Xcode until that is green.

When Phase 0 is done, continue Phase 1 (iOS SSH PTY + Keychain keys) as specified in NATIVE.md.
