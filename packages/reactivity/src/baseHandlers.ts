import { isObject } from '@toy-vue/utils'
import { Key, track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

// created once
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target: Object, key: Key) {
    if (key === ReactiveFlags.IS_REACTIVE) { return !isReadonly }
    else if (key === ReactiveFlags.IS_READONLY) { return isReadonly }

    const res = Reflect.get(target, key)

    if (isShallow) { return res }

    if (isObject(res)) { return isReadonly ? readonly(res) : reactive(res) }

    if (!isReadonly) { track(target, key) }

    return res
  }
}
function createSetter() {
  return function set(target: Object, key: Key, value: any) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}
export const mutableHandlers = {
  get,
  set,
}
export const readonlyHandlers = {
  get: readonlyGet,
  set(target: Object, key: Key, value: any) {
    console.warn(`key: ${key.toString()} set fail,${target} readonly`)
    return true
  },
}

export const shallowReadonlyHandlers = Object.assign({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
