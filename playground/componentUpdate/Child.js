import { h } from '../../libs/toy-vue.esm'

export default {
  setup(props) {},
  render(proxy) {
    return h('div', {}, [h('div', {}, this.$props.message)])
  },
}
