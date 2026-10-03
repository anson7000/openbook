import type { MouseEvent } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ContentProps {
  content: string;
  isSelected: boolean;
  onBlur: (content: string) => void;
}

const extensions = [StarterKit];

export default function Content({ content, isSelected, onBlur }: ContentProps) {
  const editor = useEditor({
    extensions,
    editable: false,
    content: content,
  });

  const handleDoubleClick = (event: MouseEvent) => {
    event.stopPropagation();

    if (isSelected) {
      editor.setEditable(true);
      editor.commands.focus();
    }
  };

  const hanldeBlur = () => {
    editor.setEditable(false);
    const htmlContent = editor.getHTML();
    onBlur(htmlContent);
  };

  return (
    <div
      className="select-none whitespace-pre-wrap"
      onDoubleClick={(event) => handleDoubleClick(event)}
    >
      <EditorContent onBlur={hanldeBlur} editor={editor} />
    </div>
  );
}
