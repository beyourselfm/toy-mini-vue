import { Key, track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()

function createGetter(isReadonly: boolean = false) {
  return function get(target: Object, key: Key) {
    const res = Reflect.get(target, key)

    if (!isReadonly) {
      track(target, key)
    }
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
  get,
  set() {
    return true
  }
}