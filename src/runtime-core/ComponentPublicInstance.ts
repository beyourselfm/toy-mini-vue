import { hasOwn } from "../utils"
import { ComponentInstance } from "./component"

const publicPropertiesMap = {
  $el: (instance: ComponentInstance) => instance.vnode.el,
  $data: (instance: ComponentInstance) => instance.setupState,

}

export const publicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupState, props } = instance
    debugger
    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }

    const getter = publicPropertiesMap[key]
    if (getter) {
      return getter(instance)
    }
  }
}

