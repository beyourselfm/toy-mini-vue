import { describe, expect, it, vi } from 'vitest'
import { isProxy, isReactive, isReadonly, readonly } from '../reactive'

describe('readonly', () => {
  it('', () => {
    const original = { foo: 1 }
    const readonlyObj = readonly(original)
    expect(readonlyObj).not.toBe(original)
    expect(isReactive(readonlyObj)).toBe(false)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(readonlyObj)).toBe(true)
    expect(readonlyObj.foo).toBe(original.foo)
    expect(isProxy(readonlyObj)).toBe(true)
  })
  it('warn when call set', () => {
    console.warn = vi.fn()
    const user = readonly({
      age: 10,
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [ { bar: 2 } ],
    }

    const observed = readonly(original)
    expect(isReadonly(observed.nested)).toBe(true)
    expect(isReadonly(observed.array)).toBe(true)
    expect(isReadonly(observed.array[0])).toBe(true)
  })
})
