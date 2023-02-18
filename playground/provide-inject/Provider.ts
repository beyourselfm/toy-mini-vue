import { h, provide } from '../../libs/toy-vue.esm'
import { Test } from './Test'

export const Provider = {
  name: 'Provider',
  render() {
    return h(Test)
  },
  setup() {
    provide('bar', 'bar')
    provide('f', 'foo')
  },
}
