import typescript from "@rollup/plugin-typescript"
export default{
  input:"./src/index.ts",
  output:[{
    format:"cjs",
    file:"libs/toy-vue.cjs.js"
  },
  {
    format:"es",
    file:"libs/toy-vue.esm.js"
  }
],
plugins:[typescript()]
}