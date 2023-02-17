import { describe, expect, test } from 'vitest'
import { generate } from '../generate'
import { baseParse } from '../parse'
import { transform } from '../trasnform'
describe('generate', () => {
  test('string', () => {
    const ast = baseParse('hi 1')
    transform(ast)
    const { code } = generate(ast)
    expect(code).toMatchInlineSnapshot('"return function render(_ctx, _cache){return \'hi 1\'}"')
  })
})
