import { h, ref } from '../../libs/toy-vue.esm'
const nextChildren = 'newChildren'
const prevChildren = [ h('div', {}, 'A'), h('div', {}, 'B') ]
const test = [ 'a', 'b' ]

export const ArrayToText = {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange,
    }
  },
  render() {
    const self = this
    return h('div', {}, test)
    // return self.isChange === true
    //   ? h("div", {}, prevChildren)
    //   : h("div", {}, nextChildren);
  },
}
