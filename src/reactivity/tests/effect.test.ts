import { describe, expect, it, vi } from 'vitest'
import { effect, stop } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
  it('', () => {
    const obj = reactive({
      a: 1,
    })
    let foo
    effect(() => {
      foo = obj.a + 1
    })
    expect(foo).toBe(2)
    obj.a++
    expect(foo).toBe(3)
  })
  it('return runner when call effect function', () => {
    let foo = 1
    const runner = effect(() => {
      foo++
      return 'result'
    })
    expect(foo).toBe(2)
    const result = runner()
    expect(foo).toBe(3)
    expect(result).toBe('result')
  })
  it('scheduler', () => {
    let run: any
    let result
    const foo = reactive({ foo: 1 })
    const scheduler = vi.fn(() => {
      run = runner
    })
    const runner = effect(
      () => {
        result = foo.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(result).toBe(1)
    foo.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(result).toBe(1)
    run && run()
    expect(result).toBe(2)
  })
  it('stop', () => {
    let result: any
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      result = obj.foo
    })

    obj.foo = 2
    expect(result).toBe(2)
    stop(runner)
    obj.foo++
    expect(result).toBe(2)

    runner()
    expect(result).toBe(3)
  })
  it('onStop', () => {
    const obj = reactive({
      foo: 1,
    })
    const onStop = vi.fn()
    let result
    const runner = effect(
      () => {
        result = obj.foo
      },
      {
        onStop,
      }
    )
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
