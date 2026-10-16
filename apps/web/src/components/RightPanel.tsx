import { useEffect, useState } from "react";
import { useEditorStore } from "../store/useEditorStore";

type MarkState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

const inactiveMarks: MarkState = {
  bold: false,
  italic: false,
  underline: false,
};

export default function RightPanel() {
  const editor = useEditorStore((state) => state.activeEditor);
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

  return (
    <aside
      aria-label="Formatting panel"
      className="h-full w-80 shrink-0 border-l bg-background p-6"
    >
      <div className="mt-4 flex gap-1" role="toolbar" aria-label="Text formatting">
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
      </div>
      {!editor && (
        <p className="mt-3 text-sm text-muted-foreground">
          Select a text tile to format its content.
        </p>
      )}
    </aside>
  );
}
