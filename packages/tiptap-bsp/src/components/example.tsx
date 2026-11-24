import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export default () => {
  return (
    <NodeViewWrapper className="react-component">
      <label contentEditable={false}>React Component</label>

      <NodeViewContent className="content is-editable" />
    </NodeViewWrapper>
  )
}