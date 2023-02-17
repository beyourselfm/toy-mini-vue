import { describe, expect, test } from 'vitest'
import { generate } from '../generate'
import { baseParse } from '../parse'
import { transformExpression } from '../transforms'
import { transform } from '../trasnform'
describe('generate', () => {
  test('string', () => {
    const ast = baseParse('hi 1')
    transform(ast)
    const { code } = generate(ast)
    expect(code).toMatchInlineSnapshot(`
      "return function render(_ctx, _cache){
      return 'hi 1'
      }"
    `)
  })
  test('interpolation', () => {
    const ast = baseParse('{{message}}')
    transform(ast, {
      nodeTransforms: [ transformExpression ],
    })
    const { code } = generate(ast)
    expect(code).toMatchInlineSnapshot(`
      "const {displayString: _displayString} = Toy 
      \\"return function render(_ctx, _cache){
      return _displayString(_ctx.message)
      }"
    `)
  })
})
