import { createFileRoute } from "@tanstack/react-router";
import { BicaApp } from "@/components/bica/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <BicaApp />;
}
