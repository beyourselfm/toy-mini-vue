import { ComponentInstance } from './component'
import { AnyObject, Component, VNode, createVNode } from './vnode'

export type Nullable<T> = T | null | undefined
export type RenderFunc<Node> = (
  vnode: VNode<Node>,
  container: Node,
  parentComponent: Nullable<ComponentInstance>
) => void

export function createAppApi<Node = AnyObject>(render: RenderFunc<Node>) {
  return function createApp(root: Component) {
    return {
      mount(rootContainer: Node) {
        const vnode = createVNode<Node>(root)
        render(vnode, rootContainer, null)
      },
    }
  }
}
