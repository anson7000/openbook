import Tile from "./Tile";
import { type SplitNode } from "../lib/types";
import { updateNode } from "../lib/bspTree";
import TileDivider from "./TileDivider";
import { useEffect, useRef, useState } from "react";
import { db } from "../lib/db";
import { type Page } from "../lib/types";

type TileSplitProps = {
  node: SplitNode;
  page: Page;
};

export default function TileSplit({ node, page }: TileSplitProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(node.ratio);

  useEffect(() => {
    setRatio(node.ratio);
  }, [node.ratio]);

  const handleResize = (nextRatio: number) => {
    setRatio(nextRatio);
  };

  const handleResizeEnd = (nextRatio: number) => {
    db.pages.update(page.id, {
      bspTree: updateNode(page.bspTree, node.id, (currentNode) =>
        currentNode.type === "split"
          ? { ...currentNode, ratio: nextRatio }
          : currentNode,
      ),
    });
  };

  return (
    <div
      ref={tileRef}
      className="relative grid w-full h-full"
      style={{
        gridTemplateColumns:
          node.axis === "x" ? `${ratio}fr ${1 - ratio}fr` : undefined,
        gridTemplateRows:
          node.axis === "y" ? `${ratio}fr ${1 - ratio}fr` : undefined,
      }}
    >
      <div key={node.first.id} className="min-w-0 min-h-0">
        <Tile node={node.first} page={page} />
      </div>
      <div
        className="absolute z-10"
        style={
          node.axis === "x"
            ? {
                top: 0,
                bottom: 0,
                left: `${ratio * 100}%`,
                transform: "translateX(-50%)",
              }
            : {
                left: 0,
                right: 0,
                top: `${ratio * 100}%`,
                transform: "translateY(-50%)",
              }
        }
      >
        <TileDivider
          axis={node.axis}
          ratio={ratio}
          bounds={tileRef.current?.getBoundingClientRect() || new DOMRect()}
          onResize={handleResize}
          onResizeEnd={handleResizeEnd}
        />
      </div>
      <div key={node.second.id} className="min-w-0 min-h-0">
        <Tile node={node.second} page={page} />
      </div>
    </div>
  );
}
