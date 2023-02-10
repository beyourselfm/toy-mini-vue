import { createRender, VNodeType } from "../runtime-core";
import { isStartWithOn } from "../utils";

function createElement(type: string) {
  return document.createElement(type)
}

function patchProp(el: HTMLElement, key: string, value: any) {
  if (isStartWithOn(key)) {
    const event = key.slice(2).toLocaleLowerCase()
    el.addEventListener(event, value)
  } else {
    el.setAttribute(key, value)
  }
}
function insert(el: HTMLElement, parent: HTMLElement) {
  parent.append(el)

}

export const renderer = createRender({
  createElement,
  patchProp,
  insert,
})
export function createApp(root: VNodeType) {
  return renderer.createApp(root)
}