import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { BspLeafView } from "../components/BspLeafView";

export const BspLeaf = Node.create({
  name: "bspLeaf",

  group: "block",

  content: "inline*",

  isolating: true,

  defining: true,

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

  addKeyboardShortcuts() {
  return {
    Enter: () => this.editor.commands.insertContent('\n'),
  }
},

  addNodeView() {
    return ReactNodeViewRenderer(BspLeafView);
  },
});