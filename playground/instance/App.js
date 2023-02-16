import {
  createTextVNode,
  getCurrentInstance,
  h,
  provide,
} from '../../libs/toy-vue.esm'
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
      [ h(Test, {}) ],
    )
  },
  setup() {
    console.log(getCurrentInstance())
    return {
      foo: 1,
    }
  },
}
