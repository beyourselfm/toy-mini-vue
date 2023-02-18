import promises from 'fs/promises'
import * as p from '@clack/prompts'
import color from 'picocolors'
import 'zx/globals'
import { findUp } from 'find-up'

export async function run() {
  console.clear()
  const playgroundDir = await findUp('playground', { type: 'directory' })
  const libsDir = await findUp('libs', { type: 'directory' })
  if (!playgroundDir)
    throw new Error('can\'t find "playground" directory')

  const examples = await promises.readdir(playgroundDir)
  p.intro(`${color.cyan('welcome to toy-vue!')}`)
  const project = await p.group({
    example: ({ results }) =>
      p.select({
        message: color.cyan('choose an exmaple to Start!'),
        initialValue: examples[0],
        options: examples.map((example) => {
          return {
            value: example,
            label: color.green(example),
          }
        }),
      }),
    install: () =>
      p.confirm({
        message: color.blue('Install dependencies?'),
        initialValue: false,
      }),

    build: () =>
      p.confirm({
        message: color.yellow(`build ? ${libsDir ? color.gray('(you have already builded the library)') : color.red('(you haven\'t builded the library)')}`),
        initialValue: !libsDir,
      }),
  }, {
    onCancel: () => {
      p.cancel(color.red('Operation cancelled. '))
      process.exit(0)
    },
  })

  if (project.install) {
    const s = p.spinner()
    s.start('installing')
    await $`pnpm install`
    s.stop('Installed')
  }

  if (project.build) {
    const s = p.spinner()
    s.start('building')
    await $`pnpm run build`
    s.stop('builded')
  }

  if (!libsDir && !project.build)
    throw new Error('can\'t find the \'libs\', you must build the library (run "pnpm run build")')

  p.outro(color.green('the playground is started!'))

  await $`vite playground/${project.example}`
}
run().catch(error => p.outro(color.red(error)))
