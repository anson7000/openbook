import { useEffect } from "react";
import Tile from "./Tile";
import { removeNode, updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import type { BSPNode } from "../lib/types";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";

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
  const { selectedPageId, selectedTileId, setSelectedTileId } =
    useEditorStore();

  const page = useLiveQuery(
    () => (selectedPageId ? db.pages.get(selectedPageId) : undefined),
    [selectedPageId],
  );

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
      if (!page || !selectedTileId || !e.altKey) return;

      const shortcut = splitShortcuts[e.key];
      if (!shortcut) return;

      e.preventDefault();

      const newTile: BSPNode = {
        id: crypto.randomUUID(),
        type: "leaf",
        name: "New Tile",
        value: "",
      };

      const newBspTree = updateNode(page.bspTree, selectedTileId, (node) => {
        return {
          id: crypto.randomUUID(),
          type: "split",
          axis: shortcut.axis,
          ratio: 0.5,
          first: shortcut.selectedFirst ? node : newTile,
          second: shortcut.selectedFirst ? newTile : node,
        };
      });

      db.pages.update(page.id, { bspTree: newBspTree });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTileId, page?.bspTree, page?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!page || !selectedTileId || e.key !== "Delete") return;

      const nextNode = removeNode(page.bspTree, selectedTileId);
      if (nextNode) {
        db.pages.update(page.id, { bspTree: nextNode });
        setSelectedTileId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page?.id, selectedTileId, page?.bspTree]);

  if (!page) return null;

  return (
    <div
      className="print-page relative mx-0 border bg-background shadow-lg overflow-hidden"
      style={{ width, height }}
    >
      <Tile node={page.bspTree} page={page} />
    </div>
  );
}
