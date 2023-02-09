import { shallowReadonly } from "../reactivity"
import { isObject } from "../utils"
import { initProps } from "./componentProps"
import { publicInstanceProxyHandler } from "./ComponentPublicInstance"
import { VNode, VNodeComponent, VNodeProps, VNodeType } from "./vnode"

export type ComponentInstance = {
  vnode: VNode
  type: VNodeType
  setupState?: object
  proxy?: object
  props?: VNodeProps
}
export function createComponentInstance(vnode: VNode) {
  const instance: ComponentInstance = {
    vnode,
    type: vnode.type,
    setupState: {},
  }

  instance.proxy = new Proxy({
    _: instance
  }, publicInstanceProxyHandler)

  return instance
}

export function setupComponent(instance: ComponentInstance) {
  initProps(instance, instance.vnode.props)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: ComponentInstance) {
  const Component = instance.type as VNodeComponent
  const { setup } = Component

  if (setup) {
    // fn or object
    debugger
    const setupResult = setup(shallowReadonly(instance.props))
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

function finishComponentSetup(instance: any) {
  const Component = instance.type

  if (Component.render) {
    instance.render = Component.render
  }
}

