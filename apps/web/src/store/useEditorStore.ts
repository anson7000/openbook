import { create } from "zustand";
import type { EditorMode } from "../types";

interface EditorState {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: "select",
  setMode: (mode) => set({ mode }),
}));
