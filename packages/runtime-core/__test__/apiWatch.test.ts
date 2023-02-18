import { reactive } from '@toy-vue/reactivity'
import { describe, expect, test, vi } from 'vitest'
import { watchEffect } from '../src/apiWatch'
import { nextTick } from '../src/scheduler'

describe('api:watch', () => {
  test('effect', async () => {
    const state = reactive({ count: 0 })
    let result

    watchEffect(() => {
      result = state.count
    })

    state.count++
    expect(result).toBe(0)
    await nextTick()
    expect(result).toBe(1)
  })
  test('stoping the watch', async () => {
    const state = reactive({ count: 0 })
    let result

    const stop = watchEffect(() => {
      result = state.count
    })

    stop()
    state.count++
    expect(result).toBe(0)
    await nextTick()
    expect(result).toBe(0)
  })

  test('cleanup effect', async () => {
    const state = reactive({ count: 0 })
    const cleanup = vi.fn()
    let result

    const stop = watchEffect((onCleanup) => {
      // shouldn't called in initial
      onCleanup(cleanup)
      result = state.count
    })
    expect(result).toBe(0)

    state.count++
    expect(result).toBe(0)
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(result).toBe(1)
    state.count++
    expect(cleanup).toHaveBeenCalledTimes(1)
    stop()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })
})
