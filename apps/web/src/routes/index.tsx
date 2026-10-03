import { createFileRoute } from "@tanstack/react-router";
import Page from "../components/Page";
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
      x: 0,
      y: 0,
      width: 698,
      height: 48,
      content: "Hello, this is an A4 canvas. You can add your content here.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-muted p-2">
      <Page initialBlocks={blocks} />
      <Toolbar />
    </div>
  );
}
