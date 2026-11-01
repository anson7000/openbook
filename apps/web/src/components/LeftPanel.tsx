import { findLeaves, updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import { useState } from "react";
import { db } from "../lib/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function LeftPanel() {
  const {
    selectedCheatsheetId,
    selectedPageId,
    selectedTileId,
    setSelectedPageId,
    setSelectedTileId,
  } = useEditorStore();
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const pages =
    useLiveQuery(
      () =>
        selectedCheatsheetId
          ? db.pages
              .where("cheatsheetId")
              .equals(selectedCheatsheetId)
              .sortBy("order")
          : [],
      [selectedCheatsheetId],
    ) ?? [];

  const page = pages.find((page) => page.id === selectedPageId);
  const tiles = page ? findLeaves(page.bspTree) : [];

  const handleTileItemEdit = (id: string, name: string) => {
    setSelectedTileId(id);
    setEditingTileId(id);
    setDraftName(name);
  };

  const hanldeTileItemEditFinish = () => {
    if (!editingTileId || !page) {
      setEditingTileId(null);
      return;
    }

    const nextName = draftName.trim();
    if (nextName) {
      const newBspTree = updateNode(
        page.bspTree,
        editingTileId,
        (currentNode) => {
          return {
            ...currentNode,
            name: nextName,
          };
        },
      );

      db.pages.update(page.id, { bspTree: newBspTree });
    }
    setEditingTileId(null);
  };

  const handleAddPage = async () => {
    if (!selectedCheatsheetId) return;

    const newTree = {
      id: crypto.randomUUID(),
      type: "leaf" as const,
      name: "New Tile",
      value: "",
    };

    const newPage = {
      name: `Page ${pages.length + 1}`,
      order: pages.length,
      bspTree: newTree,
      cheatsheetId: selectedCheatsheetId,
    };

    const pageId = await db.pages.add(newPage);
    setSelectedPageId(pageId);
    setSelectedTileId(null);
  };

  const handleSelectPage = (pageId: string) => {
    setSelectedPageId(pageId);
    setSelectedTileId(null);
  };

  return (
    <aside
      aria-label="Left placeholder panel"
      className="w-56 border-r bg-background flex flex-col"
    >
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between">
          <h2>Pages</h2>
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddPage}
          >
            add page
          </button>
        </div>

        <div className="flex flex-col gap-1 p-1 select-none">
          {pages.map((page) => (
            <div
              key={page.id}
              className={
                selectedPageId === page.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }
              onClick={() => handleSelectPage(page.id)}
            >
              {page.name}
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-full flex-col gap-2 p-2">
        <h2>Tiles</h2>
        <div className="flex flex-col gap-1 p-1 select-none">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className={
                selectedTileId === tile.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }
              onClick={() => setSelectedTileId(tile.id)}
              onDoubleClick={() => handleTileItemEdit(tile.id, tile.name)}
            >
              {editingTileId === tile.id ? (
                <input
                  autoFocus
                  aria-label="Tile name"
                  className="w-full bg-transparent outline-none"
                  onBlur={hanldeTileItemEditFinish}
                  onChange={(event) => setDraftName(event.target.value)}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") hanldeTileItemEditFinish();
                    if (event.key === "Escape") setEditingTileId(null);
                  }}
                  value={draftName}
                />
              ) : (
                tile.name
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
