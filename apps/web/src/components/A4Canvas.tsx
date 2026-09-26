import { useState } from "react";
import type { Block } from "../types";
import { useEditorStore } from "../store/useEditorStore";
import BlockComponent from "./Block";

interface A4CanvasProps {
  initialBlocks: Block[];
}

export default function A4Canvas({ initialBlocks }: A4CanvasProps) {
  const { mode, setMode } = useEditorStore();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editingBlockId) {
      handleInputBlur(editingBlockId);
      return;
    }

    if (mode !== "text") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBlock: Block = {
      id: Date.now().toString(),
      type: "text",
      x,
      y,
      width: 100,
      height: 50,
      content: "New Text",
    };

    setBlocks([...blocks, newBlock]);
    setEditingBlockId(newBlock.id);
    setEditText(newBlock.content);
  };

  const handleBlockClick = (block: Block) => {
    setEditingBlockId(block.id);
    setEditText(block.content);
  };

  const handleInputBlur = (blockId: string) => {
    setMode("select");
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) =>
        b.id === blockId ? { ...b, content: editText } : b,
      ),
    );
    setEditingBlockId(null);
  };

  return (
    <div
      className="relative mx-auto border bg-background shadow-lg overflow-hidden w-[794px] h-[1123px]"
      onClick={handleCanvasClick}
    >
      {blocks.map((block) => (
        <BlockComponent
          key={block.id}
          block={block}
          isEditing={editingBlockId === block.id}
          editText={editText}
          onSelect={handleBlockClick}
          onEditText={setEditText}
          onFinishEditing={() => handleInputBlur(block.id)}
        />
      ))}
    </div>
  );
}
