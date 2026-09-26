import { useRef, useState } from "react";
import type {
  Block,
  DragSession,
  ResizeDirection,
  ResizeSession,
} from "../types";
import { useEditorStore } from "../store/useEditorStore";
import BlockComponent from "./Block";

const CANVAS_WIDTH = 794;
const CANVAS_HEIGHT = 1123;
const MIN_BLOCK_SIZE = 20;

interface A4CanvasProps {
  initialBlocks: Block[];
}

export default function A4Canvas({ initialBlocks }: A4CanvasProps) {
  const { mode, setMode } = useEditorStore();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const resizeSession = useRef<ResizeSession | null>(null);
  const dragSession = useRef<DragSession | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editingBlockId) {
      handleInputBlur(editingBlockId);
      return;
    }

    if (mode !== "text") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
    setEditingBlockId(newBlock.id);
    setEditText(newBlock.content);
  };

  const handleResizeStart = (
    block: Block,
    direction: ResizeDirection,
    clientX: number,
    clientY: number,
  ) => {
    resizeSession.current = {
      blockId: block.id,
      direction,
      startX: clientX,
      startY: clientY,
      block,
    };
  };

  const handleResizeMove = (clientX: number, clientY: number) => {
    const session = resizeSession.current;
    if (!session) return;

    const deltaX = clientX - session.startX;
    const deltaY = clientY - session.startY;

    const { block, direction } = session;
    const right = block.x + block.width;
    const bottom = block.y + block.height;
    let x = block.x;
    let y = block.y;
    let width = block.width;
    let height = block.height;

    if (direction.includes("left")) {
      x = Math.max(0, Math.min(block.x + deltaX, right - MIN_BLOCK_SIZE));
      width = right - x;
    } else if (direction.includes("right")) {
      width = Math.max(
        MIN_BLOCK_SIZE,
        Math.min(block.width + deltaX, CANVAS_WIDTH - block.x),
      );
    }

    if (direction.includes("top")) {
      y = Math.max(0, Math.min(block.y + deltaY, bottom - MIN_BLOCK_SIZE));
      height = bottom - y;
    } else if (direction.includes("bottom")) {
      height = Math.max(
        MIN_BLOCK_SIZE,
        Math.min(block.height + deltaY, CANVAS_HEIGHT - block.y),
      );
    }

    setBlocks((previousBlocks) =>
      previousBlocks.map((currentBlock) =>
        currentBlock.id === session.blockId
          ? { ...currentBlock, x, y, width, height }
          : currentBlock,
      ),
    );
  };

  const handleResizeEnd = () => {
    resizeSession.current = null;
  };

  const handleDragStart = (block: Block, clientX: number, clientY: number) => {
    dragSession.current = {
      blockId: block.id,
      startX: clientX,
      startY: clientY,
      block,
    };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    const session = dragSession.current;
    if (!session) return;

    const deltaX = clientX - session.startX;
    const deltaY = clientY - session.startY;
    const x = Math.max(
      0,
      Math.min(session.block.x + deltaX, CANVAS_WIDTH - session.block.width),
    );
    const y = Math.max(
      0,
      Math.min(session.block.y + deltaY, CANVAS_HEIGHT - session.block.height),
    );

    setBlocks((previousBlocks) =>
      previousBlocks.map((block) =>
        block.id === session.blockId ? { ...block, x, y } : block,
      ),
    );
  };

  const handleDragEnd = () => {
    dragSession.current = null;
  };

  const handleBlockClick = (block: Block) => {
    setEditingBlockId(block.id);
    setEditText(block.content);
  };

  const handleInputBlur = (blockId: string) => {
    setMode("select");
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) =>
        b.id === blockId ? { ...b, content: editText } : b,
      ),
    );
    setEditingBlockId(null);
  };

  return (
    <div
      className="relative mx-auto border bg-background shadow-lg overflow-hidden w-[794px] h-[1123px]"
      onClick={handleCanvasClick}
    >
      {blocks.map((block) => (
        <BlockComponent
          key={block.id}
          block={block}
          isEditing={editingBlockId === block.id}
          editText={editText}
          onSelect={handleBlockClick}
          onEditText={setEditText}
          onFinishEditing={() => handleInputBlur(block.id)}
          onResizeStart={(direction, clientX, clientY) =>
            handleResizeStart(block, direction, clientX, clientY)
          }
          onResizeMove={handleResizeMove}
          onResizeEnd={handleResizeEnd}
          onDragStart={(clientX, clientY) =>
            handleDragStart(block, clientX, clientY)
          }
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
