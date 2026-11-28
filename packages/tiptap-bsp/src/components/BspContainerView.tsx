import { useRef, useState } from "react";
import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";
import type { SplitDirection } from "../extensions/bspLayout";

export const BspContainerView = ({ node }: NodeViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const direction: SplitDirection =
    node.attrs.direction === "vertical" ? "vertical" : "horizontal";
  const committedRatio: number =
    typeof node.attrs.ratio === "number" ? node.attrs.ratio : 0.5;

  const [dragRatio] = useState<number | null>(null);
  const ratio = dragRatio ?? committedRatio;

  const isHorizontal = direction === "horizontal";
  const firstFr = Math.max(0.1, ratio);
  const secondFr = Math.max(0.1, 1 - ratio);

  // Target the two direct child wrappers inside `[data-bsp-children]`
  const gridTemplateColumns = isHorizontal
    ? `${firstFr}fr 6px ${secondFr}fr`
    : "1fr";
  const gridTemplateRows = isHorizontal
    ? "1fr"
    : `${firstFr}fr 6px ${secondFr}fr`;

  return (
    <NodeViewWrapper
      ref={containerRef}
      data-bsp-node=""
      data-direction={direction}
      style={{
        display: "grid",
        gridTemplateColumns,
        gridTemplateRows,
        gap: 0,
        minHeight: 280,
        width: "100%",
      }}
    >
      <style>{`
        [data-bsp-node][data-direction="horizontal"] > [data-bsp-children] > [data-node-view-wrapper]:nth-child(1) {
          grid-column: 1;
          grid-row: 1;
        }
        [data-bsp-node][data-direction="horizontal"] > [data-bsp-children] > [data-node-view-wrapper]:nth-child(2) {
          grid-column: 3;
          grid-row: 1;
        }
        [data-bsp-node][data-direction="vertical"] > [data-bsp-children] > [data-node-view-wrapper]:nth-child(1) {
          grid-column: 1;
          grid-row: 1;
        }
        [data-bsp-node][data-direction="vertical"] > [data-bsp-children] > [data-node-view-wrapper]:nth-child(2) {
          grid-column: 1;
          grid-row: 3;
        }
      `}</style>

      <NodeViewContent data-bsp-children="" style={{ display: "contents" }} />
    </NodeViewWrapper>
  );
};
