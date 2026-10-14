import { createFileRoute } from "@tanstack/react-router";
import Canvas from "../components/Canvas";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen">
      <Canvas />
    </div>
  );
}
