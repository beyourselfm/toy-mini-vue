import { ComponentInstance } from "./component";
import { ShapeFlags } from "./ShapeFlags";

export function initSlots(instance: ComponentInstance, children: any) {
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots(children: any, slots: object) {
  for (const key in children) {
    const value = children[key]
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
}
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}
