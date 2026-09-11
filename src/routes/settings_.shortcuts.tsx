import { ShortcutsScreen } from "@/components/shortcuts-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings_/shortcuts")({ component: ShortcutsScreen });
