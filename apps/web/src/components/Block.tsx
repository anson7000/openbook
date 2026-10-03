import type { Block as BlockData } from "../types";
import { useDrag, type DragBounds } from "@use-gesture/react";
import { cn } from "../lib/utils";
import Content from "./Content";

interface BlockProps {
  block: BlockData;
  isSelected: boolean;
  bounds: DragBounds;
  onPointerDown: (blockId: string) => void;
  onDrag: (x: number, y: number) => void;
  onResizeHandleDrag: (width: number, height: number) => void;
  onContentBlur: (blockId: string, content: string) => void;
}

export default function Block({
  block,
  isSelected,
  bounds,
  onPointerDown,
  onDrag,
  onResizeHandleDrag,
  onContentBlur,
}: BlockProps) {
  const dragBind = useDrag(
    ({ first, event, down, delta: [deltaX, deltaY] }) => {
      if (first) {
        event.stopPropagation();

        onPointerDown(block.id);
        return;
      }

      if (down) {
        const x = Math.max(0, block.x + deltaX);
        const y = Math.max(0, block.y + deltaY);
        onDrag(x, y);
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
        onResizeHandleDrag(width, height);
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
        isSelected ? "outline-2 outline-blue-500" : "",
      )}
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        height: block.height,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {isSelected ? (
        <div
          {...resizeHandleDragBind()}
          className={`absolute z-10 h-3 w-3 touch-none rounded-full bg-blue-500 touch-none -bottom-1 -right-1 cursor-nwse-resize`}
        />
      ) : (
        <></>
      )}
      <Content
        content={block.content}
        isSelected={isSelected}
        onBlur={(content) => onContentBlur(block.id, content)}
      />
    </div>
  );
}
