import { h } from "../libs/toy-vue.esm";
export const Test={
  setup(props){
    // shallowReadonly
    debugger
    props.count ++
  },
  render(){
    return h("div",{},"foo"+this.count)
  }
}