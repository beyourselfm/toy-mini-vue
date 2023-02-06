import { describe, expect, it } from "vitest";
import { effect } from "../effect";
import { reactive } from "../reacitve";

describe("effect", () => {
  it("", () => {
    const obj = reactive({
      a: 1
    })
    let foo
    effect(() => {
      foo = obj.a + 1
    })
    expect(foo).toBe(2)
    obj.a++
    expect(foo).toBe(3)
  })
})