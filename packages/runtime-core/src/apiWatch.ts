import { ReactiveEffect } from '@toy-vue/reactivity'
import { queuePreFlushJob } from './scheduler'

export function watchEffect(sourceFn:Function) {
  // cleanup
  let cleanup

  const effect = new ReactiveEffect(getter, () => {
    queuePreFlushJob(job)
  })

  function job() {
    effect.run()
  }
  // cleanup called when not initial effect run or stop the effect
  function onCleanup(fn:Function) {
    cleanup = fn
    effect.onStop = () => {
      fn && fn()
    }
  }
  function getter() {
    if (cleanup) { cleanup() }

    sourceFn(onCleanup)
  }

  effect.run()

  return () => {
    effect.stop()
  }
}
