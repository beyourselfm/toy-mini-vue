export type Key = number | string | symbol
export type Object = Record<Key, any>
export type EffectFns = Set<ReactiveEffect>
export type Dep = Map<Key, EffectFns>
export type TargetMap = Map<Object, Dep>

const targetMap: TargetMap = new Map()
let activeEffect: ReactiveEffect

export function track(target: Object, key: Key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}

export function trigger(target: Object, key: Key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap?.get(key)
  if (!dep) return
  for (const effect of dep) {
    effect.run()
  }

}
class ReactiveEffect {
  private _fn: Function

  constructor(fn: Function) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()
  }
}
export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)
  // run called when init
  _effect.run()
  return _effect.run.bind(_effect)
}