import { useRef } from "react";
import type { Block, Page } from "../types";
import { useEditorStore } from "../store/useEditorStore";
import BlockComponent from "./Block";

interface PageProps {
  page: Page;
}

export default function Page({ page }: PageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { mode, setMode, addPageBlock, setSelectedBlockId } = useEditorStore();
  const blocks = page.blocks;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode === "text") {
      const canvas = ref.current;
      if (!canvas || !page) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newBlock: Block = {
        id: crypto.randomUUID(),
        type: "text",
        x,
        y,
        width: 100,
        height: 50,
        content: "New Text",
      };

      addPageBlock(page.id, newBlock);
    }

    setSelectedBlockId(null);
    setMode("select");
  };

  return (
    <div
      ref={ref}
      className={
        "relative mx-auto border bg-background shadow-lg overflow-hidden touch-none print:mx-0 print:border-0 print:shadow-none"
      }
      style={{
        width: page.width,
        height: page.height,
      }}
      onPointerDown={(event) => handlePointerDown(event)}
    >
      {blocks.map((block) => (
        <BlockComponent key={block.id} block={block} bounds={ref} />
      ))}
    </div>
  );
}
