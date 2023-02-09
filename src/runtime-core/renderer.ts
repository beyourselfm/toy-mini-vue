import { isString } from "../utils"
import { createComponentInstance, ComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "./ShapeFlags"
import { ChildrenWithArray, VNode, VNodeComponent, VNodeType } from "./vnode"

export type Container = HTMLElement
export function render(vnode: VNode, container: Container) {
  patch(vnode, container)
}

function patch(vnode: VNode, container: Container) {
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
  const subTree = instance.render.call(proxy)

  patch(subTree, container)
  vnode.el = subTree.el
}

function processElement(vnode: VNode, container: Container) {
  mountElement(vnode, container)
}

function mountElement(vnode: VNode, container: Container) {
  const el = (vnode.el = document.createElement(vnode.type as string))

  const { children, shapeFlag } = vnode

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children as string
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }
  const { props } = vnode
  const isStartWithOn = (key: string) => /^on[A-Za-z]/.test(key)
  for (const key in props) {
    if (isStartWithOn(key)) {
      const event = key.slice(2).toLocaleLowerCase()
      el.addEventListener(event, props[key])
    } else {
      el.setAttribute(key, props[key])
    }
  }
  container.append(el)
}
function mountChildren(vnode: VNode, container: Container) {
  (vnode.children as ChildrenWithArray).forEach(v => {
    patch(v, container)
  })
}

