import { Expression, Root } from './parse'

export type NodeTranform = (node:Expression) => Expression | void
export type TransformOptions = {
  nodeTransforms?:NodeTranform[]
}
export type TransformContext={
  root:Root,
  nodeTransforms:NodeTranform[]
}
export function transform(root:Root, options ?:TransformOptions) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
}
function traverseNode(node: Expression, context:TransformContext) {
  const { nodeTransforms } = context
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node)
  }
  traverseChildren(node, context)
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
  }
  return context
}

