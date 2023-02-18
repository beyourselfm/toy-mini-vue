import { NodeTypes } from '../ast'
import { Expression } from '../parse'

export function transformText(node:Expression) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      const { children } = node
      const isTextOrInterpolation = (node:Expression) => node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION
      let currentContainer:Expression | null = null
      for (let i = 0; i < children.length; i++) {
        const node = children[i]

        if (isTextOrInterpolation(node)) {
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j]
            if (isTextOrInterpolation(next)) {
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [ node ],
                }
              }

              (currentContainer.children as any[]).push(' + ')
              currentContainer.children.push(next)
              children.splice(j, 1)
              j--
            }
            else {
              currentContainer = null
              break
            }
          }
        }
      }
    }
  }
}
