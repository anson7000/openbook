import type { Block } from "../types";

interface A4CanvasProps {
  blocks: Block[];
}

export default function A4Canvas({ blocks }: A4CanvasProps) {
  return (
    <div
      className="relative mx-auto border bg-background shadow-lg overflow-hidden"
      style={{
        width: "794px", // A4 width at 96dpi
        height: "1123px", // A4 height at 96dpi
      }}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          className="absolute"
          style={{
            left: block.x,
            top: block.y,
            width: block.width,
            height: block.height,
          }}
        >
          {block.content}
        </div>
      ))}
    </div>
  );
}
