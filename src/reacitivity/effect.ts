export type Key = number | string | symbol
export type Object = Record<Key, any>
export type EffectFns = Set<ReactiveEffect>
export type Dep = Map<Key, EffectFns>
export type TargetMap = Map<Object, Dep>
export type EffectOptions = {
  scheduler?: Function
}

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
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }

}
class ReactiveEffect {
  private _fn: Function
  public scheduler?: Function

  constructor(fn: Function, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    activeEffect = this
    return this._fn()
  }
}
export function effect(fn: Function, options: EffectOptions = {}) {
  const { scheduler } = options
  const _effect = new ReactiveEffect(fn, scheduler)
  // run called when init
  _effect.run()
  return _effect.run.bind(_effect)
}