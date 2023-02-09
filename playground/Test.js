import { h, renderSlots } from "../libs/toy-vue.esm";
export const Test = {
  name: "Test",
  setup(props, { emit }) {
    // shallowReadonly
    const add = () => {
      emit("add", 1, 2);
      emit("foo-bar");
      return;
    };
    props.count++;
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
    return h("div", {}, [
      renderSlots(this.$slots, "header"),
      btn,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};
