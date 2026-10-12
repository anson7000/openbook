import { create } from "zustand";

type EditorState = {
  selectedTileId: string | null;
  setSelectedTileId: (id: string | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  selectedTileId: null,
  setSelectedTileId: (id) => set({ selectedTileId: id }),
}));
