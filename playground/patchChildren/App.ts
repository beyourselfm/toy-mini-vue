import { h, ref } from '../../libs/toy-vue.esm'
import { ArrayToArray } from './ArrayToArray'
import { ArrayToText } from './ArrayToText'
import { TextToText } from './TextToText'
export const App = {
  render() {
    return h('div', { tId: 1, id: 'root' }, [
      h('div', {}, [
        h(ArrayToArray, { isChange: this.isChange }), h(TextToText, {
          isChange: this.isChange,
        }), h(ArrayToText, { isChange: this.isChange }),
      ]),
      h('button', { onClick: this.change }, 'change '),
    ])
  },
  setup() {
    const isChange = ref(false)
    const change = () => {
      isChange.value = !isChange.value
    }
    return { change, isChange }
  },
}
