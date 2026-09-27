import type { ComponentType, SVGProps } from "react";

export type BlockType = "text" | "image" | "formula";

export type ResizeDirection =
  "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
}

export interface ResizeSession {
  blockId: string;
  direction: ResizeDirection;
  startX: number;
  startY: number;
  block: Block;
}

export interface DragSession {
  blockId: string;
  startX: number;
  startY: number;
  block: Block;
}

export type EditorMode = "select" | "text" | "image" | "formula";

export interface Tool {
  /** Accessible name for the tool. Shown to screen readers only. */
  label: string;
  mode: EditorMode;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}
