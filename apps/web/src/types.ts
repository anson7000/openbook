import type { ComponentType, SVGProps } from "react";

export type BlockType = "text" | "image" | "formula";
export type BlockState = "select" | "edit" | "drag" | "resize";

export interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
}

export interface SelectInfo {
  blockId: string;
  blockState: BlockState;
}

export type EditorMode = "select" | "text" | "image" | "formula";

export interface Tool {
  /** Accessible name for the tool. Shown to screen readers only. */
  label: string;
  mode: EditorMode;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}
