import { Expression } from './parse'

export type GenerateResult = {
  code:string
}
export type GenerateContext = {
  code:string,
  push:(val:string) => void
}
function createGenerateContext() :GenerateContext {
  const context = {
    code: '',
    push(val:string) {
      context.code += val
    },
  }
  return context
}
export function generate(ast:Expression) :GenerateResult {
  const context = createGenerateContext()
  const { push } = context
  push('return ')
  const functionName = 'render'
  const args = [ '_ctx', '_cache' ]
  const singatrue = args.join(', ')

  push(`function ${functionName}(${singatrue}){`)
  push('return ')
  genNode(ast.codegenNode, context)
  push('}')
  return {
    code: context.code,
  }
}

function genNode(node:Expression, context:GenerateContext) {
  context.push(`'${node.content}'`)
}

