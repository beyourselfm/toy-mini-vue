import { Children, createVNode, VNode } from "../vnode";

export function renderSlots(slots: Children, name: string) {

  if (slots) {
    return createVNode('div', {}, slots[name])
  }

}