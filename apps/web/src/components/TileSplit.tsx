import Tile from "./Tile";
import { type SplitNode } from "../lib/types";
import { updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import TileDivider from "./TileDivider";
import { useRef } from "react";

type TileSplitProps = {
  node: SplitNode;
  axis: "x" | "y";
};

export default function TileSplit({ node, axis }: TileSplitProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const { pages, selectedPageId, bspTrees, registerBspTree } = useEditorStore();
  
  const page = pages.find((page) => page.id === selectedPageId);
  if (!page) return null;

  const bspTree = bspTrees.get(page.bspTreeId);
  if (!bspTree) return null;

  const handleResize = (ratio: number) => {
    registerBspTree(
      page.bspTreeId,
      updateNode(bspTree, node.id, (currentNode) =>
        currentNode.type === "split" ? { ...currentNode, ratio } : currentNode,
      ),
    );
  };

  return (
    <div
      ref={tileRef}
      className="relative grid w-full h-full"
      style={{
        gridTemplateColumns:
          axis === "x" ? `${node.ratio}fr ${1 - node.ratio}fr` : undefined,
        gridTemplateRows:
          axis === "y" ? `${node.ratio}fr ${1 - node.ratio}fr` : undefined,
      }}
    >
      <div key={node.first.id} className="min-w-0 min-h-0">
        <Tile node={node.first} />
      </div>
      <div
        className="absolute z-10"
        style={
          axis === "x"
            ? {
                top: 0,
                bottom: 0,
                left: `${node.ratio * 100}%`,
                transform: "translateX(-50%)",
              }
            : {
                left: 0,
                right: 0,
                top: `${node.ratio * 100}%`,
                transform: "translateY(-50%)",
              }
        }
      >
        <TileDivider
          axis={axis}
          ratio={node.ratio}
          bounds={tileRef.current?.getBoundingClientRect() || new DOMRect()}
          onResize={handleResize}
        />
      </div>
      <div key={node.second.id} className="min-w-0 min-h-0">
        <Tile node={node.second} />
      </div>
    </div>
  );
}
