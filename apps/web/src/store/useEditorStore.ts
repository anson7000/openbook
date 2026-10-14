import { create } from "zustand";
import { type BSPNode } from "../libs/bspTree";

type EditorState = {
  bspTree: BSPNode;
  selectedTileId: string | null;
  setBspTree: (update: BSPNode | ((tree: BSPNode) => BSPNode)) => void;
  setSelectedTileId: (id: string | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  bspTree: {
    id: crypto.randomUUID(),
    type: "leaf",
    value: "",
  },
  selectedTileId: null,
  setBspTree: (update) =>
    set((state) => ({
      bspTree: typeof update === "function" ? update(state.bspTree) : update,
    })),
  setSelectedTileId: (id) => set({ selectedTileId: id }),
}));
