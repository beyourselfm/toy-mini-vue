export type Context = {
  source: string
}
export type Root = {
  children: SimpleExpression
}
export type BaseExpression = {
  type: string
  content: Content
}

export type Content = string & {}
export type SimpleExpression = BaseExpression & {
  content: string
}
export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context))
}
function createParserContext(content: string): Context {
  return {
    source: content,
  }
}

function parseChildren(context: Context) {
  const nodes = []
  const node = parseInterpolation(context)
  nodes.push(node)
  return nodes
}
function parseInterpolation(context: Context) {
  // {{ message }}
  const closeIndex = context.source.indexOf('}}', 2)

  context.source = context.source.slice(2)

  return [
    {
      type: 'Interpolation',
      content: {
        type: 'simple_expression',
        content: 'message',
      },
    },
  ]
}

export function createRoot(children: any): Root {
  return {
    children,
  }
}
