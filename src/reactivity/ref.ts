import { hasChanged, isObject } from '../utils'
import { EffectFns, isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

type Ref<T = any> = {
  value: T
}
class RefImpl<T = any> {
  private _value: T
  private dep: EffectFns
  private _rawValue: T
  public __is_ref: boolean
  constructor(value: T) {
    this._rawValue = value
    this._value = convertToReactive(value)
    this.dep = new Set()
    this.__is_ref = true
  }

  get value() {
    if (isTracking())
      trackEffects(this.dep)

    return this._value
  }

  set value(newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = convertToReactive(newValue)
      triggerEffects(this.dep)
    }
  }
}
export function convertToReactive<T>(value: T) {
  return isObject(value) ? reactive(value) : value
}

export function ref<T>(value: T) {
  return new RefImpl(value)
}
export function isRef<T>(r: Ref<T> | unknown): r is RefImpl<T>
export function isRef(value: any): value is RefImpl {
  return !!(value && value.__is_ref)
}
export function unRef<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}
export function proxyRefs(ref: any): any {
  return new Proxy(ref, {
    get(target, key, receiver) {
      return unRef(Reflect.get(target, key, receiver))
    },
    set(target, key, newValue, receiver) {
      if (isRef(target[key]) && !isRef(newValue)) {
        target[key].value = newValue
        return true
      }
      else {
        return Reflect.set(target, key, newValue, receiver)
      }
    },
  })
}
