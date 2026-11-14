import { useEffect } from "react";
import Tile from "./Tile";
import { removeNode, updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import type { BSPNode, Page as PageRecord } from "../lib/types";
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
  page: PageRecord;
  width: number;
  height: number;
};

export default function Page({ page, width, height }: PageProps) {
  const { selectedPageId, selectedTileId, setSelectedTileId } =
    useEditorStore();

  const isSelectedPage = page.id === selectedPageId;

  useEffect(() => {
    if (!isSelectedPage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId) return;

      if (e.key === "Escape") {
        setSelectedTileId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelectedPage, selectedTileId, setSelectedTileId]);

  useEffect(() => {
    if (!isSelectedPage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId || !e.altKey) return;

      const shortcut = splitShortcuts[e.key];
      if (!shortcut) return;

      e.preventDefault();

      const newTile: BSPNode = {
        id: crypto.randomUUID(),
        type: "leaf",
        name: "New Tile",
        value: { type: "doc", content: [{ type: "paragraph" }] },
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
  }, [isSelectedPage, selectedTileId, page.bspTree, page.id]);

  useEffect(() => {
    if (!isSelectedPage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTileId || e.key !== "Delete") return;

      const nextNode = removeNode(page.bspTree, selectedTileId);
      if (nextNode) {
        db.pages.update(page.id, { bspTree: nextNode });
        setSelectedTileId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelectedPage, page.id, selectedTileId, page.bspTree, setSelectedTileId]);

  return (
    <div
      className="print-page relative mx-0 border bg-background shadow-lg overflow-hidden"
      data-orientation={page.orientation ?? "portrait"}
      style={{ width, height }}
    >
      <Tile node={page.bspTree} page={page} />
    </div>
  );
}
