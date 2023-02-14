import { Component, createRender, VNodeType } from '../runtime-core'
import { isStartWithOn } from '../utils'

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
function insert(el: HTMLElement, parent: HTMLElement, anchor?: HTMLElement) {
  parent.insertBefore(el,anchor || null)
}
function remove(el: HTMLElement) {
  const parent = el.parentNode
  if (parent) {
    parent.removeChild(el)
  }
}
function setText(el: HTMLElement, text: string) {
  el.textContent = text
}

export const renderer = createRender<HTMLElement>({
  createElement,
  patchProp,
  insert,
  setText,
  remove,
})
export function createApp(root: Component) {
  return renderer.createApp(root)
}
