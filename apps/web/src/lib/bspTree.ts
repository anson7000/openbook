import { type BSPNode, type LeafNode } from "./types";

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

export function findLeaveById(node: BSPNode, id: string): LeafNode | null {
  if (node.type === "leaf") return node.id === id ? node : null;
  return findLeaveById(node.first, id) || findLeaveById(node.second, id);
}
