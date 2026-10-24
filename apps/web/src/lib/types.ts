export type LeafNode = {
  id: string;
  type: "leaf";
  name: string;
  value: string;
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

export type Page = {
  id: string;
  name: string;
  bspTreeId: string;
}