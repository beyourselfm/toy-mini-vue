import { h, ref } from '../../libs/toy-vue.esm'
const nextChildren = 'newText'
const prevChildren = 'oldText'

export const TextToText = {
  name: 'TextToText',
  setup() {
  },
  render() {
    return this.$props.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  },
}
