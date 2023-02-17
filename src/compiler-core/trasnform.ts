import { NodeTypes } from './ast'
import { BaseExpression, Expression, Root } from './parse'
import { DISPLAY_STRING } from './utils'

export type NodeTranform = (node:Expression) => Expression | void
export type TransformOptions = {
  nodeTransforms?:NodeTranform[]
}
export type Helper = (key:string|symbol)=>void
export type TransformContext={
  root:Root,
  nodeTransforms:NodeTranform[],
  helpers: Map<string, Helper>
  helper:Helper
}

export function transform(root:Root, options :TransformOptions = {}) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
  createRootCodegen(root)
  root.helpers = [ ...context.helpers.keys() ]
}
function traverseNode(node: Expression, context:TransformContext) {
  const { nodeTransforms } = context
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node)
  }
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper((DISPLAY_STRING))
      break

    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break

    default:
      break
  }
}

function traverseChildren(node:Expression, context:TransformContext) {
  const children = node.children

  if (children) {
    for (let i = 0; i < children.length; i++)
      traverseNode(children[i], context)
  }
}

function createTransformContext(root: Root, options: TransformOptions) :TransformContext {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key:string) {
      context.helpers.set(key, 1)
    },
  }
  return context
}

function createRootCodegen(root: BaseExpression) {
  root.codegenNode = root.children[0]
}

