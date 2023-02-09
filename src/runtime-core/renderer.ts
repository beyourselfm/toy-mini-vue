import { isString } from "../utils"
import { createComponentInstance, ComponentInstance, setupComponent } from "./component"
import { ChildrenWithArray, VNode, VNodeComponent, VNodeType } from "./vnode"

export type Container = HTMLElement
export function render(vnode: VNode, container: Container) {
  patch(vnode, container)
}

function patch(vnode: VNode, container: Container) {
  if (isString(vnode.type)) {
    processElement(vnode, container)
  } else {
    processComponent(vnode, container)
  }
}

function processComponent(vnode: VNode, container: Container) {
  mountComponent(vnode, container)
}
function mountComponent(vnode: VNode, container: Container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)

  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance: ComponentInstance, vnode: VNode, container: Container) {
  const { proxy } = instance
  const subTree = (instance.type as VNodeComponent).render.call(proxy)
  patch(subTree, container)

  vnode.el = subTree.el


}

function processElement(vnode: VNode, container: Container) {
  mountElement(vnode, container)
}

function mountElement(vnode: VNode, container: Container) {
  const el = vnode.el = document.createElement(vnode.type as string)

  const { children } = vnode
  if (isString(children)) {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }
  const { props } = vnode
  for (const key in props) {
    el.setAttribute(key, props[key])
  }
  container.append(el)
}
function mountChildren(vnode: VNode, container: Container) {
  (vnode.children as ChildrenWithArray).forEach(v => {
    patch(v, container)
  })
}

