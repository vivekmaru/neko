import { CatMark } from "@/components/cat-mark";
import { useNeko } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function PushBanner() {
  const push = useNeko((s) => s.push);
  const dismiss = useNeko((s) => s.dismissPush);
  const navigate = useNavigate();

  useEffect(() => {
    if (!push) return;
    const t = window.setTimeout(() => dismiss(), 5200);
    return () => window.clearTimeout(t);
  }, [push, dismiss]);

  if (!push) return null;

  return (
    <button
      type="button"
      className="push-banner press fixed top-3 right-3 left-3 z-50 mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-border bg-surface/95 px-3 py-3 text-left shadow-lg backdrop-blur-md"
      onClick={() => {
        if (push.sessionId) void navigate({ to: "/session/$id", params: { id: push.sessionId } });
        dismiss();
      }}
    >
      <CatMark className="mt-0.5 size-8 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-wide text-muted">Neko</p>
        <p className="text-sm font-medium">{push.title}</p>
        <p className="truncate text-xs text-muted">{push.body}</p>
      </div>
    </button>
  );
}
