import { h, ref } from '../../libs/toy-vue.esm'
const nextChildren = 'newChildren'
const prevChildren = [ h('div', { key: 'A' }, 'A'), h('div', { key: 'B' }, 'B') ]

export const ArrayToText = {
  name: 'ArrayToText',
  setup() {
  },
  render() {
    return this.$props.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', { key: 'prev' }, prevChildren)
  },
}
