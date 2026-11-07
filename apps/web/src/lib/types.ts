import { type JSONContent } from "@tiptap/core";

export type LeafNode = {
  id: string;
  type: "leaf";
  name: string;
  value: JSONContent;
};

export type SplitNode = {
  id: string;
  type: "split";
  axis: "x" | "y";
  ratio: number;
  first: BSPNode;
  second: BSPNode;
};

export type BSPNode = LeafNode | SplitNode;

export type PageOrientation = "portrait" | "landscape";

export type Page = {
  id: string;
  name: string;
  order: number;
  bspTree: BSPNode;
  cheatsheetId: string;
  orientation?: PageOrientation;
};

export type Cheatsheet = {
  id: string;
  name: string;
};

export type Image = {
  id: string;
  blob: Blob;
  mimeType: string;
};
