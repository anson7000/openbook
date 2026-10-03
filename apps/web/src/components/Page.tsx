import { useRef, useState } from "react";
import type { Block } from "../types";
import { useEditorStore } from "../store/useEditorStore";
import BlockComponent from "./Block";
import { useDrag } from "@use-gesture/react";

interface PageProps {
  initialBlocks: Block[];
}

export default function Page({ initialBlocks }: PageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { pageWidth, pageHeight, mode, setMode } = useEditorStore();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Dont know why pressing the arrow key is treated as tap
  const dragBind = useDrag(({ initial: [initialX, initialY], first, down }) => {
    if (first && down) {
      if (mode === "text") {
        const page = ref.current;
        if (!page) return;

        const rect = page.getBoundingClientRect();
        const x = initialX - rect.left;
        const y = initialY - rect.top;

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
      }

      setSelectedBlockId(null);
      setMode("select");
    }
  });

  const handleBlockOnPointerDown = (blockId: string) => {
    setSelectedBlockId(blockId);
  };

  const handleBlockDrag = (x: number, y: number) => {
    if (!setSelectedBlockId) return;

    setBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === selectedBlockId ? { ...block, x, y } : block,
      ),
    );
  };

  const handleBlockResize = (width: number, height: number) => {
    if (!setSelectedBlockId) return;

    setBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === selectedBlockId ? { ...block, width, height } : block,
      ),
    );
  };

  const handleContentBlur = (blockId: string, content: string) => {
    setBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === blockId ? { ...block, content } : block,
      ),
    );
  };

  return (
    <div
      ref={ref}
      {...dragBind()}
      className={
        "relative mx-auto border bg-background shadow-lg overflow-hidden touch-none"
      }
      style={{
        width: pageWidth,
        height: pageHeight,
      }}
    >
      {blocks.map((block) => (
        <BlockComponent
          key={block.id}
          block={block}
          isSelected={selectedBlockId ? block.id == selectedBlockId : false}
          onPointerDown={handleBlockOnPointerDown}
          onDrag={handleBlockDrag}
          onResize={handleBlockResize}
          onContentBlur={handleContentBlur}
        />
      ))}
    </div>
  );
}
