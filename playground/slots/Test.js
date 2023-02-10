import {
  createTextVNode,
  h,
  renderSlots,
  getCurrentInstance,
  inject,
} from "../../libs/toy-vue.esm";
export const Test = {
  name: "Test",
  setup(props, { emit }) {},
  render() {
    return h("div", {}, [
      renderSlots(this.$slots, "headers", "this is a slot props"),
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
