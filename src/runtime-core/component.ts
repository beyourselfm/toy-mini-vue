import { isObject } from "../utils"
import { publicInstanceProxyHandler } from "./ComponentPublicInstance"
import { VNode, VNodeComponent, VNodeType } from "./vnode"

export type ComponentInstance = {
  vnode: VNode
  type: VNodeType
  setupState?: any
  proxy?: object
}
export function createComponentInstance(vnode: VNode): ComponentInstance {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {}
  }

  return component
}

export function setupComponent(instance: ComponentInstance) {
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: ComponentInstance) {
  const Component = instance.type as VNodeComponent
  instance.proxy = new Proxy({
    _: instance
  }, publicInstanceProxyHandler)
  const { setup } = Component

  if (setup) {
    // fn or object
    const setupResult = setup()

    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance: ComponentInstance, setupResult: any) {
  //
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

