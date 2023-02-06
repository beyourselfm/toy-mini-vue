import { describe, expect, it } from "vitest";
import { reactive } from "../reacitve";

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
  })
})