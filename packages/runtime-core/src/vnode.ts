import { isString } from '@toy-vue/utils'
import { ComponentInstance } from './component'
import { Emit } from './componentEmit'
import { Text } from './renderer'
import { ShapeFlags } from './ShapeFlags'

export type AnyObject = Record<string, any>
export type VNodeProps = AnyObject
export type Render = () => AnyObject
export type Setup = (props?: VNodeProps, context?: Context) => any

export type Component = {
  render?: Render
  setup?: Setup
  name?: string
  template?:string
}
export type Context = {
  emit?: Emit
}

export type VNode<Node = AnyObject> = {
  type: VNodeType
  el: null | Node
  props: VNodeProps
  children: Children<Node>
  shapeFlag: ShapeFlags
  key?: any
  instance: ComponentInstance
}
export type Children<Node> = string | VNode | VNode<Node>[] | Slots
export type VNodeType = string | Component | symbol
export type SlotType = (...args: any[]) => VNode | VNode[]
export type Slots = Record<string, SlotType>

export function createVNode<Node = AnyObject>(
  type: VNodeType,
  props?: VNodeProps,
  children?: Children<Node>,
): VNode<Node> {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
    instance: null,
    key: props && props.key,
  }
  if (isString(children)) { vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN }
  else if (Array.isArray(children)) { vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN }

  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
    // named slot
      vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.SLOT_CHILDREN
    }
  }

  return vnode
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text)
}
function getShapeFlag(type: VNodeType) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}

export { createVNode as createElementVNode }
