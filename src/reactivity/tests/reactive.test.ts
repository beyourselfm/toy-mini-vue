import { describe, expect, it } from "vitest";
import { isReactive, reactive } from "../reactive";

describe("reactive", () => {
  it("", () => {
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
  })
})