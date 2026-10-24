import { EditorContent, useEditor } from "@tiptap/react";
import { updateNode, type LeafNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics, migrateMathStrings } from "@tiptap/extension-mathematics";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

type TileLeafProps = {
  node: LeafNode;
};

export default function TileLeaf({ node }: TileLeafProps) {
  const { setBspTree, selectedTileId, setActiveEditor, clearActiveEditor } =
    useEditorStore();
  const isSelected = selectedTileId === node.id;

  const saveContent = (htmlContent: string) => {
    setBspTree((tree) =>
      updateNode(tree, node.id, (currentNode) => {
        if (currentNode.type !== "leaf") return currentNode;

        return {
          ...currentNode,
          value: htmlContent,
        };
      }),
    );
  };

  const editor = useEditor({
    extensions: [StarterKit, Mathematics, Image],
    editable: true,
    content: node.value,

    onCreate: ({ editor: currentEditor }) => {
      migrateMathStrings(currentEditor);
    },

    onUpdate: ({ editor: currentEditor }) => {
      saveContent(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || !isSelected) return;

    setActiveEditor(editor);
    editor?.commands.focus();
    return () => clearActiveEditor(editor);
  }, [isSelected, editor, setActiveEditor, clearActiveEditor]);

  return (
    <div
      className={`w-full h-full ${
        isSelected ? "border-2 border-blue-500" : "border"
      }`}
    >
      <EditorContent
        className="h-full w-full [&_.ProseMirror]:h-full [&_.ProseMirror]:w-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none"
        editor={editor}
      />
    </div>
  );
}
