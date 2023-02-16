const typescript = require('@rollup/plugin-typescript')
const pkg = require('./package.json')
export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
    },
    {
      format: 'es',
      file: pkg.module,
    },
  ],
  plugins: [ typescript() ],
}
