import { isObject } from "../utils"
import { publicInstanceProxyHandler } from "./ComponentPublicInstance"
import { VNode, VNodeComponent, VNodeType } from "./vnode"

export type ComponentInstance = {
  vnode: VNode
  type: VNodeType
  setupState?: any
  proxy?: object
}
export function createComponentInstance(vnode: VNode) {
  const instance: ComponentInstance = {
    vnode,
    type: vnode.type,
    setupState: {}
  }

  instance.proxy = new Proxy({
    _: instance
  }, publicInstanceProxyHandler)

  return instance
}

export function setupComponent(instance: ComponentInstance) {
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: ComponentInstance) {
  const Component = instance.type as VNodeComponent
  const { setup } = Component

  if (setup) {
    // fn or object
    const setupResult = setup()

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

