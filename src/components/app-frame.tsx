import { SideNav, TabBar } from "@/components/tab-bar";
import { PushBanner } from "@/components/push-banner";
import { ThemeRoot } from "@/components/theme-root";
import { useRouterState } from "@tanstack/react-router";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isSession = pathname.startsWith("/session");

  return (
    <ThemeRoot>
      <div className="flex min-h-dvh bg-bg text-fg">
        <SideNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <PushBanner />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          {!isSession ? <TabBar /> : null}
        </div>
      </div>
    </ThemeRoot>
  );
}
