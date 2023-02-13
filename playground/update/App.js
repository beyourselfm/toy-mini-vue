import { h, provide, ref } from "../../libs/toy-vue.esm";
window.self = null;
export const App = {
  render() {
    console.log(this.foo);
    return h("div", { foo: this.val.foo, bar: this.val.bar }, [
      h("div", {}, "count : " + this.foo),
      h(
        "button",
        {
          onClick: this.onClick,
        },
        "click"
      ),
      h(
        "button",
        {
          onClick: this.handleChangeVal,
        },
        this.val.foo ? "is" : "not"
      ),
      h(
        "button",
        {
          onClick: this.handleChangeVal2,
        },
        this.val.foo ? "is" : "not"
      ),
      h(
        "button",
        {
          onClick: this.handleChangeVal3,
        },
        this.val.bar
      ),
    ]);
  },
  setup() {
    const foo = ref(0);
    const val = ref({
      foo: "foo",
      bar: "bar",
    });
    function onClick() {
      foo.value++;
    }
    function handleChangeVal() {
      val.value.foo = "new-foo";
    }
    function handleChangeVal2() {
      val.value.foo = null;
    }

    function handleChangeVal3() {
      val.value = {
        foo: "foo",
      };
    }

    return {
      foo,
      val,
      onClick,
      handleChangeVal,
      handleChangeVal2,
      handleChangeVal3,
    };
  },
};
