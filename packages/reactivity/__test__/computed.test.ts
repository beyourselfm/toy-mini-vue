import { describe, expect, it, vi } from 'vitest'
import { computed } from '../src/computed'
import { reactive } from '../src/reactive'

describe('computed', () => {
  it('', () => {
    const user = reactive({
      age: 1,
    })
    const age = computed(() => {
      return user.age
    })
    expect(age.value).toBe(1)
  })

  it('computed lazily', () => {
    const foo = reactive({
      foo: 1,
    })
    const getter = vi.fn(() => {
      return foo.foo
    })

    const computedValue = computed(getter)
    expect(getter).not.toHaveBeenCalled()

    expect(computedValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    foo.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    expect(computedValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    computedValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
