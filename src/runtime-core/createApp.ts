import { render } from "./renderer"
import { createVNode, VNode, VNodeType } from "./vnode"

export function createApp(root: VNodeType) {
  return {
    mount(rootContainer: HTMLElement) {
      const vnode = createVNode(root)
      render(vnode, rootContainer)
    },
  }

}