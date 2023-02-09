import { camelize, toHandlerKey } from "../utils"
import { ComponentInstance } from "./component"

export type Emit = (event: string) => void
export function emit(instance: ComponentInstance, event: string, ...args: any[]) {
  const { props } = instance

  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...args)

}