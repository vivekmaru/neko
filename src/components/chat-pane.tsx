import { AgentMark } from "@/components/agent-mark";
import { AGENTS } from "@/lib/agents";
import { cn } from "@/lib/cn";
import { useNeko } from "@/lib/store";
import type { ChatMessage, Session } from "@/lib/types";
import { Check, ChevronDown, LoaderCircle, SquareTerminal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ChatPane({ session }: { session: Session }) {
  const approve = useNeko((s) => s.approve);
  const deny = useNeko((s) => s.deny);
  const stopTurn = useNeko((s) => s.stopTurn);
  const bottom = useRef<HTMLDivElement>(null);
  const agent = session.agent ? AGENTS[session.agent] : null;

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [session.messages.length, session.status]);

  return (
    <div className="flex h-full flex-col bg-bg">
      <div className="term-scroll min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {session.messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
          {session.status === "thinking" || session.status === "working" ? (
            <div className="flex items-center gap-2 text-xs text-muted">
              <LoaderCircle className="size-3.5 animate-spin" />
              <span className="shimmer font-medium">{session.status === "thinking" ? "Thinking" : "Working"}</span>
              <button type="button" className="ml-1 text-subtle" onClick={() => stopTurn(session.id)} aria-label="Stop">
                <X className="size-3.5" />
              </button>
            </div>
          ) : null}
          <div ref={bottom} />
        </div>
      </div>
      {session.pendingApproval ? (
        <div className="border-t border-border bg-surface px-3 py-3">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs text-muted">{agent?.name} needs approval</p>
            <p className="mt-1 font-mono text-sm">{session.pendingApproval.command}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="press min-h-11 rounded-md bg-accent text-sm font-semibold text-accent-fg"
                onClick={() => approve(session.id)}
              >
                Approve
              </button>
              <button
                type="button"
                className="press min-h-11 rounded-md border border-border bg-surface-2 text-sm font-medium"
                onClick={() => deny(session.id)}
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Message({ message }: { message: ChatMessage }) {
  if (message.kind === "user") {
    return (
      <div className="ml-auto w-4/5 rounded-lg rounded-br-xs bg-surface-2 px-3 py-2 text-sm leading-relaxed">
        {message.image ? (
          <img src={message.image} alt="" className="mb-2 max-h-40 rounded-sm object-cover" />
        ) : null}
        {message.text}
      </div>
    );
  }
  if (message.kind === "assistant") {
    return (
      <div className="mr-4 text-sm leading-relaxed text-fg">
        {message.thinking ? <p className="mb-2 text-xs text-subtle italic">{message.thinking}</p> : null}
        {message.text}
      </div>
    );
  }
  if (message.kind === "plan") {
    return (
      <div className="rounded-md border border-border bg-surface px-3 py-2.5">
        <p className="mb-1 text-[11px] font-medium tracking-wide text-muted uppercase">Plan</p>
        <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">{message.text}</pre>
      </div>
    );
  }
  if (message.kind === "approval") {
    return (
      <div className="rounded-md border border-orange/40 bg-orange/10 px-3 py-2.5">
        <p className="text-[11px] font-medium text-orange uppercase">Approval</p>
        <p className="mt-1 font-mono text-sm">{message.command}</p>
        <p className="mt-1 text-xs text-muted">{message.reason}</p>
      </div>
    );
  }
  return <ToolCard message={message} />;
}

function ToolCard({ message }: { message: Extract<ChatMessage, { kind: "tool" }> }) {
  const [open, setOpen] = useState(false);
  const icon =
    message.status === "running" ? (
      <LoaderCircle className="size-3.5 animate-spin text-yellow" />
    ) : message.status === "fail" ? (
      <X className="size-3.5 text-red" />
    ) : (
      <Check className="size-3.5 text-green" />
    );
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={cn(
        "w-full rounded-md border border-border bg-surface px-3 py-2 text-left",
        message.status === "fail" && "border-red/40",
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <SquareTerminal className="size-3.5 text-muted" />
        <span className="min-w-0 flex-1 truncate text-sm">{message.title}</span>
        <ChevronDown className={cn("size-3.5 text-subtle transition-transform", open && "rotate-180")} />
      </div>
      {open ? (
        <div className="mt-2 font-mono text-[11px] leading-5 text-muted">
          {message.detail}
          {message.diff ? <pre className="mt-2 overflow-x-auto text-fg">{message.diff}</pre> : null}
        </div>
      ) : (
        <p className="mt-1 truncate font-mono text-[11px] text-subtle">{message.detail}</p>
      )}
    </button>
  );
}

export function SessionIdentity({ session }: { session: Session }) {
  const agent = session.agent ? AGENTS[session.agent] : null;
  return (
    <div className="flex min-w-0 items-center gap-2">
      <AgentMark id={session.agent} size="sm" />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium leading-tight">{agent?.name ?? session.name}</div>
        <div className="truncate text-[11px] text-muted">
          {session.mux} {session.pane}
          {session.model ? ` · ${session.model}` : ""}
          {session.branch ? ` · ${session.branch}` : ""}
        </div>
      </div>
    </div>
  );
}
