import { findLeaves, updateNode } from "../lib/bspTree";
import { useEditorStore } from "../store/useEditorStore";
import { useState } from "react";

export default function LeftPanel() {
  const { bspTree, selectedTileId, setBspTree, setSelectedTileId } =
    useEditorStore();
  const leaves = findLeaves(bspTree);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const handleTileItemEdit = (id: string, name: string) => {
    setSelectedTileId(id);
    setEditingTileId(id);
    setDraftName(name);
  };

  const hanldeTileItemEditFinish = () => {
    if (!editingTileId) return;

    const nextName = draftName.trim();
    if (nextName) {
      setBspTree((tree) =>
        updateNode(tree, editingTileId, (node) =>
          node.type === "leaf" ? { ...node, name: nextName } : node,
        ),
      );
    }
    setEditingTileId(null);
  };

  return (
    <aside
      aria-label="Left placeholder panel"
      className="w-56 border-r bg-background"
    >
      <div className="flex h-full flex-col gap-2 p-2">
        <h2>Tiles</h2>
        <div className="flex flex-col gap-1 p-1 select-none">
          {leaves.map((leaf) => (
            <div
              key={leaf.id}
              className={
                selectedTileId === leaf.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }
              onClick={() => setSelectedTileId(leaf.id)}
              onDoubleClick={() => handleTileItemEdit(leaf.id, leaf.name)}
            >
              {editingTileId === leaf.id ? (
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
                leaf.name
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
