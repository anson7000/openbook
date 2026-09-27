import formulaIcon from "../assets/formula_googleicons.svg?react";
import imageIcon from "../assets/image_googleicons.svg?react";
import selectIcon from "../assets/select_googleicons.svg?react";
import textIcon from "../assets/text_googleicons.svg?react";
import { cn } from "../lib/utils";
import { useEditorStore } from "../store/useEditorStore";
import type { EditorMode, Tool } from "../types";

const tools: Tool[] = [
  { label: "Select", mode: "select", icon: selectIcon },
  { label: "Text", mode: "text", icon: textIcon },
  { label: "Image", mode: "image", icon: imageIcon },
  { label: "Formula", mode: "formula", icon: formulaIcon },
];

export default function Toolbar() {
  const { mode, setMode } = useEditorStore();

  const handleToolClick = (mode: EditorMode) => {
    setMode(mode);
  };

  return (
    <nav
      aria-label="Canvas tools"
      className="sticky bottom-4 flex justify-center"
    >
      <div className="flex border rounded bg-background shadow">
        {tools.map(({ label, mode: toolMode, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleToolClick(toolMode)}
            className={cn(
              "flex items-center justify-center rounded p-4 transition-colors",
              mode === toolMode
                ? "bg-selected text-selected-foreground"
                : "bg-background text-foreground hover:bg-muted",
            )}
            aria-pressed={mode === toolMode}
          >
            <Icon aria-hidden="true" focusable="false" className="size-6" />
            <span className="sr-only">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
