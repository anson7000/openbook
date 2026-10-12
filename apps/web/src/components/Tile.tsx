import { type BSPNode } from "../libs/bspTree";
import { useEditorStore } from "../store/useEditorStore";

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
        <div className="flex flex-col w-full h-full">
          <div className="flex-1 border border-dashed border-border">
            <Tile node={node.first} />
          </div>
          <div className="flex-1 border border-dashed border-border">
            <Tile node={node.second} />
          </div>
        </div>
      ) : (
        <div
          className={
            isSelected ? "bg-blue-500 text-white" : "bg-white text-black"
          }
        >
          {node.value}
        </div>
      )}
    </div>
  );
}
