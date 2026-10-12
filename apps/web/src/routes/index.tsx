import { createFileRoute } from "@tanstack/react-router";
import Canvas from "../components/Canvas";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-muted my-10 print:min-h-0 print:bg-transparent print:p-0">
      <Canvas />
    </div>
  );
}
