export type Key = number | string | symbol
export type Object = Record<Key, any>
export type EffectFns = Set<ReactiveEffect>
export type Dep = Map<Key, EffectFns>
export type TargetMap = Map<Object, Dep>
export type ProxyType = typeof Proxy
export type FunctionWithEffect = Function & {
  effect?: ReactiveEffect
}

export type EffectOptions = {
  scheduler?: Function
  onStop?: () => void
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
  if (!activeEffect) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
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
  public deps: EffectFns[]
  public onStop?: () => void
  private active: boolean = true

  constructor(fn: Function, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
    this.deps = []
  }
  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      this.onStop && this.onStop()
      this.active = false
    }
  }
}
function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })

}
export function stop(runner: FunctionWithEffect) {
  if (!runner.effect) return
  runner.effect?.stop()

}
export function effect(fn: Function, options: EffectOptions = {}) {
  const { scheduler, onStop } = options
  const _effect = new ReactiveEffect(fn, scheduler)
  Object.assign(_effect, options)

  // run called when init
  _effect.run()
  const runner = _effect.run.bind(_effect) as FunctionWithEffect
  runner.effect = _effect

  return runner
}