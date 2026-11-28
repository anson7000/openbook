import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ExampleComponent } from "../components/example";

export const BspLeaf = Node.create({
  name: "bspLeaf",

  group: "block",

  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "bsp-leaf",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["bsp-leaf", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExampleComponent);
  },
});