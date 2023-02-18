import { NodeTypes } from './ast'
import { BaseExpression, Expression, Root } from './parse'
import { DISPLAY_STRING } from './const'

export type OnExitFunc = () => void
export type NodeTranform = (node:Expression, context:TransformContext) => OnExitFunc | void
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
  const onExitFns:OnExitFunc[] = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    const onExit = transform(node, context)
    if (onExit)
      onExitFns.push(onExit)
  }
  switch (node.type) {
    case NodeTypes.INTERPOLATION:

      context.helperAdd((DISPLAY_STRING))

      break

    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break

    default:
      break
  }
  let i = onExitFns.length
  while (i--)
    onExitFns[i]()
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

