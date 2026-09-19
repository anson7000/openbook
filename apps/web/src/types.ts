export type BlockType = "text" | "image" | "formula";

export interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
}

export type EditorMode = "select" | "text" | "image" | "formula";
