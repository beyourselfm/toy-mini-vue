import { createVNode, VNode, VNodeType } from "./vnode"
export function createAppApi(render) {

  return function createApp(root: VNodeType) {
    return {
      mount(rootContainer: HTMLElement) {
        const vnode = createVNode(root)
        render(vnode, rootContainer)
      },
    }
  }

}