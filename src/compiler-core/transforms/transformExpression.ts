import { NodeTypes } from '../ast'
import { Expression } from '../parse'

export function transformExpression(node:Expression) {
  if (node.type === NodeTypes.INTERPOLATION) {
    const content = node.content as Expression

    const rawContent = content.content
    content.content = `_ctx.${rawContent}`
  }
}
