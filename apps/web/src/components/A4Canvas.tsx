import { useState } from "react";
import type { Block } from "../types";
import { useEditorStore } from "../store/useEditorStore";

interface A4CanvasProps {
  initialBlocks: Block[];
}

export default function A4Canvas({ initialBlocks }: A4CanvasProps) {
  const { mode, setMode } = useEditorStore();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
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
      className="relative mx-auto border bg-background shadow-lg overflow-hidden"
      style={{
        width: "794px",
        height: "1123px",
      }}
      onClick={handleCanvasClick}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          className="absolute"
          style={{
            left: block.x,
            top: block.y,
            width: block.width,
            height: block.height,
            cursor: "pointer",
            padding: "4px",
            boxSizing: "border-box",
            border: "1px solid transparent",
          }}
          onClick={(e) => {
            e.stopPropagation(); // prevent canvas click
            handleBlockClick(block);
          }}
        >
          {editingBlockId === block.id ? (
            <input
              autoFocus
              value={editText}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur(block.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleInputBlur(block.id);
                }
              }}
            />
          ) : (
            <div>{block.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
