import { create } from "zustand";
import type { EditorMode } from "../types";

interface EditorState {
  mode: EditorMode;
  pageWidth: number;
  pageHeight: number;
  setMode: (mode: EditorMode) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: "select",
  pageWidth: 794,
  pageHeight: 1123,
  setMode: (mode) => set({ mode }),
}));
