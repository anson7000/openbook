import { type LeafNode } from "../libs/bspTree";

type TileLeafProps = {
  node: LeafNode;
};

export default function TileLeaf({ node }: TileLeafProps) {
  return <div className="bg-white text-black">{node.value}</div>;
}
