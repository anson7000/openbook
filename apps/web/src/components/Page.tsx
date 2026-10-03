import { useRef, useState } from "react";
import type { Block, SelectInfo } from "../types";
import { useEditorStore } from "../store/useEditorStore";
import BlockComponent from "./Block";
import { useDrag } from "@use-gesture/react";

interface PageProps {
  initialBlocks: Block[];
}

export default function Page({ initialBlocks }: PageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const { pageWidth, pageHeight, mode, setMode } = useEditorStore();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectInfo, setSelectInfo] = useState<SelectInfo | null>(null);

  const dragBind = useDrag(({ initial: [initialX, initialY], tap }) => {
    if (tap) {
      if (mode === "text") {
        const page = pageRef.current;
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

      setSelectInfo(null);
      setMode("select");
    }
  });

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
      ref={pageRef}
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
          isSelected={selectInfo ? block.id == selectInfo.blockId : false}
          onPointerDown={handleBlockOnPointerDown}
          onDrag={handleBlockDrag}
          onResize={handleBlockResize}
        />
      ))}
    </div>
  );
}
