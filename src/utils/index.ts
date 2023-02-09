export const isObject = (val: any): val is object => val !== null && typeof val === 'object'
export const hasChanged = (val: any, newVal: any) => !Object.is(val, newVal)
export const isString = (val: any): val is string => typeof val === 'string'