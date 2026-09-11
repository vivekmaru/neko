import { InboxScreen } from "@/components/inbox-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/inbox")({ component: InboxScreen });
