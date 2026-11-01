import { create } from "zustand";
import { type Editor } from "@tiptap/react";

type EditorState = {
  selectedCheatsheetId: string | null;
  selectedPageId: string | null;
  selectedTileId: string | null;
  selectedEditor: Editor | null;
  setSelectedCheatsheetId: (id: string | null) => void;
  setSelectedPageId: (id: string) => void;
  setSelectedTileId: (id: string | null) => void;
  setSelectedEditor: (editor: Editor | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  selectedCheatsheetId: null,
  selectedPageId: null,
  selectedTileId: null,
  selectedEditor: null,
  setSelectedCheatsheetId: (id) => set({ selectedCheatsheetId: id }),
  setSelectedPageId: (id) => set({ selectedPageId: id }),
  setSelectedTileId: (id) => set({ selectedTileId: id }),
  setSelectedEditor: (editor) => set({ selectedEditor: editor }),
}));
