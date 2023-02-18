import { describe, expect, it } from 'vitest'
import { NodeTypes } from '../ast'
import { Expression, baseParse } from '../parse'
import { transform } from '../transform'

describe('transform', () => {
  it('', () => {
    const ast = baseParse('<div>hi,{{message}}</div>')
    const plugin = (node:Expression) => {
      if (node.type === NodeTypes.TEXT)
        node.content += 'asdj'
    }

    transform(ast, {
      nodeTransforms: [ plugin ],
    })
    const nodeText = ast.children[0]
    expect(nodeText)
  })
})
