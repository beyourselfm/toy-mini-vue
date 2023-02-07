import { describe, expect, it, vi } from "vitest";
import { isReactive, isReadonly, readonly } from "../reactive";

describe('readonly', () => {
  it("", () => {
    const original = { foo: 1 }
    const readonlyObj = readonly(original)
    expect(readonlyObj).not.toBe(original)
    expect(isReactive(readonlyObj)).toBe(false)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(readonlyObj)).toBe(true)
    expect(readonlyObj.foo).toBe(original.foo)
  })
  it('warn when call set', () => {

    console.warn = vi.fn()
    const user = readonly({
      age: 10
    })
    //@ts-ignore
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})