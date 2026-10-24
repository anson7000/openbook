import { create } from "zustand";
import { type BSPNode, type Page } from "../lib/types";
import { type Editor } from "@tiptap/react";

type EditorState = {
  bspTrees: Map<string, BSPNode>;
  pages: Page[];
  editors: Map<string, Editor>; // Assume tile id is unique
  selectedPageId: string;
  selectedTileId: string | null;
  setPages: (pages: Page[]) => void;
  registerBspTree: (id: string, bspTree: BSPNode) => void;
  registerEditor: (id: string, editor: Editor) => void;
  unregisterEditor: (id: string) => void;
  setSelectedPageId: (id: string) => void;
  setSelectedTileId: (id: string | null) => void;
};

const initialTree: BSPNode = {
  id: crypto.randomUUID(),
  type: "leaf",
  name: "New Tile",
  value: "",
};
const initialPage: Page = {
  id: crypto.randomUUID(),
  name: "Page 1",
  bspTreeId: initialTree.id,
};

export const useEditorStore = create<EditorState>((set) => ({
  bspTrees: new Map([[initialTree.id, initialTree]]),
  pages: [initialPage],
  editors: new Map(),
  selectedPageId: initialPage.id,
  selectedTileId: null,
  setPages: (pages) => set({ pages }),
  registerBspTree: (id, bspTree) =>
    set((state) => {
      const bspTrees = new Map(state.bspTrees);
      bspTrees.set(id, bspTree);
      return { bspTrees };
    }),
  registerEditor: (id, editor) =>
    set((state) => {
      const editors = new Map(state.editors);
      editors.set(id, editor);
      return { editors };
    }),

  unregisterEditor: (id) =>
    set((state) => {
      const editors = new Map(state.editors);
      editors.delete(id);
      return { editors };
    }),

  setSelectedPageId: (id) => set({ selectedPageId: id }),
  setSelectedTileId: (id) => set({ selectedTileId: id }),
}));
