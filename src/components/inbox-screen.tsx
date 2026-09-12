import { AgentMark } from "@/components/agent-mark";
import { useNeko } from "@/lib/store";
import type { AgentId, InboxActionId, InboxItem, InboxKind } from "@/lib/types";
import { useNavigate } from "@tanstack/react-router";
import { BellOff } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";

const KIND: Record<InboxKind, string> = {
  approval: "text-orange",
  question: "text-yellow",
  tool: "text-cyan",
  complete: "text-green",
  start: "text-muted",
};

export function InboxScreen() {
  const inbox = useNeko((s) => s.inbox);
  const sessions = useNeko((s) => s.sessions);
  const markInbox = useNeko((s) => s.markInbox);
  const markAllRead = useNeko((s) => s.markAllRead);
  const unread = inbox.filter((i) => !i.read).length;
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Inbox</h1>
          <p className="text-[11px] text-muted">{unread ? `${unread} need you` : "Caught up"}</p>
        </div>
        {unread ? (
          <button type="button" className="text-xs font-medium text-accent" onClick={markAllRead}>
            Mark all read
          </button>
        ) : null}
      </header>
      {inbox.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted">
          <BellOff className="size-6" />
          <p className="text-sm">No events yet</p>
        </div>
      ) : (
        <ul className="stagger-in min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          {inbox.map((item) => {
            const session = sessions.find((s) => s.id === item.sessionId);
            return (
              <InboxRow
                key={item.id}
                item={item}
                agent={session?.agent}
                onOpen={() => {
                  markInbox(item.id);
                  void navigate({ to: "/session/$id", params: { id: item.sessionId } });
                }}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

function InboxRow({
  item,
  agent,
  onOpen,
}: {
  item: InboxItem;
  agent?: AgentId;
  onOpen: () => void;
}) {
  const actions = useNeko((s) => s.settings.inboxActions);
  const approve = useNeko((s) => s.approve);
  const deny = useNeko((s) => s.deny);
  const archiveInbox = useNeko((s) => s.archiveInbox);
  const snoozeInbox = useNeko((s) => s.snoozeInbox);
  const startX = useRef<number | null>(null);
  const [x, setX] = useState(0);

  const shown: InboxActionId[] = actions.filter((a) => {
    if (a === "open") return false;
    if (a === "approve" || a === "deny") return item.kind === "approval";
    return true;
  });

  function run(id: InboxActionId) {
    if (id === "approve") approve(item.sessionId);
    if (id === "deny") deny(item.sessionId);
    if (id === "archive") archiveInbox(item.id);
    if (id === "snooze") {
      snoozeInbox(item.id);
      toast("Snoozed", { description: item.title });
    }
    if (id === "copy") {
      void navigator.clipboard?.writeText(`${item.title}\n${item.body}`);
      toast("Copied");
    }
    setX(0);
  }

  return (
    <li className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-y-0 right-0 flex">
        {shown.slice(0, 3).map((a) => (
          <button
            key={a}
            type="button"
            className={`min-w-16 px-3 text-[11px] font-medium ${
              a === "approve" ? "bg-green text-accent-fg" : a === "deny" || a === "archive" ? "bg-red text-accent-fg" : "bg-surface-2"
            }`}
            onClick={() => run(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="relative flex w-full items-start gap-3 bg-bg py-3 text-left"
        style={{ transform: `translateX(${x}px)`, transition: startX.current == null ? "transform 180ms ease" : undefined }}
        onClick={() => {
          if (Math.abs(x) > 12) {
            setX(0);
            return;
          }
          onOpen();
        }}
        onTouchStart={(e) => {
          startX.current = e.touches[0]?.clientX ?? 0;
        }}
        onTouchMove={(e) => {
          if (startX.current == null) return;
          const dx = (e.touches[0]?.clientX ?? 0) - startX.current;
          setX(Math.max(-168, Math.min(0, dx)));
        }}
        onTouchEnd={() => {
          startX.current = null;
          setX((v) => (v < -70 ? -168 : 0));
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") return;
          startX.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "touch" || startX.current == null) return;
          setX(Math.max(-168, Math.min(0, e.clientX - startX.current)));
        }}
        onPointerUp={(e) => {
          if (e.pointerType === "touch") return;
          startX.current = null;
          setX((v) => (v < -70 ? -168 : 0));
        }}
      >
        <AgentMark id={agent} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-medium uppercase ${KIND[item.kind]}`}>{item.kind}</span>
            {!item.read ? <span className="size-1.5 rounded-full bg-orange" /> : null}
          </div>
          <p className="text-sm font-medium">{item.title}</p>
          <p className="truncate text-xs text-muted">{item.body}</p>
        </div>
      </button>
    </li>
  );
}
