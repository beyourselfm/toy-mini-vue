import { ComponentInstance } from "./component"

const publicPropertiesMap = {
  $el: (instance: ComponentInstance) => instance.vnode.el,
  $data: (instance: ComponentInstance) => instance.setupState,

}

export const publicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupState } = instance
    if (key in setupState) {
      return setupState[key]
    }

    const getter = publicPropertiesMap[key]
    if (getter) {
      return getter(instance)
    }
  }
}