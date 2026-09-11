import { HomeScreen } from "@/components/home-screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <HomeScreen />;
}
