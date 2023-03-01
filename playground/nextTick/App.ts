import { getCurrentInstance, h, nextTick, ref } from '../../libs/toy-vue.esm.js'
window.self = null
export const App = {
  setup() {
    const instance = getCurrentInstance()
    const count = ref(0)
    const onClick = () => {
      for (let i = 0; i < 100; i++) { count.value = i }

      console.log(instance)

      nextTick(() => {
        console.log('next tick')
        console.log(instance)
      })
    }

    return { count, onClick }
  },
  render() {
    return h('div', {}, [
      h(
        'button',
        {
          onClick: this.onClick,
        },
        'click',
      ),
      h('p', {}, `${this.count}`),
    ])
  },
}
