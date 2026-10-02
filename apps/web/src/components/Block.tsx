import type { Block as BlockData } from "../types";
import { useDrag } from "@use-gesture/react";
import { cn } from "../lib/utils";
import { useEditorStore } from "../store/useEditorStore";

interface BlockProps {
  block: BlockData;
  isSelected: boolean;
  onPointerDown: (blockId: string) => void;
  onDrag: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
}

export default function Block({
  block,
  isSelected,
  onPointerDown,
  onDrag,
  onResize,
}: BlockProps) {
  const { canvasWidth, canvasHeight } = useEditorStore();

  const dragBind = useDrag(({ first, down, delta: [deltaX, deltaY] }) => {
    if (first) {
      onPointerDown(block.id);
    }

    if (down) {
      const x = Math.max(
        0,
        Math.min(block.x + deltaX, canvasWidth - block.width),
      );
      const y = Math.max(
        0,
        Math.min(block.y + deltaY, canvasHeight - block.height),
      );

      onDrag(x, y);
    }
  });

  const resizeHandleDragBind = useDrag(
    ({ event, down, delta: [deltaX, deltaY] }) => {
      event.stopPropagation();

      if (down) {
        const maxWidth = canvasWidth - block.x;
        const maxHeight = canvasHeight - block.y;

        const width = Math.max(0, Math.min(block.width + deltaX, maxWidth));
        const height = Math.max(0, Math.min(block.height + deltaY, maxHeight));

        onResize(width, height);
      }
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
      onClick={(e) => e.stopPropagation()}
    >
      {isSelected ? (
        <>
          <div
            {...resizeHandleDragBind()}
            className={`absolute z-10 h-3 w-3 touch-none rounded-full bg-blue-500 touch-none -bottom-1 -right-1 cursor-nwse-resize`}
          />
          <div>{block.content}</div>
        </>
      ) : (
        <div>{block.content}</div>
      )}
    </div>
  );
}
