import { SettingsScreen } from "@/components/settings-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({ component: SettingsScreen });
