import { useEffect, useState } from "react";
import { BASE_FONT_SIZE_PX } from "../lib/fontSizeStrut";
import { useEditorStore } from "../store/useEditorStore";

type MarkState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontSize: string;
};

const inactiveMarks: MarkState = {
  bold: false,
  italic: false,
  underline: false,
  fontSize: "",
};

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 32, 48, 60, 72, 96];

const BASE_FONT_SIZE = `${BASE_FONT_SIZE_PX}px`;

export default function RightPanel() {
  const { selectedEditor: editor } = useEditorStore();
  const [marks, setMarks] = useState(inactiveMarks);

  useEffect(() => {
    if (!editor) {
      setMarks(inactiveMarks);
      return;
    }

    const updateMarks = () => {
      setMarks({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        fontSize: (editor.getAttributes("textStyle").fontSize as string) ?? "",
      });
    };

    updateMarks();
    editor.on("selectionUpdate", updateMarks);
    editor.on("transaction", updateMarks);

    return () => {
      editor.off("selectionUpdate", updateMarks);
      editor.off("transaction", updateMarks);
    };
  }, [editor]);

  const formatButtonClass =
    "flex size-9 items-center justify-center rounded text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40";

  const fontSizeOptions = FONT_SIZES.map((size) => `${size}px`);
  if (marks.fontSize && !fontSizeOptions.includes(marks.fontSize)) {
    fontSizeOptions.unshift(marks.fontSize);
  }

  const applyFontSize = (fontSize: string) => {
    if (!editor) return;

    editor.chain().focus().setFontSize(fontSize).run();
  };

  const currentFontSize = Number.parseFloat(marks.fontSize || BASE_FONT_SIZE);

  const nextFontSize = (direction: -1 | 1) => {
    const sizes =
      direction > 0
        ? FONT_SIZES.filter((size) => size > currentFontSize)
        : FONT_SIZES.filter((size) => size < currentFontSize);
    const next = direction > 0 ? sizes[0] : sizes.at(-1);

    return next === undefined ? null : `${next}px`;
  };

  const smallerFontSize = nextFontSize(-1);
  const largerFontSize = nextFontSize(1);

  return (
    <aside
      aria-label="Formatting panel"
      className="h-full w-80 shrink-0 border-l bg-background p-6"
    >
      <div
        className="mt-4 flex gap-1"
        role="toolbar"
        aria-label="Text formatting"
      >
        <button
          type="button"
          className={`${formatButtonClass} font-bold ${
            marks.bold ? "bg-muted" : ""
          }`}
          aria-label="Bold"
          aria-pressed={marks.bold}
          title="Bold"
          disabled={!editor}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={`${formatButtonClass} italic ${
            marks.italic ? "bg-muted" : ""
          }`}
          aria-label="Italic"
          aria-pressed={marks.italic}
          title="Italic"
          disabled={!editor}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className={`${formatButtonClass} underline ${
            marks.underline ? "bg-muted" : ""
          }`}
          aria-label="Underline"
          aria-pressed={marks.underline}
          title="Underline"
          disabled={!editor}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
        <button
          type="button"
          className={formatButtonClass}
          aria-label="Decrease font size"
          title="Decrease font size"
          disabled={!editor || !smallerFontSize}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (smallerFontSize) applyFontSize(smallerFontSize);
          }}
        >
          -
        </button>
        <select
          aria-label="Font size"
          title="Font size"
          className="h-9 rounded border bg-background px-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          value={marks.fontSize || BASE_FONT_SIZE}
          disabled={!editor}
          onChange={(event) => applyFontSize(event.target.value)}
        >
          {fontSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={formatButtonClass}
          aria-label="Increase font size"
          title="Increase font size"
          disabled={!editor || !largerFontSize}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (largerFontSize) applyFontSize(largerFontSize);
          }}
        >
          +
        </button>
      </div>
      {!editor && (
        <p className="mt-3 text-sm text-muted-foreground">
          Select a text tile to format its content.
        </p>
      )}
    </aside>
  );
}
