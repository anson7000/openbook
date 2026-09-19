import { cn } from "../lib/utils";
import { useEditorStore } from "../store/useEditorStore";

const tools = [
  { label: "Select", mode: "select" },
  { label: "Text", mode: "text" },
  { label: "Image", mode: "image" },
  { label: "Formula", mode: "formula" },
];

export default function Toolbar() {
  const { mode, setMode } = useEditorStore();

  const handleToolClick = (mode: string) => {
    setMode(mode as "select" | "text" | "image" | "formula");
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
            onClick={() => handleToolClick(tool.mode)}
            className={cn(
              "rounded p-4 text-sm font-medium text-foreground transition-colors hover:bg-muted",
              mode === tool.mode ? "bg-muted" : "bg-background",
            )}
            aria-pressed={mode === tool.mode}
          >
            {tool.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
