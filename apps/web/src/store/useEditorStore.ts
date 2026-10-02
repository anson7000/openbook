import { create } from "zustand";
import type { EditorMode } from "../types";

interface EditorState {
  mode: EditorMode;
  canvasWidth: number;
  canvasHeight: number;
  setMode: (mode: EditorMode) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: "select",
  canvasWidth: 794,
  canvasHeight: 1123,
  setMode: (mode) => set({ mode }),
}));
