import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

const DIVIDER_SIZE = 8;
const MIN_RATIO = 0.1;
const MAX_RATIO = 0.9;

type TileDividerProps = {
  axis: "x" | "y";
  ratio: number;
  onResize: (ratio: number) => void;
};

export default function TileDivider({
  axis,
  ratio,
  onResize,
}: TileDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(
    ({ movement: [movementX, movementY], memo = ratio }) => {
      const parent = dividerRef.current?.parentElement;
      if (!parent) return memo;

      const bounds = parent.getBoundingClientRect();
      const totalSize = axis === "x" ? bounds.width : bounds.height;
      const availableSize = totalSize - DIVIDER_SIZE;
      const movement = axis === "x" ? movementX : movementY;
      const nextRatio = memo + movement / availableSize;

      onResize(Math.min(MAX_RATIO, Math.max(MIN_RATIO, nextRatio)));
      return memo;
    },
    { filterTaps: true },
  );

  return (
    <div
      {...bind()}
      ref={dividerRef}
      role="separator"
      aria-orientation={axis === "x" ? "vertical" : "horizontal"}
      className={`${
        axis === "x" ? "w-2 cursor-col-resize" : "h-2 cursor-row-resize"
      }`}
      onClick={(event) => event.stopPropagation()}
    />
  );
}
