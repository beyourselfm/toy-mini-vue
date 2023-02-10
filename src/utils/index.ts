export const isObject = (val: any): val is object => val !== null && typeof val === 'object'
export const hasChanged = (val: any, newVal: any) => !Object.is(val, newVal)
export const isString = (val: any): val is string => typeof val === 'string'
export const hasOwn = (object: any, key: string | number | symbol) => Object.prototype.hasOwnProperty.call(object, key)

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
export const toHandlerKey = (str: string) => str ? 'on' + capitalize(str) : ""

export const isStartWithOn = (key: string) => /^on[A-Za-z]/.test(key)
export const camelize = (str: string) => str.replace(/-(\w)/g, (_, c) => {
  return c ? c.toUpperCase() : ""
})
