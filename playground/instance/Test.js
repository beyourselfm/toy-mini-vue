import {
  createTextVNode,
  h,
  renderSlots,
  getCurrentInstance,
  inject,
} from "../../libs/toy-vue.esm";
export const Test = {
  name: "Test",
  setup(props, { emit }) {
    // shallowReadonly
    const add = () => {
      emit("add", 1, 2);
      emit("foo-bar");
      return;
    };
    console.log(getCurrentInstance());
  },
  render() {
    return h("div", {}, "asd");
  },
};
