const createElementVNode = 'createElementVNode'
const displayString = 'displayString'
export const DISPLAY_STRING = Symbol(displayString)

export const CREATE_ELEMENT = Symbol(createElementVNode)
export const helperMapName = {
  [DISPLAY_STRING]: displayString,
  [CREATE_ELEMENT]: createElementVNode,
}
