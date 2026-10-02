import { useState } from "react";
import type { Block, SelectedBlock } from "../types";
import { useEditorStore } from "../store/useEditorStore";
import BlockComponent from "./Block";

interface A4CanvasProps {
  initialBlocks: Block[];
}

export default function A4Canvas({ initialBlocks }: A4CanvasProps) {
  const { canvasWidth, canvasHeight, setMode } = useEditorStore();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<SelectedBlock | null>(
    null,
  );

  const handleClick = () => {
    setSelectedBlock(null);
    setMode("select");
  };

  const handleBlockOnPointerDown = (blockId: string) => {
    setSelectedBlock({ id: blockId, state: "select" });
  };

  const handleBlockDrag = (x: number, y: number) => {
    if (!selectedBlock) return;

    setBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === selectedBlock.id ? { ...block, x, y } : block,
      ),
    );
  };

  const handleBlockResize = (width: number, height: number) => {
    if (!selectedBlock) return;

    setBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === selectedBlock.id ? { ...block, width, height } : block,
      ),
    );
  };

  return (
    <div
      className={
        "relative mx-auto border bg-background shadow-lg overflow-hidden"
      }
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
      onClick={handleClick}
    >
      {blocks.map((block) => (
        <BlockComponent
          key={block.id}
          block={block}
          isSelected={selectedBlock ? block.id == selectedBlock.id : false}
          onPointerDown={handleBlockOnPointerDown}
          onDrag={handleBlockDrag}
          onResize={handleBlockResize}
        />
      ))}
    </div>
  );
}
