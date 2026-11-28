import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { BspContainerView } from "../components/BspContainerView";

export const BspContainer = Node.create({
  name: "bspContainer",

  group: "block",

  content: "(bspContainer | bspLeaf){2}",

  defining: true,

  parseHTML() {
    return [
      {
        tag: "bsp-container",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["bsp-container", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BspContainerView);
  },

  addAttributes() {
    return {
      direction: { default: "horizontal" }, // 'horizontal' | 'vertical'
      ratio: { default: 0.5 },
    };
  },
});
