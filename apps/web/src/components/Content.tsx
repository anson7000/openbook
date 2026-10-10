import { type MouseEvent } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEditorStore } from "../store/useEditorStore";
import { Mathematics, migrateMathStrings } from "@tiptap/extension-mathematics";
import Image from "@tiptap/extension-image";

interface ContentProps {
  content: string;
  blockId: string;
}

export default function Content({ content, blockId }: ContentProps) {
  const { selectedPageId, setPageBlockContent } = useEditorStore();
  const editor = useEditor({
    extensions: [StarterKit, Mathematics, Image],
    editable: false,
    onCreate: ({ editor: currentEditor }) => {
      migrateMathStrings(currentEditor);
    },
    content: content,
  });

  const handleDoubleClick = (event: MouseEvent) => {
    event.stopPropagation();

    editor.setEditable(true);
    editor.commands.focus();
  };

  const handleBlur = () => {
    editor.setEditable(false);

    const stringContent = editor.getHTML();
    console.log("Saving content for block", blockId, ":", stringContent);
    setPageBlockContent(selectedPageId, blockId, stringContent);
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
