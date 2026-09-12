import { ChatPane, SessionIdentity } from "@/components/chat-pane";
import { Composer } from "@/components/composer";
import { KeyboardToolbar } from "@/components/keyboard-toolbar";
import { DiffSheet } from "@/components/sheets/diff-sheet";
import { FilesSheet } from "@/components/sheets/files-sheet";
import { JumpTo } from "@/components/sheets/jump-to";
import { PreviewSheet } from "@/components/sheets/preview-sheet";
import { StatusDot, statusLabel } from "@/components/status-dot";
import { TerminalPane } from "@/components/terminal-pane";
import { useNeko } from "@/lib/store";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Eye, FolderTree, GitBranch, LayoutGrid, MessageSquare, SquareTerminal } from "lucide-react";
import { useEffect, useState } from "react";

export function SessionScreen({ id }: { id: string }) {
  const session = useNeko((s) => s.sessions.find((x) => x.id === id));
  const host = useNeko((s) => s.hosts.find((h) => h.id === session?.hostId));
  const connectingId = useNeko((s) => s.connectingId);
  const endConnect = useNeko((s) => s.endConnect);
  const setView = useNeko((s) => s.setView);
  const chatEnabled = useNeko((s) => s.settings.chatEnabled);
  const autoAttach = useNeko((s) => s.settings.autoAttach);
  const stopTurn = useNeko((s) => s.stopTurn);
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<"jump" | "diff" | "files" | "preview" | null>(null);

  useEffect(() => {
    if (!connectingId) return;
    const t = window.setTimeout(() => endConnect(), 700);
    return () => window.clearTimeout(t);
  }, [connectingId, endConnect]);

  if (!session || !host) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <p className="text-sm text-muted">Session not found.</p>
        <Link to="/" className="text-sm text-accent">
          Back to Home
        </Link>
      </div>
    );
  }

  const chat = chatEnabled && session.view === "chat" && !!session.agent;
  const connecting = connectingId === session.id;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-bg">
      <header className="flex items-center gap-1 border-b border-border px-1 py-1.5">
        <button
          type="button"
          className="press flex size-11 items-center justify-center text-fg"
          aria-label="Back"
          onClick={() => void navigate({ to: "/" })}
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <SessionIdentity session={session} />
        </div>
        <span className="hidden items-center gap-1 pr-1 text-[11px] text-muted sm:flex">
          <StatusDot status={session.status} />
          {statusLabel(session.status)}
        </span>
        {session.agent && chatEnabled ? (
          <IconBtn
            label={chat ? "Terminal" : "Chat View"}
            onClick={() => setView(session.id, chat ? "terminal" : "chat")}
          >
            {chat ? <SquareTerminal className="size-5" /> : <MessageSquare className="size-5" />}
          </IconBtn>
        ) : null}
        <IconBtn label="Jump To" onClick={() => setSheet("jump")}>
          <LayoutGrid className="size-5" />
        </IconBtn>
        <IconBtn label="Diff" onClick={() => setSheet("diff")}>
          <GitBranch className="size-5" />
        </IconBtn>
        <span className="hidden sm:contents">
          <IconBtn label="Files" onClick={() => setSheet("files")}>
            <FolderTree className="size-5" />
          </IconBtn>
          <IconBtn label="Preview" onClick={() => setSheet("preview")}>
            <Eye className="size-5" />
          </IconBtn>
        </span>
      </header>

      <div className="relative min-h-0 flex-1">
        {connecting ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-bg">
            <p className="font-mono text-sm text-accent">
              {host.transport} · {host.name}
            </p>
            <p className="text-xs text-muted">
              {autoAttach ? "auto-attaching" : "attaching"} {session.mux}:{session.pane}
            </p>
          </div>
        ) : null}
        <div className={chat ? "flex h-full" : "h-full"}>
          <div className={chat ? "min-w-0 flex-1" : "h-full"}>
            {chat ? <ChatPane session={session} /> : <TerminalPane session={session} />}
          </div>
          {chat ? (
            <div className="hidden h-full w-[42%] border-l border-border lg:block">
              <TerminalPane session={session} />
            </div>
          ) : null}
        </div>
      </div>

      {chat ? null : <KeyboardToolbar sessionId={session.id} />}
      <Composer sessionId={session.id} onStop={() => stopTurn(session.id)} />

      {sheet === "jump" ? <JumpTo onClose={() => setSheet(null)} /> : null}
      {sheet === "diff" ? <DiffSheet onClose={() => setSheet(null)} /> : null}
      {sheet === "files" ? <FilesSheet onClose={() => setSheet(null)} /> : null}
      {sheet === "preview" ? <PreviewSheet onClose={() => setSheet(null)} /> : null}
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} className="press flex size-10 items-center justify-center text-muted" onClick={onClick}>
      {children}
    </button>
  );
}
