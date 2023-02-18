import {
  createTextVNode,
  h,
  inject,
} from '../../libs/toy-vue.esm'
export const Test = {
  name: 'Test',
  setup(props, { emit }) {
    // shallowReadonly
    const add = () => {
      emit('add', 1, 2)
      emit('foo-bar')
    }
    const bar = inject('bar')
    const f = inject('f')
    const defaultVal = inject('foo', 'defaultVal')
    return { bar, f, defaultVal }
  },
  render() {
    return h('div', {}, [
      createTextVNode(this.bar),
      createTextVNode(this.f),
      createTextVNode(this.defaultVal),
    ])
  },
}
