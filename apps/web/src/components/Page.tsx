import { useEffect } from "react";
import Tile from "./Tile";
import { updateNode } from "../libs/bspTree";
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
      } else if (e.altKey) {
        e.preventDefault();

        const shortcut = splitShortcuts[e.key];
        if (!shortcut) return;

        setBspTree((tree) =>
          updateNode(tree, selectedTileId, (node) => {
            const emptyTile = {
              id: crypto.randomUUID(),
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
