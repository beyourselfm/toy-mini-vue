import {
  AnyObject,
  Children,
  VNodeProps,
  VNodeType,
  createVNode,
} from './vnode'

export function h<Node = AnyObject>(
  type: VNodeType,
  props?: VNodeProps,
  children?: Children<Node>,
) {
  return createVNode(type, props, children)
}
