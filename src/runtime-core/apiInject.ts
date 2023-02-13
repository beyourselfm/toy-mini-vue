import { getCurrentInstance } from './component'

export function provide(key: string, val: any) {
  const currentInstance = getCurrentInstance()

  if (currentInstance) {
    let { provides } = currentInstance
    const parentProvides = currentInstance.parent?.provides

    if (provides === parentProvides) {
      // the provides will create a new provides if true,and let the prototype to parentProvides
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key] = val
  }
}

export function inject(key: string, defaultVal?: any) {
  const currentInstance = getCurrentInstance()
  if (currentInstance) {
    const { parent } = currentInstance

    const parentProvides = parent.provides
    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultVal) {
      return defaultVal
    }
  }
}
