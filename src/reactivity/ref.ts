import { hasChanged, isObject } from "../utils"
import { EffectFns, isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

type Ref<T = any> = {
  value: T
}
class RefImpl<T>{
  private _value: T
  private dep: EffectFns
  private _rawValue: T
  public __is_ref: boolean
  constructor(value: T) {
    this._rawValue = value;
    this._value = convertToReactive(value)
    this.dep = new Set()
    this.__is_ref = true
  }

  get value() {
    if (isTracking()) {
      trackEffects(this.dep)
    }
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
export function isRef<T>(value: any): value is Ref {
  return !!(value && value.__is_ref)
}
export function unRef<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}