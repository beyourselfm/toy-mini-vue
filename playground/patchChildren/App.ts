import { h } from '../../libs/toy-vue.esm'
import { ArrayToArray } from './ArrayToArray'
window.self = null
export const App = {
  render() {
    return h('div', { tId: 1, id: 'root' }, [
      h(ArrayToArray),
    ])
    // return h("div", { tId: 1 }, [h("p", {}, "Home"), h(TextToText)]);
    // return h("div", { tId: 1 }, [h("p", {}, "Home"), h(TextToText)]);
  },
  setup() {},
}
