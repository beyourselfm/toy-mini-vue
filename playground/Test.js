import { h } from "../libs/toy-vue.esm";
export const Test={
  setup(props){
    props
    debugger
  },
  render(){
    return h("div",{},"foo"+this.count)
  }
}