import { ComponentInstance } from "./component"

export type VNodeComponent = {
  render?: () => any
  setup?: () => any
}
export type VNodeType = | string | VNodeComponent
export type Children = string | VNode | ChildrenWithArray
export type ChildrenWithArray = string[] | VNode[]
export type VNodeProps = {
  key?: string | number | symbol
}
export type VNode = {
  el: HTMLElement | null
  type: VNodeType
  props: VNodeProps
  children: Children
}

export function createVNode(type: VNodeType, props?: VNodeProps, children?: Children): VNode {
  const vnode = {
    type,
    props,
    children,
    el: null
  }

  return vnode
}