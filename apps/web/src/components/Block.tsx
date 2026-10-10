import type { Block as BlockData } from "../types";
import { useDrag, type DragBounds } from "@use-gesture/react";
import { cn } from "../lib/utils";
import Content from "./Content";
import { useEditorStore } from "../store/useEditorStore";

interface BlockProps {
  block: BlockData;
  bounds: DragBounds;
}

export default function Block({ block, bounds }: BlockProps) {
  const {
    selectedPageId,
    selectedBlockId,
    setSelectedBlockId,
    setPageBlockPosition,
    setPageBlockSize,
  } = useEditorStore();
  const isSelected = selectedBlockId === block.id;

  const dragBind = useDrag(
    ({ first, event, tap, down, delta: [deltaX, deltaY] }) => {
      if (first) {
        event.stopPropagation();
      }

      if (tap) {
        if (!isSelected) {
          console.log("tap");
          setSelectedBlockId(block.id);
        }
        return;
      }

      if (down) {
        const x = Math.max(0, block.x + deltaX);
        const y = Math.max(0, block.y + deltaY);

        setPageBlockPosition(selectedPageId, block.id, x, y);
      }
    },
    {
      bounds: bounds,
    },
  );

  const resizeHandleDragBind = useDrag(
    ({ first, event, down, delta: [deltaX, deltaY] }) => {
      if (first) {
        event.stopPropagation();
        return;
      }

      if (down) {
        const width = Math.max(0, block.width + deltaX);
        const height = Math.max(0, block.height + deltaY);
        setPageBlockSize(selectedPageId, block.id, width, height);
      }
    },
    {
      bounds: bounds,
    },
  );

  return (
    <div
      {...dragBind()}
      className={cn(
        "absolute [overflow-wrap:anywhere] touch-none",
        isSelected ? "outline-2 outline-blue-500 print:outline-none" : "",
      )}
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        height: block.height,
      }}
    >
      {isSelected ? (
        <div
          {...resizeHandleDragBind()}
          className={`absolute z-10 h-3 w-3 touch-none rounded-full bg-blue-500 touch-none -bottom-1 -right-1 cursor-nwse-resize print:hidden`}
        />
      ) : (
        <></>
      )}
      <Content content={block.content} blockId={block.id} />
    </div>
  );
}
