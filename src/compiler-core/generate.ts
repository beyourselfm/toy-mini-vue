import { NodeTypes } from './ast'
import { Expression } from './parse'
import { DISPLAY_STRING, helperMapName } from './utils'

export type GenerateResult = {
  code:string
}
export type GenerateContext = {
  code:string,
  push:CodePushFunc
}

const TOY = 'Toy'

export type CodePushFunc = (val:string)=>void
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
  genFunctionPre(ast, context)

  push('return ')
  const functionName = 'render'
  const args = [ '_ctx', '_cache' ]
  const singatrue = args.join(', ')

  push(`function ${functionName}(${singatrue}){\n`)
  push('return ')
  genNode(ast.codegenNode, context)
  push('\n}')
  return {
    code: context.code,
  }
}

function genFunctionPre(ast:Expression, context:GenerateContext) {
  const alias = (val:string) => `${helperMapName[val]}: _${helperMapName[val]}`
  if (ast.helpers.length > 0)
    context.push(`const {${ast.helpers.map(alias).join(', ')}} = ${TOY} \n"`)
}
function genNode(node:Expression, context:GenerateContext) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    default:
      break
  }
}

function genInterpolation(node: Expression, context: GenerateContext) {
  const { push } = context
  push(`_${helperMapName[DISPLAY_STRING]}(`)
  genNode(node.content as Expression, context)
  push(')')
}

function genText(node: Expression, context: GenerateContext) {
  context.push(`'${node.content}'`)
}

function genExpression(node: Expression, context: GenerateContext) {
  const { push } = context
  push(`${node.content}`)
}

