# Handoff — continue on your computer with Grok Build

This chat built the **interactive spec** (web UI). Native work cannot finish here — no Xcode, no real SSH, no Watch. Pick it up locally.

Repo: https://github.com/vivekmaru/neko  
Commit at handoff: `db3d279` plus this pack. Spec UI is complete. Native code is **not** started.

## 1. Machine

- macOS (Apple Silicon preferred) for Phase 1+
- Go 1.23+
- tmux (`brew install tmux`)
- Xcode 16+ only after Phase 0 is green
- SuperGrok or X Premium+ for Grok Build

Linux is fine for Phase 0 (protocol + hook). iOS needs a Mac.

## 2. Clone

```bash
git clone https://github.com/vivekmaru/neko.git
cd neko
```

If the repo is private, use SSH or a PAT:

```bash
git clone git@github.com:vivekmaru/neko.git
```

## 3. Install Grok Build

macOS / Linux:

```bash
curl -fsSL https://x.ai/cli/install.sh | bash
grok --version
```

Windows (Phase 0 only):

```powershell
irm https://x.ai/cli/install.ps1 | iex
```

Docs: https://docs.x.ai/build/overview

First launch opens a browser to sign in. Headless:

```bash
export XAI_API_KEY="xai-..."   # from console.x.ai
```

## 4. First session

```bash
cd neko
grok
```

Paste the entire contents of `GROK_PROMPT.md` as the first message.

Grok Build reads `AGENTS.md` automatically. Point it at `NATIVE.md` and `STATUS.md` if it drifts toward restyling the web demo.

Optional plan-first start:

```text
Read STATUS.md, AGENTS.md, NATIVE.md, GROK_PROMPT.md.
Plan Phase 0 only. Do not write Swift or restyle src/.
```

## 5. What success looks like this week

Phase 0 exit (from `NATIVE.md`):

- `protocol/` exists with JSON-lines schema + fixtures
- `hook/` is a Go module: `neko-hook setup | run | doctor`
- `go test ./...` passes
- `neko-hook doctor` is green on a machine that has tmux

Stop. Do not open Xcode until that is true.

## 6. Do not

- Rebuild or restyle the web spec in `src/`
- Port `store.ts` `tick()` / fake hosts
- Add a cloud box that proxies PTY bytes
- Use the name Moshi, or copy its assets/copy
- Start Watch / StoreKit / Mosh before Phase 3–4

## Read next

| File | Why |
|---|---|
| `STATUS.md` | Done vs not done |
| `GROK_PROMPT.md` | First paste |
| `AGENTS.md` | Conventions |
| `NATIVE.md` | Architecture + phases |
| `src/lib/types.ts` | Protocol field names |
| `src/lib/demo.ts` | Golden-path fixtures |
