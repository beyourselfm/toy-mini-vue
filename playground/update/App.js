import { h, provide, ref } from "../../libs/toy-vue.esm";
import { Test } from "./Test";
window.self = null;
export const App = {
  render() {
    console.log(this.foo);
    return h("div", {}, [
      h("div", {}, "count : " + this.foo),
      h(
        "button",
        {
          onClick: this.onClick,
        },
        "click"
      ),
    ]);
  },
  setup() {
    const foo = ref(0);
    function onClick() {
      foo.value++;
    }

    return {
      foo,
      onClick,
    };
  },
};
