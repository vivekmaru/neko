import type { AgentId } from "./types";

export const AGENTS: Record<
  AgentId,
  { id: AgentId; name: string; short: string; glyph: string; color: string }
> = {
  claude: { id: "claude", name: "Claude Code", short: "Claude", glyph: "C", color: "#d97757" },
  codex: { id: "codex", name: "Codex", short: "Codex", glyph: "X", color: "#5eead4" },
  opencode: { id: "opencode", name: "OpenCode", short: "OpenCode", glyph: "O", color: "#94a3b8" },
  grok: { id: "grok", name: "Grok Build", short: "Grok", glyph: "G", color: "#e8eaef" },
  cursor: { id: "cursor", name: "Cursor", short: "Cursor", glyph: "I", color: "#7aa2f7" },
  kimi: { id: "kimi", name: "Kimi", short: "Kimi", glyph: "K", color: "#86efac" },
  qwen: { id: "qwen", name: "Qwen Code", short: "Qwen", glyph: "Q", color: "#7dcfff" },
};

export const AGENT_LIST = Object.values(AGENTS);
