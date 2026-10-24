import { findLeaves, updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import { useState } from "react";

export default function LeftPanel() {
  const {
    pages,
    bspTrees,
    selectedPageId,
    selectedTileId,
    registerBspTree,
    setPages,
    setSelectedPageId,
    setSelectedTileId,
  } = useEditorStore();
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const selectedPage = pages.find((page) => page.id === selectedPageId);
  if (!selectedPage) return null;

  const bspTree = bspTrees.get(selectedPage.bspTreeId);
  if (!bspTree) return null;

  const tiles = findLeaves(bspTree);

  const handleTileItemEdit = (id: string, name: string) => {
    setSelectedTileId(id);
    setEditingTileId(id);
    setDraftName(name);
  };

  const hanldeTileItemEditFinish = () => {
    if (!editingTileId) return;

    const nextName = draftName.trim();
    if (nextName) {
      const newBspTree = updateNode(bspTree, editingTileId, (currentNode) => {
        return {
          ...currentNode,
          name: nextName,
        };
      });

      registerBspTree(selectedPage.bspTreeId, newBspTree);
    }
    setEditingTileId(null);
  };

  const handleAddPage = () => {
    const newTree = {
      id: crypto.randomUUID(),
      type: "leaf" as const,
      name: "New Tile",
      value: "",
    };

    const newPage = {
      id: crypto.randomUUID(),
      name: `Page ${pages.length + 1}`,
      bspTreeId: newTree.id,
    };

    registerBspTree(newTree.id, newTree);
    setPages([...pages, newPage]);
    setSelectedPageId(newPage.id);
    setSelectedTileId(null);
  };

  const handleSelectPage = (pageId: string) => {
    setSelectedPageId(pageId);
    setSelectedTileId(null);
  }

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
