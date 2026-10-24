import { create } from "zustand";
import type { Editor } from "@tiptap/react";
import { type BSPNode } from "../lib/bspTree";

type EditorState = {
  bspTree: BSPNode;
  selectedTileId: string | null;
  activeEditor: Editor | null;
  setBspTree: (update: BSPNode | ((tree: BSPNode) => BSPNode)) => void;
  setSelectedTileId: (id: string | null) => void;
  setActiveEditor: (editor: Editor | null) => void; // Expose active editor for the Right Panel
  clearActiveEditor: (editor: Editor) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  bspTree: {
    id: crypto.randomUUID(),
    name: "Root",
    type: "leaf",
    value: "",
  },
  selectedTileId: null,
  activeEditor: null,
  setBspTree: (update) =>
    set((state) => ({
      bspTree: typeof update === "function" ? update(state.bspTree) : update,
    })),
  setSelectedTileId: (id) => set({ selectedTileId: id }),
  setActiveEditor: (activeEditor) => set({ activeEditor }),
  clearActiveEditor: (editor) =>
    set((state) =>
      state.activeEditor === editor ? { activeEditor: null } : state,
    ),
}));
