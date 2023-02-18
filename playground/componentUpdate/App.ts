import { h, ref } from '../../libs/toy-vue.esm.js'
import Child from './Child.js'
window.self = null
export const App = {
  setup() {
    const message = ref('msg')
    const count = ref(1)

    window.message = message
    const changeMessage = () => {
      message.value = 'new msg'
    }
    const changeCount = () => {
      count.value++
    }
    return { message, changeCount, changeMessage, count }
  },
  render(_ctx, _cache) {
    console.log(_ctx)
    console.log(_cache)
    window.self = this
    return h(
      'div',
      {
        name: 'app',
        id: 'root',
      },
      [
        h(
          'button',
          {
            onClick: this.changeMessage,
          },
          'change message',
        ),
        h(Child, {
          message: this.message,
        }),

        h(
          'button',
          {
            onClick: this.changeCount,
          },
          'change count',
        ),
        h('p', {}, `${this.count}`),
      ],
    )
  },
}
