import { createRender, VNodeType } from "../runtime-core";
import { isStartWithOn } from "../utils";

function createElement(type: string) {
  return document.createElement(type)
}

function patchProp(el: HTMLElement, key: string, value: any, nextVal: any) {
  if (isStartWithOn(key)) {
    const event = key.slice(2).toLocaleLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}
function insert(el: HTMLElement, parent: HTMLElement) {
  parent.append(el)


}
function setText(children: string) {
  document.createTextNode(children)
}

export const renderer = createRender({
  createElement,
  patchProp,
  insert,
  setText
})
export function createApp(root: VNodeType) {
  return renderer.createApp(root)
}