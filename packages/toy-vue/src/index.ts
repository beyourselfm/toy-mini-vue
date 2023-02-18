import { baseCompile } from '@toy-vue/compiler-core'
import * as runtimeDom from '@toy-vue/runtime-dom'
import { registerRuntimeCompiler } from '@toy-vue/runtime-dom'
export * from '@toy-vue/runtime-dom'

function compileToFunction(template:string) {
  const { code } = baseCompile(template)
  const render = new Function('Toy', code)(runtimeDom)

  // function render(runtimeDom) {
  //   const { displayString: _displayString, createElementVNode: _createElementVNode } = runtimeDom
  //   return function render(_ctx, _cache) {
  //     return _createElementVNode('div', null, `hi,${_displayString(_ctx.message)}`)
  //   }
  // }
  return render
}

registerRuntimeCompiler(compileToFunction)
