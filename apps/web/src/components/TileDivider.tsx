import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

const MIN_RATIO = 0.1;
const MAX_RATIO = 0.9;

type TileDividerProps = {
  axis: "x" | "y";
  ratio: number;
  bounds: DOMRect;
  onResize: (ratio: number) => void;
  onResizeEnd: (ratio: number) => void;
};

export default function TileDivider({
  axis,
  ratio,
  bounds,
  onResize,
  onResizeEnd,
}: TileDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null);

  const bind = useDrag(
    ({ first, last, xy: [clientX, clientY], memo }) => {
      if (first) {
        memo = {
          initRatio: ratio,
          initPosition: axis === "x" ? clientX : clientY,
        };
        return memo;
      }

      const newPosition = axis === "x" ? clientX : clientY;
      const delta = newPosition - memo.initPosition;
      const totalSize = axis === "x" ? bounds.width : bounds.height;
      const deltaRatio = delta / totalSize;
      const newRatio = Math.min(
        MAX_RATIO,
        Math.max(MIN_RATIO, memo.initRatio + deltaRatio),
      );

      onResize(newRatio);
      if (last) onResizeEnd(newRatio);
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
        axis === "x"
          ? "h-full w-2 cursor-col-resize"
          : "h-2 w-full cursor-row-resize"
      } touch-none`}
      onClick={(event) => event.stopPropagation()}
    />
  );
}
