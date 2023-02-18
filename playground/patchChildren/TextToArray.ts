import { h, ref } from '../../libs/toy-vue.esm'
const nextChildren = 'newChildren'
const prevChildren = [ h('div', {}, 'A'), h('div', {}, 'B') ]
const test = [ 'a', 'b' ]

export const TextToArray = {
  name: 'TextToArray',
  setup() {
  },
  render() {
    return this.$props.isChange === true
      ? h('div', {}, prevChildren)
      : h('div', {}, nextChildren)
  },
}
