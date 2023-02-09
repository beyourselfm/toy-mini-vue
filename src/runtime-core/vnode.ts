import { isString } from "../utils"
import { ComponentInstance } from "./component"
import { ShapeFlags } from "./ShapeFlags"

export type VNodeComponent = {
  render?: () => any
  setup?: (props?: VNodeProps) => any
}
export type VNodeType = | string | VNodeComponent
export type Children = string | VNode | ChildrenWithArray
export type ChildrenWithArray = string[] | VNode[]
export type VNodeProps = {
  key?: string | number | symbol

} & Record<string | number | symbol, any>
export type VNode = {
  el: HTMLElement | null
  type: VNodeType
  props: VNodeProps
  children: Children
  shapeFlag: ShapeFlags
}

export function createVNode(type: VNodeType, props?: VNodeProps, children?: Children): VNode {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type)
  }
  if (isString(children)) {
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN
  }

  return vnode
}

function getShapeFlag(type: VNodeType) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
