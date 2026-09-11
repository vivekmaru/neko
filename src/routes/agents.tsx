import { AgentsScreen } from "@/components/agents-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/agents")({ component: AgentsScreen });
