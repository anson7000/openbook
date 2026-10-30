import { EditorContent, useEditor } from "@tiptap/react";
import { type LeafNode } from "../lib/types";
import { updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import StarterKit from "@tiptap/starter-kit";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import { FontSizeStrut } from "../lib/fontSizeStrut";
import { Mathematics, migrateMathStrings } from "@tiptap/extension-mathematics";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

type TileLeafProps = {
  node: LeafNode;
};

export default function TileLeaf({ node }: TileLeafProps) {
  const {
    pages,
    bspTrees,
    selectedPageId,
    selectedTileId,
    registerBspTree,
    registerEditor,
    unregisterEditor,
  } = useEditorStore();
  const isSelected = selectedTileId === node.id;

  const page = pages.find((page) => page.id === selectedPageId);
  if (!page) return null;

  const bspTree = bspTrees.get(page.bspTreeId);
  if (!bspTree) return null;

  const saveContent = (htmlContent: string) => {
    const newBspTree = updateNode(bspTree, node.id, (currentNode) => {
      return {
        ...currentNode,
        value: htmlContent,
      };
    });

    registerBspTree(page.bspTreeId, newBspTree);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Mathematics,
      Image,
      TextStyle,
      FontSize,
      FontSizeStrut,
    ],
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

    editor?.commands.focus();
  }, [isSelected, editor]);

  useEffect(() => {
    if (!editor) return;

    registerEditor(node.id, editor);

    return () => {
      unregisterEditor(node.id);
    };
  }, [editor, node.id, registerEditor, unregisterEditor]);

  return (
    <div
      className={`w-full h-full overflow-clip ${
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
