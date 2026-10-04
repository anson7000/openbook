import DownloadIcon from "../assets/download_googleicons.svg?react";
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

  const handleExport = () => {
    window.print();
  };

  return (
    <nav
      aria-label="Canvas tools"
      className="sticky bottom-4 flex justify-center print:hidden"
    >
      <div className="flex border border-border rounded bg-background shadow-md p-1">
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
        <span aria-hidden="true" className="mx-1 w-px self-stretch bg-border" />
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center justify-center rounded p-4 transition-colors bg-background text-foreground hover:bg-muted"
        >
          <DownloadIcon
            aria-hidden="true"
            focusable="false"
            className="size-6"
          />
          <span className="sr-only">Export PDF</span>
        </button>
      </div>
    </nav>
  );
}
