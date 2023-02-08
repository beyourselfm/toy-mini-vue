import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers"
export const enum ReactiveFlags {
  IS_REACTIVE = "__is_reactive__",
  IS_READONLY = "__is_readonly__",
  IS_SHALLOW = "__is_shallow__",
}

export function reactive<T extends object>(raw: T): T {
  return createReactiveObject(raw, mutableHandlers) as T
}

export function readonly<T extends object>(raw: T): T {
  return createReactiveObject(raw, readonlyHandlers) as T
}
export function shallowReadonly<T extends object>(raw: T): T {
  return createReactiveObject(raw, shallowReadonlyHandlers) as T
}

function createReactiveObject<T extends object>(target: T, baseHandlers: ProxyHandler<T>): T {
  return new Proxy(target, baseHandlers)

}
export function isReactive<T extends { [ReactiveFlags.IS_REACTIVE]?: boolean } & object>(value: T) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly<T extends { [ReactiveFlags.IS_READONLY]?: boolean } & object>(value: T) {
  return !!value[ReactiveFlags.IS_READONLY]
}
export function isProxy<T extends object>(value: T) {
  return isReactive(value) || isReadonly(value)
}