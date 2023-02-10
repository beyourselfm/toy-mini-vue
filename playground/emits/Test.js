import {
  createTextVNode,
  h,
  renderSlots,
  getCurrentInstance,
  inject,
} from "../../libs/toy-vue.esm.js";
export const Test = {
  name: "Test",
  setup(props, { emit }) {
    const add = () => {
      emit("add", 1, 2);
      emit("foo-bar");
      return;
    };
    return { add };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.add,
      },
      "emit"
    );
    return h("div", {}, [btn]);
  },
};
