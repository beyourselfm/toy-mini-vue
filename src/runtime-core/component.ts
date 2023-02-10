import { computed, shallowReadonly } from "../reactivity"
import { isObject } from "../utils"
import { Emit, emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { publicInstanceProxyHandler } from "./ComponentPublicInstance"
import { initSlots } from "./componentSlots"
import { Children, VNode, VNodeComponent, VNodeProps, VNodeType } from "./vnode"


export type ComponentInstance = {
  vnode: VNode
  type: VNodeType
  parent: ComponentInstance,
  setupState?: object
  provides?: object
  proxy?: object
  props?: VNodeProps
  emit?: Emit
  slots?: any
} & VNodeComponent
export function createComponentInstance(vnode: VNode, parent: ComponentInstance) {
  const instance: ComponentInstance = {
    vnode,
    parent,
    type: vnode.type,
    props: {},
    setupState: {},
    emit: () => { },
    slots: {},
    provides: parent ? parent.provides : {}
  }
  instance.emit = emit.bind(null, instance)

  instance.proxy = new Proxy({
    _: instance
  }, publicInstanceProxyHandler)

  return instance
}

export function setupComponent(instance: ComponentInstance) {
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: ComponentInstance) {
  const Component = instance.type as VNodeComponent
  const { setup } = Component

  if (setup) {
    // fn or object
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })

    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: ComponentInstance, setupResult: any) {
  // setup return object or function
  if (isObject(setupResult)) {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: ComponentInstance) {
  const Component = instance.type as VNodeComponent

  if (Component.render) {
    instance.render = Component.render
  }
}

let currentInstance: ComponentInstance = null

export function getCurrentInstance() {
  return currentInstance
}
export function setCurrentInstance(instance: ComponentInstance) {
  currentInstance = instance
}