import {
  h,
} from '../../libs/toy-vue.esm.js'
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
      [
        h(Test, {
          onAdd(...args) {
            console.log(...args)
          },
          onFooBar() {
            console.log('foobar')
          },
        }),
      ],
    )
  },
  setup() {
    return {
      foo: 1,
    }
  },
}
