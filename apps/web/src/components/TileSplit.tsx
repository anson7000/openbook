import Tile from "./Tile";
import { type SplitNode } from "../libs/bspTree";

type TileSplitProps = {
  node: SplitNode;
  axis: "x" | "y";
};

export default function TileSplit({ node, axis }: TileSplitProps) {
  return (
    <div
      className={`flex w-full h-full ${axis === "x" ? "flex-row" : "flex-col"}`}
    >
      <div className="flex-1">
        <Tile node={node.first} />
      </div>
      <div className="flex-1">
        <Tile node={node.second} />
      </div>
    </div>
  );
}
