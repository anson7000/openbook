import type { Block as BlockData } from "../types";
import { useDrag } from "@use-gesture/react";
import { cn } from "../lib/utils";
import { useEditorStore } from "../store/useEditorStore";
import Content from "./Content";

interface BlockProps {
  block: BlockData;
  isSelected: boolean;
  onPointerDown: (blockId: string) => void;
  onDrag: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  onContentBlur: (blockId: string, content: string) => void;
}

export default function Block({
  block,
  isSelected,
  onPointerDown,
  onDrag,
  onResize,
  onContentBlur,
}: BlockProps) {
  const { pageWidth, pageHeight } = useEditorStore();

  const dragBind = useDrag(
    ({ first, event, down, delta: [deltaX, deltaY] }) => {
      if (first) {
        event.stopPropagation();

        onPointerDown(block.id);
        return;
      }

      if (down) {
        const x = Math.max(
          0,
          Math.min(block.x + deltaX, pageWidth - block.width),
        );
        const y = Math.max(
          0,
          Math.min(block.y + deltaY, pageHeight - block.height),
        );

        onDrag(x, y);
      }
    },
  );

  const resizeHandleDragBind = useDrag(
    ({
      first,
      event,
      down,
      xy: [x, y],
      initial: [initialX, initialY],
      memo,
    }) => {
      if (first) {
        event.stopPropagation();
        memo = [block.width, block.height];
        return memo;
      }

      if (down) {
        const maxWidth = pageWidth - block.x;
        const maxHeight = pageHeight - block.y;
        const deltaX = x - initialX;
        const deltaY = y - initialY;

        const width = Math.max(0, Math.min(memo[0] + deltaX, maxWidth));
        const height = Math.max(0, Math.min(memo[1] + deltaY, maxHeight));

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
