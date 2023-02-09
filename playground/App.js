import { h } from "../libs/toy-vue.esm";
export const App = {
  render() {
    return h("div", {
      id:"root",
    },[h("p",{class:"red"},"dont know"),h("p",undefined,"hahah")]);
  },
  setup(){
    return {
      foo:1
    }
  }
};
