import { hasChanged, isObject } from "../utils"
import { EffectFns, isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

class RefImpl<T>{
  private _value: T
  private dep: EffectFns
  private _rawValue: T
  constructor(value: T) {
    this._rawValue = value;
    this._value = convertToReactive(value)
    this.dep = new Set()
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