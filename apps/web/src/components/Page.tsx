import { useState, useEffect } from "react";
import Tile from "./Tile";
import { type BSPNode, updateNode } from "../libs/bspTree";
import { useEditorStore } from "../store/useEditorStore";

type PageProps = {
  width: number;
  height: number;
};

export default function Page({ width, height }: PageProps) {
  const { selectedTileId } = useEditorStore();
  const [bspTree, setBspTree] = useState<BSPNode>({
    id: crypto.randomUUID(),
    type: "leaf",
    value: "",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId) return;
      e.preventDefault();

      if (e.ctrlKey && e.key === "d") {
        setBspTree((prevTree) =>
          updateNode(prevTree, selectedTileId, (node) => ({
            id: `${crypto.randomUUID()}`,
            type: "split",
            axis: "y",
            ratio: 0.5,
            first: node,
            second: { id: `${crypto.randomUUID()}`, type: "leaf", value: "" },
          })),
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTileId]);

  return (
    <div
      className="relative mx-auto border bg-background shadow-lg overflow-hidden touch-none print:mx-0 print:border-0 print:shadow-none"
      style={{ width, height }}
    >
      <Tile node={bspTree} />
    </div>
  );
}
