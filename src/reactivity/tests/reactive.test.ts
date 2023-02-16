import { describe, expect, it } from 'vitest'
import { isProxy, isReactive, reactive } from '../reactive'

describe('reactive', () => {
  it('', () => {
    const obj = { a: 1 }
    const proxy = reactive(obj)
    expect(proxy).toEqual(obj)
    proxy.a++
    expect(obj).toMatchInlineSnapshot(`
      {
        "a": 2,
      }
    `)
    expect(isReactive(proxy)).toBe(true)
    expect(isReactive(proxy)).toBe(true)
    expect(isReactive(obj)).toBe(false)
    expect(isProxy(proxy)).toBe(true)
  })
  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [ { bar: 2 } ],
    }

    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
