import { mutableHandlers, readonlyHandlers } from "./baseHandlers"
export const enum ReactiveFlags {
  IS_REACTIVE = "__is_reactive__",
  IS_READONLY = "__is_readonly__",
}

export function reactive<T extends object>(raw: T) {
  return createReactiveObject(raw, mutableHandlers) as T
}

export function readonly<T extends object>(raw: T) {
  return createReactiveObject(raw, readonlyHandlers) as T
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