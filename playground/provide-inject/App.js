import {
  createTextVNode,
  getCurrentInstance,
  h,
  provide,
} from '../libs/toy-vue.esm'
import { Provider } from './provider'
import { Test } from './Test'
window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        name: 'app',
        id: 'root',
      },
      [ h(Provider, {}) ],
    )
  },
  setup() {
    provide('f', 'asd')
    return {
      foo: 1,
    }
  },
}
