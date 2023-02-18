import { baseParse } from './parse'
import { transformExpression } from './transforms'
import { transformElement } from './transforms/transformElement'
import { transformText } from './transforms/transformText'
import { transform } from './transform'
import { generate } from './generate'

export function baseCompile(template:string) {
  const ast = baseParse(template)
  transform(ast, {
    nodeTransforms: [ transformExpression, transformElement, transformText ],
  })
  return generate(ast)
}
