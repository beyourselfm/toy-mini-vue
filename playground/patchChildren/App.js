import { h, provide, ref } from "../../libs/toy-vue.esm";
import { ArrayToText } from "./ArrayToText";
import { TextToText } from "./textToText";
window.self = null;
export const App = {
  render() {
    return h("div", { tId: 1,id:"root" }, [h("p", {}, "Home"), h(ArrayToText)]);
    // return h("div", { tId: 1 }, [h("p", {}, "Home"), h(TextToText)]);
    // return h("div", { tId: 1 }, [h("p", {}, "Home"), h(TextToText)]);
  },
  setup() {},
};
