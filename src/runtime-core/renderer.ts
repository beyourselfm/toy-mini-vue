import { effect } from "../reactivity"
import { createComponentInstance, ComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "./ShapeFlags"
import { ChildrenWithArray, VNode, VNodeComponent, VNodeType } from "./vnode"
export const Fragment = Symbol("Fragment")
export const Text = Symbol("Text")

export type Container = HTMLElement
export function render(vnode: VNode, container: Container) {
  patch(null, vnode, container, null)
}

function patch(n1: VNode, n2: VNode, container: Container, parentComponent: ComponentInstance) {
  const { type, shapeFlag } = n2
  switch (type) {
    case Fragment:
      processFragment(n1, n2, container, parentComponent)
      break
    case Text:
      processText(n1, n2, container)
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(n1, n2, container, parentComponent)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(n1, n2, container, parentComponent)
      }
      break

  }
}

function processComponent(n1: VNode, n2: VNode, container: Container, parentComponent: ComponentInstance) {
  mountComponent(n2, container, parentComponent)
}
function mountComponent(vnode: VNode, container: Container, parentComponent: ComponentInstance) {
  const instance = createComponentInstance(vnode, parentComponent)
  setupComponent(instance)

  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance: ComponentInstance, initialVNode: VNode, container: Container) {
  effect(() => {
    if (!instance.isMounted) {
      const { proxy } = instance
      const subTree = (instance.subTree = instance.render.call(proxy))
      // 子组件patch
      patch(null, subTree, container, instance)
      initialVNode.el = subTree.el
      instance.isMounted = true
    } else {
      // update
      const { proxy } = instance
      const subTree = instance.render.call(proxy)
      const prevSubTree = instance.subTree
      instance.subTree = subTree
    }
  })

}

function processElement(n1: VNode, n2: VNode, container: Container, parentComponent: ComponentInstance) {
  if (!n1) {
    mountElement(n2, container, parentComponent)

  } else {
    patchElement(n1, n2, container)
  }

}

function mountElement(vnode: VNode, container: Container, parentComponent: ComponentInstance) {
  const el = (vnode.el = document.createElement(vnode.type as string))

  const { children, shapeFlag } = vnode

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children as string
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
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
function mountChildren(vnode: VNode, container: Container, parentComponent: ComponentInstance) {
  (vnode.children as ChildrenWithArray).forEach(v => {
    patch(null, v, container, parentComponent)
  })
}

function processFragment(n1: VNode, n2: VNode, container: HTMLElement, parentComponent: ComponentInstance) {
  mountChildren(n2, container, parentComponent)
}

function processText(n1: VNode, n2: VNode, container: Container) {
  const { children } = n2
  const textNode = (n2.el = document.createTextNode(children as string))
  container.append(textNode)
}

function patchElement(n1: VNode, n2: VNode, container: HTMLElement) {
  // updateElement
  console.log(n1)
  console.log(n2)

}

