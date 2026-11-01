import { EditorContent, useEditor } from "@tiptap/react";
import { type LeafNode, type Page } from "../lib/types";
import { updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import StarterKit from "@tiptap/starter-kit";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import { FontSizeStrut } from "../lib/fontSizeStrut";
import { Mathematics, migrateMathStrings } from "@tiptap/extension-mathematics";
import Image from "@tiptap/extension-image";
import { useEffect, useRef } from "react";
import { db } from "../lib/db";

type TileLeafProps = {
  node: LeafNode;
  page: Page;
};

export default function TileLeaf({ node, page }: TileLeafProps) {
  const { selectedTileId, setSelectedEditor } = useEditorStore();
  const isSelected = selectedTileId === node.id;
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const saveContent = (htmlContent: string) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      const currentPage = await db.pages.get(page.id);
      if (!currentPage) return;

      const newBspTree = updateNode(
        currentPage.bspTree,
        node.id,
        (currentNode) => ({
          ...currentNode,
          value: htmlContent,
        }),
      );

      await db.pages.update(currentPage.id, { bspTree: newBspTree });
    }, 250);
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
    if (!editor || !isSelected) return;

    setSelectedEditor(editor);

    return () => {
      setSelectedEditor(null);
    };
  }, [editor, isSelected, setSelectedEditor]);

  return (
    <div
      className={`w-full h-full overflow-clip ${
        isSelected
          ? "border border-blue-500 ring ring-inset ring-blue-500"
          : "border"
      }`}
    >
      <EditorContent
        className="h-full w-full [&_.ProseMirror]:h-full [&_.ProseMirror]:w-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none"
        editor={editor}
      />
    </div>
  );
}
