import { type BSPNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import TileLeaf from "./TileLeaf";
import TileSplit from "./TileSplit";

type TileProps = {
  node: BSPNode;
};

export default function Tile({ node }: TileProps) {
  const { setSelectedTileId } = useEditorStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTileId(node.id);
  };

  return (
    <div className={`w-full h-full`} onClick={handleClick}>
      {node.type === "split" ? (
        <TileSplit node={node} axis={node.axis} />
      ) : (
        <TileLeaf node={node} />
      )}
    </div>
  );
}
