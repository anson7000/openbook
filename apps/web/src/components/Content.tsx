import { useRef, useState, useEffect } from "react";
import type { MouseEvent, KeyboardEvent } from "react";

interface ContentProps {
  content: string;
  isSelected: boolean;
  onBlur: (content: string) => void;
}

export default function Content({ content, isSelected, onBlur }: ContentProps) {
  const editDivRef = useRef<HTMLDivElement>(null);
  const [editContent, setEditContent] = useState<string | null>(null);

  useEffect(() => {
    const editDiv = editDivRef.current;

    if (editContent !== null && editDiv) {
      editDiv.focus();
    }
  }, [editContent]);

  const handleDoubleClick = (event: MouseEvent) => {
    event.stopPropagation();

    if (isSelected) {
      setEditContent(content);
    }
  };

  const handleInput = () => {
    setEditContent(editDivRef.current?.innerText ?? "");
  };

  const hanldeBlur = () => {
    setEditContent(null);
    onBlur(editContent ?? "");
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation();

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      hanldeBlur();
    }
  };

  return (
    <div
      className="select-none whitespace-pre-wrap"
      onDoubleClick={(event) => handleDoubleClick(event)}
    >
      {editContent == null ? (
        content
      ) : (
        <div
          ref={editDivRef}
          className="w-full h-full"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={hanldeBlur}
          onKeyDown={handleKeyDown}
        >
          {content}
        </div>
      )}
    </div>
  );
}
