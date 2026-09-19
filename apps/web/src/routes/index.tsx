import { createFileRoute } from "@tanstack/react-router";
import A4Canvas from "../components/A4Canvas";
import Toolbar from "../components/Toolbar";
import type { Block } from "../types";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const blocks: Block[] = [
    {
      id: "welcome",
      type: "text",
      x: 48,
      y: 48,
      width: 698,
      height: 48,
      content: "Hello, this is an A4 canvas. You can add your content here.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-muted p-2">
      <A4Canvas initialBlocks={blocks} />
      <Toolbar />
    </div>
  );
}
