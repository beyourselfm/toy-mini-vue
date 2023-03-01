import { hasOwn } from '@toy-vue/utils'
import { ComponentInstance } from './component'

const publicPropertiesMap = {
  $el: (instance: ComponentInstance) => instance.vnode.el,
  $state: (instance: ComponentInstance) => instance.setupState,
  $slots: (instance: ComponentInstance) => instance.slots,
  $props: (instance: ComponentInstance) => instance.props,
}

export const publicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupState, props } = instance
    if (hasOwn(setupState, key)) { return setupState[key] }
    else if (hasOwn(props, key)) { return props[key] }

    const getter = publicPropertiesMap[key]
    if (getter) { return getter(instance) }
  },
}
