import { describe, expect, it, vi } from 'vitest'
import { isReactive, isReadonly, readonly, shallowReadonly } from '../reactive'

describe('shallowReadonly', () => {
  it('', () => {
    const original = {
      nested: {
        foo: 1,
      },
    }

    const observed = shallowReadonly(original)
    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.nested)).toBe(false)
  })

  it('warn when call set', () => {
    console.warn = vi.fn()
    const user = shallowReadonly({
      age: 10,
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
