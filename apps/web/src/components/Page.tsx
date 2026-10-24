import { useEffect } from "react";
import Tile from "./Tile";
import { removeNode, updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";

const splitShortcuts: Record<
  string,
  { axis: "x" | "y"; selectedFirst: boolean }
> = {
  ArrowUp: { axis: "y", selectedFirst: false },
  ArrowDown: { axis: "y", selectedFirst: true },
  ArrowLeft: { axis: "x", selectedFirst: false },
  ArrowRight: { axis: "x", selectedFirst: true },
};

type PageProps = {
  width: number;
  height: number;
};

export default function Page({ width, height }: PageProps) {
  const { selectedTileId, bspTree, setBspTree, setSelectedTileId } =
    useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId) return;

      if (e.key === "Escape") {
        setSelectedTileId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTileId, setSelectedTileId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId || !e.altKey) return;

      const shortcut = splitShortcuts[e.key];
      if (!shortcut) return;

      e.preventDefault();
      setBspTree((tree) =>
        updateNode(tree, selectedTileId, (node) => {
          const emptyTile = {
            id: crypto.randomUUID(),
            name: "New Tile",
            type: "leaf" as const,
            value: "",
          };

          return {
            id: crypto.randomUUID(),
            type: "split" as const,
            axis: shortcut.axis,
            ratio: 0.5,
            first: shortcut.selectedFirst ? node : emptyTile,
            second: shortcut.selectedFirst ? emptyTile : node,
          };
        }),
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTileId, setBspTree]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId || e.key !== "Delete") return;

      const nextNode = removeNode(bspTree, selectedTileId);
      if (nextNode) {
        setBspTree(nextNode);
        setSelectedTileId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bspTree, selectedTileId, setBspTree, setSelectedTileId]);

  return (
    <div
      className="print-page relative mx-0 border bg-background shadow-lg overflow-hidden"
      style={{ width, height }}
    >
      <Tile node={bspTree} />
    </div>
  );
}
