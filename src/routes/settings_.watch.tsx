import { WatchScreen } from "@/components/watch-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings_/watch")({ component: WatchScreen });
