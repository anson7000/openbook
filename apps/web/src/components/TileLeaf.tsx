import { type JSONContent } from "@tiptap/core";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { type LeafNode, type Page } from "../lib/types";
import { updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import StarterKit from "@tiptap/starter-kit";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import { FontSizeStrut } from "../lib/fontSizeStrut";
import { Mathematics, migrateMathStrings } from "@tiptap/extension-mathematics";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import { useEffect, useRef } from "react";
import { db } from "../lib/db";

const StoredImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      imageId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-image-id"),
        renderHTML: (attributes) =>
          attributes.imageId ? { "data-image-id": attributes.imageId } : {},
      },
    };
  },
});

type TileLeafProps = {
  node: LeafNode;
  page: Page;
};

export default function TileLeaf({ node, page }: TileLeafProps) {
  const { selectedTileId, setSelectedEditor } = useEditorStore();
  const isSelected = selectedTileId === node.id;
  const objectUrlsRef = useRef<string[]>([]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mathematics,
      StoredImage.configure({
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
        },
      }),
      TextStyle,
      FontSize,
      FontSizeStrut,
      FileHandler.configure({
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            insertImage(currentEditor, file, pos);
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent); // oxlint-disable-line no-console
              return false;
            }

            insertImage(
              currentEditor,
              file,
              currentEditor.state.selection.from,
            );
          });
        },
      }),
    ],
    editable: true,
    content: node.value,

    onCreate: ({ editor: currentEditor }) => {
      migrateMathStrings(currentEditor);
    },

    onUpdate: ({ editor: currentEditor }) => {
      saveContent(currentEditor.getJSON());
    },
  });

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!editor || !isSelected) return;

    setSelectedEditor(editor);
    editor?.commands.focus();

    return () => {
      setSelectedEditor(null);
    };
  }, [isSelected]);

  useEffect(() => {
    if (!editor) return;

    const resolveStoredImages = async () => {
      const content = editor.getJSON();
      const images = findImageNodes(content);

      await Promise.all(
        images.map(async (image) => {
          const imageId = image.attrs?.imageId;
          if (!imageId) return;

          const asset = await db.images.get(imageId);
          if (!asset) return;

          const objectUrl = URL.createObjectURL(asset.blob);
          objectUrlsRef.current.push(objectUrl);
          image.attrs = { ...image.attrs, src: objectUrl };
        }),
      );

      editor.commands.setContent(content, {
        emitUpdate: false,
      });
    };

    resolveStoredImages();
  }, [editor]);

  const saveContent = (jsonContent: JSONContent) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      const currentPage = await db.pages.get(page.id);
      if (!currentPage) return;

      const newBspTree = updateNode(
        currentPage.bspTree,
        node.id,
        (currentNode) => ({
          ...currentNode,
          value: jsonContent,
        }),
      );

      await db.pages.update(currentPage.id, { bspTree: newBspTree });
    }, 250);
  };

  const findImageNodes = (content: JSONContent): JSONContent[] => {
    const images: JSONContent[] = [];
    content.content?.forEach((child) => {
      if (child.type === "image") images.push(child);
      images.push(...findImageNodes(child));
    });
    return images;
  };

  const insertImage = async (
    currentEditor: Editor,
    file: File,
    position: number,
  ) => {
    const imageId = crypto.randomUUID();
    await db.images.put({
      id: imageId,
      blob: file,
      mimeType: file.type,
    });

    const objectUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(objectUrl);

    currentEditor
      .chain()
      .insertContentAt(position, {
        type: "image",
        attrs: {
          src: objectUrl,
          imageId: imageId,
        },
      })
      .focus()
      .run();
  };

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
