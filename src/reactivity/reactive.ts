import { mutableHandlers, readonlyHandlers } from "./baseHandlers"
import { Key, track, trigger } from "./effect"

export function reactive(raw: any) {
  return new Proxy(raw, mutableHandlers)
}

export function readonly(raw: Object) {
  return new Proxy(raw, readonlyHandlers)
}