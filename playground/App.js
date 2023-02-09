import { h } from "../libs/toy-vue.esm";
import { Test } from "./Test";
window.self = null
export const App = {
  render() {
    window.self = this
    return h("div", {
      id:"root",
      onClick(){
        console.log("click")
      },
      onmouseover(){
        console.log("mouseover")
      }
    },[h('div',{},"hi" + this.foo),h(Test,{
      count : 1
    })]);
  },
  setup(){
    return {
      foo:1
    }
  }
};
