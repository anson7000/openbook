import { type BSPNode } from "../libs/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import TileLeaf from "./TileLeaf";
import TileSplit from "./TileSplit";

type TileProps = {
  node: BSPNode;
};

export default function Tile({ node }: TileProps) {
  const { selectedTileId, setSelectedTileId } = useEditorStore();
  const isSelected = selectedTileId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTileId(node.id);
  };

  return (
    <div
      className={`w-full h-full ${isSelected ? "border-2 border-blue-500" : "border"}`}
      onClick={handleClick}
    >
      {node.type === "split" ? (
        <TileSplit node={node} axis={node.axis} />
      ) : (
        <TileLeaf node={node} />
      )}
    </div>
  );
}
