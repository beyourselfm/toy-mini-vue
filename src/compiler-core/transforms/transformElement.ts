import { NodeTypes } from '../ast'
import { Expression } from '../parse'
import { TransformContext } from '../trasnform'
import { CREATE_ELEMENT } from '../utils'

export function transformElement(node:Expression, context:TransformContext) {
  if (node.type === NodeTypes.ELEMENT) {
    context.helperAdd(CREATE_ELEMENT)
    const { children, tag, props } = node
    const vnodeTag = tag
    const vnodeProps = props

    const vnode = {
      type: NodeTypes.ELEMENT,
      tag: vnodeTag,
      props: vnodeProps,
      children,
    }
    node.codegenNode = vnode
  }
}
