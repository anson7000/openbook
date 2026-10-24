import { createFileRoute } from "@tanstack/react-router";
import Canvas from "../components/Canvas";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden">
      <LeftPanel />
      <Canvas />
      <RightPanel />
    </div>
  );
}
