import { type BSPNode, type Page } from "../lib/types";
import { useEditorStore } from "../store/useEditorStore";
import TileLeaf from "./TileLeaf";
import TileSplit from "./TileSplit";

type TileProps = {
  node: BSPNode;
  page: Page;
};

export default function Tile({ node, page }: TileProps) {
  const { setSelectedTileId } = useEditorStore();

  const selectTile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTileId(node.id);
  };

  return (
    <div className={`w-full h-full`} onPointerDown={selectTile}>
      {node.type === "split" ? (
        <TileSplit node={node} page={page} />
      ) : (
        <TileLeaf node={node} page={page} />
      )}
    </div>
  );
}
