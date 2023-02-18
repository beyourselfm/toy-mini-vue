import { h, ref } from '../../libs/toy-vue.esm'
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
    return this.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  },
}
