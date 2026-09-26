import type { KeyboardEvent, MouseEvent } from "react";
import type { Block as BlockData } from "../types";

interface BlockProps {
  block: BlockData;
  isEditing: boolean;
  editText: string;
  onSelect: (block: BlockData) => void;
  onEditText: (text: string) => void;
  onFinishEditing: () => void;
}

export default function Block({
  block,
  isEditing,
  editText,
  onSelect,
  onEditText,
  onFinishEditing,
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
      ) : (
        <div>{block.content}</div>
      )}
    </div>
  );
}
