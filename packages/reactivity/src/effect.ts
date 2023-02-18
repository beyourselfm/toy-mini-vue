export type Key = number | string | symbol
export type Object = Record<Key, any>
export type EffectFns = Set<ReactiveEffect>
export type Dep = Map<Key, EffectFns>
export type TargetMap = WeakMap<any, Dep>
export type ProxyType = typeof Proxy
export type FunctionWithEffect = Function & {
  effect?: ReactiveEffect
}

export type EffectOptions = {
  scheduler?: Function
  onStop?: () => void
}

const targetMap: TargetMap = new WeakMap()
let activeEffect: ReactiveEffect
let shouldTrack: boolean

export function track(target: Object, key: Key) {
  if (!isTracking())
    return
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
  trackEffects(dep)
}

export function trigger(target: Object, key: Key) {
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return
  const dep = depsMap?.get(key)
  if (!dep)
    return
  triggerEffects(dep)
}

export function triggerEffects(dep: EffectFns) {
  for (const effect of dep) {
    if (effect.scheduler)
      effect.scheduler()
    else
      effect.run()
  }
}
export class ReactiveEffect {
  private _fn: Function
  public scheduler?: Function
  public deps: EffectFns[]
  public onStop?: () => void
  private active = true

  constructor(fn: Function, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
    this.deps = []
  }

  run() {
    if (!this.active)
      return this._fn()

    // ++ => get and set
    shouldTrack = true
    //
    activeEffect = this
    const result = this._fn()

    shouldTrack = false
    return result
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.onStop && this.onStop()
      this.active = false
    }
  }
}
export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}
export function trackEffects(dep: EffectFns) {
  if (dep.has(activeEffect))
    return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}
export function stop(runner: FunctionWithEffect) {
  if (!runner.effect)
    return
  runner.effect?.stop()
}
export function effect(fn: Function, options: EffectOptions = {}) {
  const { scheduler } = options
  const _effect = new ReactiveEffect(fn, scheduler)
  Object.assign(_effect, options)

  // run called when init
  _effect.run()
  const runner = _effect.run.bind(_effect) as FunctionWithEffect
  runner.effect = _effect

  return runner
}
