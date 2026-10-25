import { useEffect } from "react";
import Tile from "./Tile";
import { removeNode, updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import type { BSPNode } from "../lib/types";

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
  const {
    pages,
    selectedPageId,
    selectedTileId,
    bspTrees,
    registerBspTree,
    setSelectedTileId,
  } = useEditorStore();

  const page = pages.find((page) => page.id === selectedPageId);
  if (!page) return null;

  const bspTree = bspTrees.get(page.bspTreeId);
  if (!bspTree) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId) return;

      if (e.key === "Escape") {
        setSelectedTileId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTileId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId || !e.altKey) return;

      const shortcut = splitShortcuts[e.key];
      if (!shortcut) return;

      e.preventDefault();

      const newTile: BSPNode = {
        id: crypto.randomUUID(),
        type: "leaf",
        name: "New Tile",
        value: "",
      };

      const newBspTree = updateNode(bspTree, selectedTileId, (node) => {
        return {
          id: crypto.randomUUID(),
          type: "split",
          axis: shortcut.axis,
          ratio: 0.5,
          first: shortcut.selectedFirst ? node : newTile,
          second: shortcut.selectedFirst ? newTile : node,
        };
      });

      registerBspTree(page.bspTreeId, newBspTree);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTileId, bspTree, page.bspTreeId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId || e.key !== "Delete") return;

      const nextNode = removeNode(bspTree, selectedTileId);
      if (nextNode) {
        registerBspTree(page.bspTreeId, nextNode);
        setSelectedTileId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bspTree, selectedTileId, page.bspTreeId]);

  return (
    <div
      className="print-page relative mx-0 border bg-background shadow-lg overflow-hidden"
      style={{ width, height }}
    >
      <Tile node={bspTree} />
    </div>
  );
}
