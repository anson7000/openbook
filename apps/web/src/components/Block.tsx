import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import type { Block as BlockData, ResizeDirection } from "../types";

interface BlockProps {
  block: BlockData;
  isEditing: boolean;
  editText: string;
  onSelect: (block: BlockData) => void;
  onEditText: (text: string) => void;
  onFinishEditing: () => void;
  onResizeStart: (
    direction: ResizeDirection,
    clientX: number,
    clientY: number,
  ) => void;
  onResizeMove: (clientX: number, clientY: number) => void;
  onResizeEnd: () => void;
}

export default function Block({
  block,
  isEditing,
  editText,
  onSelect,
  onEditText,
  onFinishEditing,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}: BlockProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onSelect(block);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onFinishEditing();
    }
  };

  const handleResizeStart = (
    event: PointerEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    onResizeStart(direction, event.clientX, event.clientY);
  };

  const handleResizeMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.stopPropagation();
      onResizeMove(event.clientX, event.clientY);
    }
  };

  const handleResizeEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.stopPropagation();
      event.currentTarget.releasePointerCapture(event.pointerId);
      onResizeEnd();
    }
  };

  const resizeHandles: Array<{
    direction: ResizeDirection;
    className: string;
  }> = [
    { direction: "top-left", className: "-left-1 -top-1 cursor-nwse-resize" },
    {
      direction: "top-right",
      className: "-right-1 -top-1 cursor-nesw-resize",
    },
    {
      direction: "bottom-left",
      className: "-bottom-1 -left-1 cursor-nesw-resize",
    },
    {
      direction: "bottom-right",
      className: "-bottom-1 -right-1 cursor-nwse-resize",
    },
  ];

  return (
    <div
      className="absolute [overflow-wrap:anywhere]"
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        height: block.height,
      }}
      onClick={handleClick}
    >
      {isEditing ? (
        <>
          <div
            className="w-full h-full outline-2 outline-blue-500"
            contentEditable
            suppressContentEditableWarning
            autoFocus
            onInput={(event) => {
              onEditText(event.currentTarget.textContent ?? "");
            }}
            onBlur={onFinishEditing}
            onKeyDown={handleKeyDown}
          >
            {editText}
          </div>
          {resizeHandles.map(({ direction, className }) => (
            <div
              key={direction}
              className={`absolute z-10 h-3 w-3 touch-none rounded-full bg-blue-500 ${className}`}
              onPointerDown={(event) => handleResizeStart(event, direction)}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeEnd}
              onPointerCancel={handleResizeEnd}
              onClick={(event) => event.stopPropagation()}
            />
          ))}
        </>
      ) : (
        <div>{block.content}</div>
      )}
    </div>
  );
}
