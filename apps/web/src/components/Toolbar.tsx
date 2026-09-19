import { cn } from "../lib/utils";
import { useState } from "react";

const tools = [{ label: "Text" }, { label: "Image" }, { label: "Formula" }];

export default function Toolbar() {
  const [activeTool, setActiveTool] = useState<string>("Text");

  const handleToolClick = (toolLabel: string) => {
    setActiveTool(toolLabel);
  };

  return (
    <nav
      aria-label="Canvas tools"
      className="sticky bottom-4 flex justify-center"
    >
      <div className="flex border rounded bg-background shadow">
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={() => handleToolClick(tool.label)}
            className={cn(
              "rounded p-4 text-sm font-medium text-foreground transition-colors hover:bg-muted",
              activeTool === tool.label ? "bg-muted" : "bg-background",
            )}
            aria-pressed={activeTool === tool.label}
          >
            {tool.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
