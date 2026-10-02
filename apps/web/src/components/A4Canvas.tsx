import { useState } from "react";
import type { Block, SelectInfo } from "../types";
import { useEditorStore } from "../store/useEditorStore";
import BlockComponent from "./Block";

interface A4CanvasProps {
  initialBlocks: Block[];
}

export default function A4Canvas({ initialBlocks }: A4CanvasProps) {
  const { canvasWidth, canvasHeight, setMode } = useEditorStore();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectInfo, setSelectInfo] = useState<SelectInfo | null>(null);

  const handleClick = () => {
    setSelectInfo(null);
    setMode("select");
  };

  const handleBlockOnPointerDown = (blockId: string) => {
    setSelectInfo({ blockId, blockState: "select" });
  };

  const handleBlockDrag = (x: number, y: number) => {
    if (!selectInfo) return;

    setBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === selectInfo.blockId ? { ...block, x, y } : block,
      ),
    );
  };

  const handleBlockResize = (width: number, height: number) => {
    if (!selectInfo) return;

    setBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === selectInfo.blockId ? { ...block, width, height } : block,
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
          isSelected={selectInfo ? block.id == selectInfo.blockId : false}
          onPointerDown={handleBlockOnPointerDown}
          onDrag={handleBlockDrag}
          onResize={handleBlockResize}
        />
      ))}
    </div>
  );
}
