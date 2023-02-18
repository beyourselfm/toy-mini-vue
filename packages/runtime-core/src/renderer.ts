import { getSequence, isEmptyObject } from '@toy-vue/utils'
import { effect } from '@toy-vue/reactivity'
import {
  ComponentInstance,
  createComponentInstance,
  setupComponent,
} from './component'
import { Nullable, createAppApi } from './createApp'
import { queueJobs } from './scheduler'
import { ShapeFlags } from './ShapeFlags'
import { AnyObject, Children, Component, VNode, VNodeProps } from './vnode'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export type RenderOptions<Node> = {
  createElement: (type: string) => Node
  patchProp: (n: Node, key: string, oldVal: any, newVal: any) => void
  insert: (n: Node, container: Node, anchor?: Node) => void
  setText: (n: Node, text: string) => void
  remove: (n: Node) => void
}
export function createRender<Node = AnyObject>(options: RenderOptions<Node>) {
  const { createElement, patchProp, insert, setText, remove } = options

  function render(
    vnode: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
  ) {
    // init
    patch(null, vnode, container, parentComponent)
  }

  function patch(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
    anchor?: Node,
  ) {
    const { type, shapeFlag } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container, parentComponent, anchor)
        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(n1, n2, container, parentComponent)

        break
    }
  }

  function processComponent(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
  ) {
    // stateful component
    if (!n1)
      mountComponent(n2, container, parentComponent)
    else patchComponent(n1, n2)
  }
  function patchComponent(n1: VNode<Node>, n2: VNode<Node>) {
    const instance = (n2.instance = n1.instance)
    if (shouldPatchComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    }
    else {
      n2.el = n1.el
      instance.vnode = n2
    }
  }

  function shouldPatchComponent(n1: VNode<Node>, n2: VNode<Node>) {
    const { props: prevProps } = n1
    const { props: nextProps } = n2
    for (const key in nextProps) {
      if (nextProps[key] !== prevProps[key])
        return true
    }

    return false
  }
  function mountComponent(
    vnode: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
  ) {
    const instance = (vnode.instance = createComponentInstance(
      vnode,
      parentComponent,
    ))
    setupComponent(instance)

    setupRenderEffect(instance, vnode, container)
  }

  function setupRenderEffect(
    instance: ComponentInstance<Node>,
    initialVNode: VNode<Node>,
    container: Node,
  ) {
    instance.update = effect(
      () => {
        if (!instance.isMounted) {
          const { proxy } = instance
          // proxy -> _ctx, "1" -> _cache
          const subTree = (instance.subTree = instance.render.call(proxy, proxy, '1'))
          // 子组件patch
          patch(null, subTree, container, instance)
          initialVNode.el = subTree.el
          instance.isMounted = true
        }
        else {
          // update

          const { proxy, next, vnode } = instance
          if (next) {
            next.el = vnode.el
            patchComponentPreRender(instance, next)
          }
          // proxy -> _ctx, "1" -> _cache
          const subTree = instance.render.call(proxy, proxy, '1')
          const prevSubTree = instance.subTree

          instance.subTree = subTree
          patch(prevSubTree, subTree, container, instance)
        }
      },
      {
        scheduler() {
          queueJobs(instance.update)
        },
      },
    )
  }
  function patchComponentPreRender(
    instance: ComponentInstance,
    next: VNode<Node>,
  ) {
    // 更新之前
    instance.vnode = next
    instance.props = next.props
    instance.next = null
  }

  function processElement(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
    anchor?: Node,
  ) {
    if (!n1)
      mountElement(n2, container, parentComponent, anchor)
    else patchElement(n1, n2, container, parentComponent, anchor)
  }

  function mountElement(
    vnode: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
    anchor?: Node,
  ) {
    const el = (vnode.el = createElement(vnode.type as string))

    const { children, shapeFlag, props } = vnode

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
      setText(el, children as string)
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(children as VNode<Node>[], el, parentComponent)

    for (const key in props) patchProp(el, key, null, props[key])

    insert(el, container, anchor)
  }
  function mountChildren(
    children: VNode<Node>[],
    container: Node,
    parentComponent: ComponentInstance,
    anchor?: Node,
  ) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  function processFragment(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
  ) {
    mountChildren(n2.children as VNode<Node>[], container, parentComponent)
  }

  function processText(n1: VNode, n2: VNode, container: Node) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children as string))
    insert(textNode as Node, container)
  }

  function patchChildren(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
    anchor?: Node,
  ) {
    const prevShapeFlag = n1.shapeFlag
    const nextShapeFlag = n2.shapeFlag
    const prevChildren = n1.children
    const nextChildren = n2.children
    const prevEl = n1.el
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text/array -> text
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN)
      // 清空旧的children
        unmountChildren(n1.children as VNode<Node>[])

      if (prevChildren !== nextChildren)
        setText(prevEl, nextChildren as string)
    }
    else if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // text/array -> array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        setText(prevEl, '')
        mountChildren(
          nextChildren as VNode<Node>[],
          prevEl,
          parentComponent,
          anchor,
        )
      }
      else {
        // array -> array
        patchKeyChildren(
          prevChildren as VNode<Node>[],
          nextChildren as VNode<Node>[],
          container,
          parentComponent,
        )
      }
    }
  }

  function patchKeyChildren(
    prevChildren: VNode<Node>[],
    nextChildren: VNode<Node>[],
    container: Node,
    parentComponent: ComponentInstance,
  ) {
    let i = 0
    const prevLength = prevChildren.length - 1
    const nextLength = nextChildren.length - 1
    let prevRightIndex = prevLength
    let nextRightIndex = nextLength

    function isSameVnodeType(n1: VNode<Node>, n2: VNode<Node>) {
      return n1.type === n2.type && n1.key === n2.key
    }

    // left
    while (i <= prevRightIndex && i <= nextRightIndex) {
      const n1 = prevChildren[i]
      const n2 = nextChildren[i]
      if (isSameVnodeType(n1, n2))
        patch(n1, n2, container, parentComponent)
      else break

      i++
    }

    // right
    while (i <= prevRightIndex && i <= nextRightIndex) {
      const n1 = prevChildren[prevRightIndex]
      const n2 = nextChildren[nextRightIndex]
      if (isSameVnodeType(n1, n2))
        patch(n1, n2, container, parentComponent)
      else break

      prevRightIndex--
      nextRightIndex--
    }

    // new vnode list > old vnode list
    if (i > prevRightIndex) {
      if (i <= nextRightIndex) {
        const nextPos = nextRightIndex + 1
        const anchor = nextPos < nextLength ? nextChildren[nextPos].el : null
        while (i <= nextRightIndex) {
          patch(null, nextChildren[i], container, parentComponent, anchor)
          i++
        }
      }
    }
    else if (i > nextRightIndex) {
      // old vnode list > new vnode list
      while (i <= prevRightIndex) {
        remove(prevChildren[i].el)
        i++
      }
    }
    else {
      // 中间
      const prevLeftIndex = i
      const nextLeftIndex = i
      let moved = false
      // [4,3,1]
      // 当遍历到 1 时就可以确定后面的都需要移动
      // move true
      let maxIndex = 0

      const nextIndexMap = new Map()

      const needPatch = nextRightIndex - nextLeftIndex + 1
      let patched = 0

      const nextIndexInPrevIndexMap = new Array(needPatch).fill(-1)

      for (let i = nextLeftIndex; i <= nextRightIndex; i++) {
        const nextChild = nextChildren[i]
        nextIndexMap.set(nextChild.key, i)
      }

      for (let i = prevLeftIndex; i <= prevRightIndex; i++) {
        const prevChild = prevChildren[i]
        if (patched >= needPatch) {
          remove(prevChild.el)
          continue
        }

        let nextIndex
        if (!prevChild.key) { nextIndex = nextIndexMap.get(prevChild.key) }

        else {
          for (let j = nextLeftIndex; j <= nextRightIndex; j++) {
            const nextChild = nextChildren[j]
            if (isSameVnodeType(prevChild, nextChild)) {
              nextIndex = j
              break
            }
          }
        }

        if (!nextIndex) {
          remove(prevChild.el)
        }
        else {
          // index -> new position
          // value -> prev position
          if (nextIndex > maxIndex)
            maxIndex = nextIndex
          else moved = true

          nextIndexInPrevIndexMap[nextIndex - nextLeftIndex] = i + 1
          patch(prevChild, nextChildren[nextIndex], container, parentComponent)
          patched++
        }
      }

      const sequence = moved ? getSequence(nextIndexInPrevIndexMap) : []

      // 倒叙
      let sequenceIndex = sequence.length - 1
      for (let i = needPatch - 1; i >= 0; i--) {
        const nextPos = i + nextLeftIndex
        const nextChild = nextChildren[nextPos]
        const anchor
          = nextPos + 1 < nextLength ? nextChildren[nextPos + 1].el : null

        // === -1 create new node
        if (nextIndexInPrevIndexMap[i] === -1) { patch(null, nextChild, container, parentComponent, anchor) }

        else if (moved) {
          if (sequenceIndex < 0 || i !== sequence[sequenceIndex]) {
          // 这时候的真实 Dom 还是 prevChild
            console.log('need move')
            insert(nextChild.el, container, anchor)
          }
          else {
            sequenceIndex--
          }
        }
      }
    }
  }

  function unmountChildren(children: VNode<Node>[]) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      remove(el)
    }
  }

  function patchElement(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance,
    anchor?: Node,
  ) {
    // updateElement
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    const el = (n2.el = n1.el)
    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newProps)
  }

  function patchProps(el: any, oldProps: VNodeProps, newProps: VNodeProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
      //
        const prevProp = oldProps[key]
        const newProp = newProps[key]
        if (prevProp !== newProp)
          patchProp(el, key, prevProp, newProp)
      }
    }

    if (!isEmptyObject(oldProps)) {
      // remove oldProp
      for (const key in oldProps) {
        if (!(key in newProps))
          patchProp(el, key, oldProps[key], null)
      }
    }
  }

  return { createApp: createAppApi(render) }
}
