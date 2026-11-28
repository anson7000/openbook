import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BspDocument,
  BspContainer,
  BspLeaf,
  BspLayout,
} from "@openbook/tiptap-bsp";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ document: false }),
      BspDocument,
      BspContainer,
      BspLeaf,
      BspLayout,
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "bspLeaf",
          content: [{ type: "text", text: "Hello World!" }],
        },
      ],
    },
  });

  return <EditorContent style={{ height: "100%" }} editor={editor} />;
};

export default Tiptap;
