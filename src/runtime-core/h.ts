import {
  AnyObject,
  Children,
  createVNode,
  VNodeProps,
  VNodeType,
} from './vnode'

export function h<Node = AnyObject>(
  type: VNodeType,
  props?: VNodeProps,
  children?: Children<Node>
) {
  return createVNode(type, props, children)
}
