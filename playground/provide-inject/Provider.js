import { Test } from './Test'
import { provide, h } from '../libs/toy-vue.esm'

export const Provider = {
  name: 'Provider',
  render() {
    debugger
    return h(Test)
  },
  setup() {
    provide('bar', 'bar')
    provide('f', 'foo')
  },
}
