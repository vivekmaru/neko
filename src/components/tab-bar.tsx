import { cn } from "@/lib/cn";
import { useNeko } from "@/lib/store";
import { Link, useRouterState } from "@tanstack/react-router";
import { Inbox, LayoutGrid, Settings2, SquareTerminal } from "lucide-react";

const TABS = [
  { to: "/", label: "Home", icon: SquareTerminal },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/agents", label: "Agents", icon: LayoutGrid },
  { to: "/settings", label: "Settings", icon: Settings2 },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = useNeko((s) => s.inbox.filter((i) => !i.read).length);

  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <ul className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={cn(
                  "press flex min-h-12 flex-col items-center justify-center gap-0.5 pt-1.5 pb-2 text-[10px] font-medium tracking-wide",
                  active ? "text-fg" : "text-muted",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  {tab.to === "/inbox" && unread > 0 ? (
                    <span className="absolute -top-1 -right-2 min-w-3.5 rounded-full bg-orange px-1 text-[9px] leading-none font-semibold text-accent-fg tabular-nums">
                      {unread}
                    </span>
                  ) : null}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = useNeko((s) => s.inbox.filter((i) => !i.read).length);

  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center gap-1 border-r border-border py-4 lg:flex xl:w-56 xl:items-stretch xl:px-3">
      {TABS.map((tab) => {
        const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              "press relative flex min-h-11 items-center justify-center gap-3 rounded-md px-3 text-sm font-medium xl:justify-start",
              active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface hover:text-fg",
            )}
          >
            <span className="relative">
              <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
              {tab.to === "/inbox" && unread > 0 ? (
                <span className="absolute -top-1 -right-2 min-w-3.5 rounded-full bg-orange px-1 text-[9px] leading-none font-semibold text-accent-fg tabular-nums xl:hidden">
                  {unread}
                </span>
              ) : null}
            </span>
            <span className="hidden xl:inline">{tab.label}</span>
            {tab.to === "/inbox" && unread > 0 ? (
              <span className="ml-auto hidden rounded-full bg-orange px-1.5 text-[10px] font-semibold text-accent-fg tabular-nums xl:inline">
                {unread}
              </span>
            ) : null}
          </Link>
        );
      })}
    </aside>
  );
}
