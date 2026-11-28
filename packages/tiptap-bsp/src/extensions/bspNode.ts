import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ExampleComponent } from "../components/example";

export const BspNode = Node.create({
  name: "bspNode",

  group: "block",

  content: "bspNode bspNode | bspNode bspLeaf | bspLeaf bspNode | bspLeaf bspLeaf",

  parseHTML() {
    return [
      {
        tag: "bsp-node",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["bsp-node", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExampleComponent);
  },
});