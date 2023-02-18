export const isObject = (val: any): val is object =>
  val !== null && typeof val === 'object'
export const hasChanged = (val: any, newVal: any) => !Object.is(val, newVal)
export const isString = (val: any): val is string => typeof val === 'string'
export const hasOwn = (object: any, key: string | number | symbol) =>
  Object.prototype.hasOwnProperty.call(object, key)

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)
export const toHandlerKey = (str: string) => (str ? `on${capitalize(str)}` : '')

export const isStartWithOn = (key: string) => /^on[A-Za-z]/.test(key)
export const camelize = (str: string) =>
  str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : ''
  })
export const isEmptyObject = (obj: object) =>
  JSON.parse(JSON.stringify(obj)) === '{}'

export function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [ 0 ]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = ((u + v) / 2) | 0
        if (arr[result[c]] < arrI)
          u = c + 1
        else
          v = c
      }
      if (arrI < arr[result[u]]) {
        if (u > 0)
          p[i] = result[u - 1]

        result[u] = i
      }
    }
  }

  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }

  return result
}

export * from '../src/displayString'
