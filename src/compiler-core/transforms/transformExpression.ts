import { NodeTypes } from '../ast'
import { Expression } from '../parse'
import { TransformContext } from '../transform'
import { DISPLAY_STRING } from '../utils'

export function transformExpression(node:Expression, context:TransformContext) {
  if (node.type === NodeTypes.INTERPOLATION) {
    const content = node.content as Expression

    const rawContent = content.content
    content.content = `_ctx.${rawContent}`
  }
}
