import { CatMark } from "@/components/cat-mark";
import { useNeko } from "@/lib/store";

export function Onboarding() {
  const patch = useNeko((s) => s.patchSettings);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-bg text-fg">
      <div className="flex w-full max-w-md flex-1 flex-col justify-end gap-5 p-6 pb-10 lg:justify-center">
        <div className="stagger-in flex flex-col gap-5">
          <CatMark className="size-16" />
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Neko</p>
            <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-tight">
              A terminal built for phones
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Watch agents on machines you already run. This preview ships with live demo hosts — Claude, Codex, and Grok Build are already in session.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
              Inbox approvals without opening a laptop
            </li>
            <li className="flex gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
              Chat View over the same tmux pane
            </li>
            <li className="flex gap-2">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent" />
              Themes, usage rings, and Easy Pair
            </li>
          </ul>
          <button
            type="button"
            className="press mt-2 min-h-12 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-fg"
            onClick={() => patch({ onboarded: true })}
          >
            Open Home
          </button>
        </div>
      </div>
    </div>
  );
}
