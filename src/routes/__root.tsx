import { AppFrame } from "@/components/app-frame";
import { Onboarding } from "@/components/onboarding";
import { useNeko } from "@/lib/store";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Neko";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0c0e12" },
      { name: "description", content: "Mobile terminal for AI coding agents" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <AppFrame>
          <ShellOutlet />
        </AppFrame>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--fg)",
              border: "1px solid color-mix(in oklab, var(--fg) 12%, transparent)",
            },
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

function ShellOutlet() {
  const onboarded = useNeko((s) => s.settings.onboarded);
  return (
    <>
      {!onboarded ? <Onboarding /> : null}
      <Outlet />
    </>
  );
}
