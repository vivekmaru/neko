import { HostScreen } from "@/components/host-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/host/$id")({
  component: HostPage,
});

function HostPage() {
  const { id } = Route.useParams();
  return <HostScreen id={id} />;
}
