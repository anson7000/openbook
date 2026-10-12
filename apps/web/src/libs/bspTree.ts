type LeafNode = {
  id: string;
  type: "leaf";
  value: string;
};

type SplitNode = {
  id: string;
  type: "split";
  axis: "x" | "y";
  ratio: number;
  first: BSPNode;
  second: BSPNode;
};

export type BSPNode = LeafNode | SplitNode;

export function updateNode(
  node: BSPNode,
  id: string,
  updater: (node: BSPNode) => BSPNode,
): BSPNode {
  if (node.id === id) return updater(node);
  if (node.type === "leaf") return node;
  return {
    ...node,
    first: updateNode(node.first, id, updater),
    second: updateNode(node.second, id, updater),
  };
}

export function removeNode(node: BSPNode, id: string): BSPNode | null {
  if (node.id === id) return null;
  if (node.type === "leaf") return node;
  const first = removeNode(node.first, id);
  const second = removeNode(node.second, id);
  if (!first) return second;
  if (!second) return first;
  return { ...node, first, second };
}

export function findLeaves(node: BSPNode): LeafNode[] {
  return node.type === "leaf"
    ? [node]
    : [...findLeaves(node.first), ...findLeaves(node.second)];
}
