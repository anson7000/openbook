import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Example from "@openbook/tiptap-bsp";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit, Example],
    content: "<p>Hello World!</p>",
  });

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
