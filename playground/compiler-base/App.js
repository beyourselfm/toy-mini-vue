import { ref } from '../../libs/toy-vue.esm'

export const App = {
  template: '<div>hi,{{a}}</div>',
  setup() {
    const a = ref(1)
    window.a = a
    return {
      a,
    }
  },
}
