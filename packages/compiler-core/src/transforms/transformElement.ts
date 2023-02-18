import { NodeTypes } from '../ast'
import { Expression } from '../parse'
import { TransformContext } from '../transform'
import { CREATE_ELEMENT } from '../const'

export function transformElement(node:Expression, context:TransformContext) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      context.helperAdd(CREATE_ELEMENT)
      const { children, tag, props } = node

      const child = children[0] as any
      const vnodeTag = `'${tag}'`
      const vnodeProps = props

      const vnode = {
        type: NodeTypes.ELEMENT,
        tag: vnodeTag,
        props: vnodeProps,
        children: child,
      }
      node.codegenNode = vnode
    }
  }
}
