import { Children, createVNode, VNodeProps, VNodeType } from "./vnode";

export function h(type: VNodeType, props?: VNodeProps, children?: Children) {
  return createVNode(type, props, children)
}