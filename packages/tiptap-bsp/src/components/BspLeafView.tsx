import {
  NodeViewContent,
  NodeViewWrapper,
  type NodeViewProps,
} from "@tiptap/react";

export const BspLeafView = ({ editor, getPos, selected }: NodeViewProps) => {
  const handleSplit = (direction: "horizontal" | "vertical") => {
    const pos = typeof getPos === "function" ? getPos() : undefined;
    const canRun = editor
      .can()
      .chain()
      .focus()
      .splitLeaf({ direction, pos })
      .run();

    if (!canRun) {
      console.error(
        "Cannot split the bspLeaf at the current selection or specified position.",
      );
      return;
    }

    editor.chain().focus().splitLeaf({ direction, pos }).run();
    console.log(editor.getJSON());
  };

  return (
    <NodeViewWrapper
      data-bsp-leaf=""
      data-selected={selected ? "true" : "false"}
      style={{
        position: "relative",
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: "auto",
        border: selected ? "1px solid #2563eb" : "1px solid #d1d5db",
        borderRadius: 6,
        background: "#ffffff",
      }}
    >
      <div
        contentEditable={false}
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "flex-end",
        }}
      >
        <button type="button" onClick={() => handleSplit("horizontal")}>
          Split H
        </button>
        <button type="button" onClick={() => handleSplit("vertical")}>
          Split V
        </button>
      </div>

      <NodeViewContent />
    </NodeViewWrapper>
  );
};
