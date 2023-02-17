import { NodeTypes } from './ast'
import { BaseExpression, Expression, Root } from './parse'
import { CREATE_ELEMENT, DISPLAY_STRING } from './utils'

export type NodeTranform = (node:Expression, context:TransformContext) => Expression | void
export type TransformOptions = {
  nodeTransforms?:NodeTranform[]
}
export type Helper = (key:string|symbol)=>void
export type TransformContext={
  root:Root,
  nodeTransforms:NodeTranform[],
  helpers: Set<string>
  helperAdd:Helper
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
    transform(node, context)
  }
  switch (node.type) {
    case NodeTypes.INTERPOLATION:

      context.helperAdd((DISPLAY_STRING))

      break

    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
    case NodeTypes.COMPOUND_EXPRESSION:
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
    helpers: new Set<string>(),
    helperAdd(key:string) {
      context.helpers.add(key)
    },
  }
  return context
}

function createRootCodegen(root: BaseExpression) {
  const child = root.children[0]
  if (child.type === NodeTypes.ELEMENT)
    root.codegenNode = child
  else
    root.codegenNode = root.children[0]
}

