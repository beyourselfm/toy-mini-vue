import { describe, expect, it } from "vitest";
import { effect } from "../effect";
import { reactive } from "../reactive";

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
  it("return runner when call effect function", () => {
    let foo = 1
    const runner = effect(() => {
      foo++;
      return "result"
    })
    expect(foo).toBe(2)
    const result = runner()
    expect(foo).toBe(3)
    expect(result).toBe('result')

  })
})