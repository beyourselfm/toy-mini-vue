import {
  createTextVNode,
  getCurrentInstance,
  h,
  inject,
  renderSlots,
} from '../../libs/toy-vue.esm'
export const Test = {
  name: 'Test',
  setup(props, { emit }) {
    // shallowReadonly
    const add = () => {
      emit('add', 1, 2)
      emit('foo-bar')
    }
    console.log(getCurrentInstance())
  },
  render() {
    return h('div', {}, 'asd')
  },
}
