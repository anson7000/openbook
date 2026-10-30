import { Extension } from "@tiptap/core";
import { type Mark } from "@tiptap/pm/model";
import { type Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

// Font size the editor inherits from the document when no size mark is set.
export const BASE_FONT_SIZE_PX = 16;

const fontSizeStrutKey = new PluginKey("fontSizeStrut");

function marksFontSize(marks: readonly Mark[] | null | undefined): number | null {
  const fontSize = marks?.find((mark) => mark.type.name === "textStyle")?.attrs
    .fontSize;
  const size = Number.parseFloat(fontSize ?? "");

  return Number.isFinite(size) ? size : null;
}

/**
 * Size the text typed at the caret will get, which is what the caret should
 * look like: stored marks win, then the mark already at the cursor.
 */
function pendingFontSize(state: EditorState): number | null {
  if (!state.selection.empty) return null;

  return (
    marksFontSize(state.storedMarks) ??
    marksFontSize(state.selection.$from.marks())
  );
}

/**
 * Size every line box in the block reserves room for. Line boxes are reserved
 * at the block font size, so text marked smaller than the block still occupies
 * a full-size line, and the caret of an empty block ignores the pending size.
 *
 * Returns null when the block must keep the inherited size, which is the case
 * as soon as it contains text without a size mark: resizing the block would
 * resize that text too.
 */
function textblockFontSize(
  node: ProseMirrorNode,
  caretSize: number | null,
): number | null {
  const sizes: number[] = [];
  let hasUnmarkedText = false;

  node.forEach((child) => {
    if (!child.isText) return;

    const size = marksFontSize(child.marks);
    if (size === null) hasUnmarkedText = true;
    else sizes.push(size);
  });

  if (hasUnmarkedText) return null;

  if (caretSize !== null) return caretSize;

  const [first] = sizes;
  const uniform = sizes.every((size) => size === first);

  return uniform && first < BASE_FONT_SIZE_PX ? first : null;
}

export const FontSizeStrut = Extension.create({
  name: "fontSizeStrut",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: fontSizeStrutKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            const caretSize = pendingFontSize(state);
            const caret = state.selection.head;

            state.doc.descendants((node, pos) => {
              if (!node.isTextblock) return true;

              const hasCaret = caret > pos && caret <= pos + node.nodeSize;
              const size = textblockFontSize(
                node,
                hasCaret ? caretSize : null,
              );
              if (size === null || size === BASE_FONT_SIZE_PX) return true;

              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  style: `font-size: ${size}px`,
                }),
              );

              return true;
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});