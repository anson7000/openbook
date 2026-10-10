import { create } from "zustand";
import type { EditorMode, Block, Page } from "../types";

const defaultPage: Page = {
  id: crypto.randomUUID(),
  blocks: [],
  width: 794,
  height: 1123,
};

interface EditorState {
  mode: EditorMode;
  pages: Page[];
  selectedPageId: string;
  selectedBlockId: string | null;
  setMode: (mode: EditorMode) => void;
  setSelectedBlockId: (selectedBlockId: string | null) => void;
  addPageBlock: (pageId: string, block: Block) => void;
  setPageBlockPosition: (
    pageId: string,
    blockId: string,
    x: number,
    y: number,
  ) => void;
  setPageBlockSize: (
    pageId: string,
    blockId: string,
    width: number,
    height: number,
  ) => void;
  setPageBlockContent: (
    pageId: string,
    blockId: string,
    content: string,
  ) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: "select",
  pages: [defaultPage],
  selectedPageId: defaultPage.id,
  selectedBlockId: null,
  setMode: (mode) => set({ mode }),
  setSelectedBlockId: (selectedBlockId) => set({ selectedBlockId }),
  addPageBlock: (pageId, block) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? { ...page, blocks: [...page.blocks, block] }
          : page,
      ),
    })),
  setPageBlockPosition: (pageId, blockId, x, y) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: page.blocks.map((block) =>
                block.id === blockId ? { ...block, x, y } : block,
              ),
            }
          : page,
      ),
    })),
  setPageBlockSize: (pageId, blockId, width, height) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: page.blocks.map((block) =>
                block.id === blockId ? { ...block, width, height } : block,
              ),
            }
          : page,
      ),
    })),
  setPageBlockContent: (pageId, blockId, content) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: page.blocks.map((block) =>
                block.id === blockId ? { ...block, content } : block,
              ),
            }
          : page,
      ),
    })),
}));
