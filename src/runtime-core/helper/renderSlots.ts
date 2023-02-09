import { Fragment } from "../renderer";
import { Children, createVNode, VNode } from "../vnode";

export function renderSlots(slots: Children, name: string, props: any) {

  const slot = slots[name]
  if (slots) {
    if (typeof slot === 'function') {
      return createVNode(Fragment, {}, slot(props))
    }
  }

}