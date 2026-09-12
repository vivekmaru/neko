import { applyTheme, THEME_BY_ID } from "@/lib/themes";
import { useNeko } from "@/lib/store";
import { useEffect } from "react";

export function ThemeRoot({ children }: { children: React.ReactNode }) {
  const hydrate = useNeko((s) => s.hydrate);
  const ready = useNeko((s) => s.ready);
  const themeId = useNeko((s) => s.settings.themeId);
  const font = useNeko((s) => s.settings.font);
  const tick = useNeko((s) => s.tick);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!ready) return;
    const theme = THEME_BY_ID[themeId] ?? THEME_BY_ID.neko;
    if (theme) applyTheme(theme);
    document.documentElement.dataset.font = font;
  }, [ready, themeId, font]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => tick(), 1400);
    return () => window.clearInterval(id);
  }, [ready, tick]);

  return <>{children}</>;
}
