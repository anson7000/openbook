import { useEffect, type MouseEvent } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEditorStore } from "../store/useEditorStore";

interface ContentProps {
  content: string;
  blockId: string;
}

const extensions = [StarterKit];

export default function Content({ content, blockId }: ContentProps) {
  const { selectedPageId, setPageBlockContent } = useEditorStore();
  const editor = useEditor({
    extensions,
    editable: false,
    content: content,
  });

  useEffect(() => {
    if (!editor || editor.isFocused || editor.getHTML() === content) return;

    editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  const handleDoubleClick = (event: MouseEvent) => {
    event.stopPropagation();

    editor.setEditable(true);
    editor.commands.focus();
  };

  const handleBlur = () => {
    editor.setEditable(false);
    const htmlContent = editor.getHTML();
    setPageBlockContent(selectedPageId, blockId, htmlContent);
  };

  return (
    <div
      className="select-none whitespace-pre-wrap"
      onDoubleClick={(event) => handleDoubleClick(event)}
    >
      <EditorContent onBlur={handleBlur} editor={editor} />
    </div>
  );
}
