import { SessionScreen } from "@/components/session-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/session/$id")({
  component: SessionPage,
});

function SessionPage() {
  const { id } = Route.useParams();
  return <SessionScreen id={id} />;
}
