import { createTextVNode, getCurrentInstance, h } from "../libs/toy-vue.esm";
import { Test } from "./Test";
window.self = null;
export const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        name: "APP",
        id: "root",
      },
      [
        h(
          Test,
          {
            count: 1,
            onAdd(a, b) {
              console.log("onAdd");
              console.log(a);
            },
            onFooBar() {
              console.log("foo bar");
            },
          },
          {
            header: ({ some }) => [
              createTextVNode("hehe"),
              h("div", {}, "header" + some),
            ],
            footer: () => h("div", {}, "footer"),
          }
        ),
      ]
    );
  },
  setup() {
    console.log(getCurrentInstance());
    return {
      foo: 1,
    };
  },
};
