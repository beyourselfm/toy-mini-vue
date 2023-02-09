import { h } from "../libs/toy-vue.esm";
window.self = null
export const App = {
  render() {
    window.self = this
    return h("div", {
      id:"root",
    },"hi" + this.foo);
  },
  setup(){
    return {
      foo:1
    }
  }
};
