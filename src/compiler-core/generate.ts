import { isString } from '../utils'
import { NodeTypes } from './ast'
import { BaseExpression, Expression } from './parse'
import { CREATE_ELEMENT, DISPLAY_STRING, helperMapName } from './utils'

export type GenerateResult = {
  code:string
}
export type GenerateContext = {
  code:string,
  push:CodePushFunc
  alias:(val:symbol)=> string
}

const TOY = 'Toy'

export type CodePushFunc = (val:string)=>void
function createGenerateContext() :GenerateContext {
  const context = {
    code: '',
    push(val:string) {
      context.code += val
    },
    alias(val:symbol) {
      return `_${helperMapName[val]}`
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
    case NodeTypes.ELEMENT:
      genElement(node, context)
      break

    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context)
      break
    default:
      break
  }
}

function genElement(node:Expression, context:GenerateContext) {
  const { push, alias } = context
  const { tag, children, props } = node.codegenNode

  push(`${alias(CREATE_ELEMENT)}( `)
  genNodeList(genNullable([ tag, props, children ]), context)
  push(')')
}
function genNullable(args:any[]) {
  return args.map(arg => arg || 'null')
}
function genNodeList(nodes:Expression[], context:GenerateContext) {
  const { push } = context
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (isString(node))
      push(node)
    else
      genNode(node, context)

    // add , (unless the last one)
    if (i < nodes.length - 1)
      push(', ')
  }
}
function genInterpolation(node: Expression, context: GenerateContext) {
  const { push, alias } = context
  push(`${alias(DISPLAY_STRING)}(`)
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

function genCompoundExpression(node: BaseExpression, context: GenerateContext) {
  const { children } = node
  const { push } = context
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (isString(node))
      push(node)
    else
      genNode(node, context)
  }
}

