# Neko

Mobile agent terminal (iOS first). The phone attaches to shells and coding agents on the user’s machines via `neko-hook`.

This is **not** a web demo and **not** an App Builder sandbox. There is no requirement to bind port 8080 or keep a Vite preview alive.

## Source of truth

1. `NATIVE.md` — architecture, protocol, phases. Follow phase order.
2. `src/` — interactive web UI. Screens and tokens to port. Not the runtime. Move to `spec/` on the first native commit.
3. `src/lib/types.ts` — protocol field names.
4. `src/lib/demo.ts` — golden-path fixtures, not seed data to ship.
5. `src/lib/themes.ts` — palettes.
6. `src/lib/pro.ts` — Free vs Pro caps.

## Stack

- Protocol: versioned JSON lines (Go structs + Swift Codable generated from one schema)
- Hook: Go daemon, user-level service, no root required
- iOS: SwiftUI, iOS 17+, keys in Keychain, SSH from the device
- Android: later, same protocol
- Do not introduce a cloud box that proxies PTY bytes

## Working rules

- Phase 0 tests before any Swift UI.
- Do not port `store.ts` `tick()` / fake commands.
- Do not copy Moshi names, assets, or marketing.
- Keep Neko branding (cat mark, themes).
- Every protocol event in `NATIVE.md` should have a fixture test.
- Speak in product terms in commit messages.

## First command after clone

Implement **Phase 0** in `NATIVE.md`: protocol package + `neko-hook setup|run|doctor` that lists tmux sessions on the local machine, with tests.
