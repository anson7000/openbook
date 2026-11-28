import { Extension } from "@tiptap/core";
import type { Node as ProseMirrorNode, ResolvedPos } from "@tiptap/pm/model";

export type SplitDirection = "horizontal" | "vertical";

export interface SplitLeafOptions {
  direction: SplitDirection;
  ratio?: number;
  pos?: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    bspLayout: {
      /**
       * Splits the active (or targeted) bspLeaf into two bspLeaf nodes
       * wrapped inside a new bspNode container.
       */
      splitLeaf: (options: SplitLeafOptions) => ReturnType;
    };
  }
}

function findTargetLeaf(
  doc: ProseMirrorNode,
  selectionFrom: number,
  explicitPos?: number,
): { leafNode: ProseMirrorNode; leafPos: number } | null {
  if (typeof explicitPos === "number") {
    const node = doc.nodeAt(explicitPos);
    if (node && node.type.name === "bspLeaf") {
      return { leafNode: node, leafPos: explicitPos };
    }
    return null;
  }

  const $pos: ResolvedPos = doc.resolve(selectionFrom);
  for (let depth = $pos.depth; depth >= 0; depth--) {
    const node = $pos.node(depth);
    if (node.type.name === "bspLeaf") {
      const leafPos = depth === 0 ? 0 : $pos.before(depth);
      return { leafNode: node, leafPos };
    }
  }

  return null;
}

export const BspLayout = Extension.create({
  name: "bspLayout",

  addCommands() {
    return {
      splitLeaf:
        ({ direction, ratio = 0.5, pos }) =>
        ({ state, tr, dispatch }) => {
          const target = findTargetLeaf(state.doc, state.selection.from, pos);
          if (!target) {
            console.error(
              "No bspLeaf found to split at the current selection or specified position.",
            );
            return false;
          }

          const { leafNode, leafPos } = target;
          const schema = state.schema;
          const bspContainerType = schema.nodes.bspContainer;
          const bspLeafType = schema.nodes.bspLeaf;

          if (!bspContainerType || !bspLeafType) {
            console.error(
              "Required node types (bspContainer, bspLeaf, paragraph) are not defined in the schema.",
            );
            return false;
          }

          // Dry-run check (e.g. editor.can().splitLeaf(...))
          if (!dispatch) {
            return true;
          }

          // 1. Preserve existing leaf content in the first child
          const firstLeaf = bspLeafType.create(
            leafNode.attrs,
            leafNode.content,
            leafNode.marks,
          );

          // 2. Create a valid second bspLeaf with a default paragraph (content: 'block+')
          const secondLeaf = bspLeafType.createAndFill(
            {},
            schema.text("New pane"),
          );

          if (!secondLeaf) {
            console.error(
              "Failed to create a second bspLeaf with default content. Ensure that the bspLeaf node can contain a paragraph.",
            );
            return false;
          }

          // 3. Wrap both leaves in a bspContainer
          const splitContainer = bspContainerType.create({ direction, ratio }, [
            firstLeaf,
            secondLeaf,
          ]);

          const from = leafPos;
          const to = leafPos + leafNode.nodeSize;

          tr.replaceWith(from, to, splitContainer);
          dispatch(tr);

          return true;
        },
    };
  },
});
