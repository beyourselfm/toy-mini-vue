import { ref, h } from '../../libs/toy-vue.esm'
const nextChildren = 'newText'
const prevChildren = 'oldText'

export const TextToText = {
  name: 'TextToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange,
    }
  },
  render() {
    const self = this
    return self.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  },
}
