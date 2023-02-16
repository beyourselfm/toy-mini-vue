import { Nullable } from 'vitest'
import { NodeTypes } from './ast'

export type Context = {
  source: string
}
export type Root = {
  children: Expression[]
}
export type BaseExpression = {
  type: NodeTypes
}
export type ELementExpression = {
  tag: string
  children: Nullable<Expression[]>
} & BaseExpression

export type Content = string & {}
export type SimpleExpression = BaseExpression & {
  content: string
}

export type Expression = ELementExpression | SimpleExpression

const openBlock = '{{'
const closeBlock = '}}'
enum TagType {
  START,
  END,
}
export function baseParse(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context, []))
}
function createParserContext(content: string): Context {
  return {
    source: content,
  }
}

function parseChildren(
  context: Context,
  ancestors: ELementExpression[]
): Expression[] {
  const nodes = []
  let node
  while (!isEnd(context, ancestors)) {
    if (context.source.startsWith(openBlock)) {
      node = parseInterpolation(context)
    } else if (context.source[0] === '<') {
      if (/[a-z]/i.test(context.source[1])) {
        node = parseElement(context, ancestors)
      }
    }

    if (!node) {
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

function isEnd(context: Context, ancestors: ELementExpression[]) {
  const { source } = context
  if (source.startsWith('</')) {
    for (let i = 0; i < ancestors.length; i++) {
      const { tag } = ancestors[i]
      if (source.slice(2, 2 + tag.length) === tag) {
        return true
      }
    }
  }
  return !source
}

function parseInterpolation(context: Context) {
  // {{ message }}
  const closeIndex = context.source.indexOf(closeBlock, closeBlock.length) // avoid {{
  advanceBy(context, openBlock.length)
  const rawContentLength = closeIndex - 2
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()
  advanceBy(context, closeBlock.length)

  return [
    {
      type: NodeTypes.INTERPOLATION,
      content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content,
      },
    },
  ]
}

function advanceBy(context: Context, length: number) {
  context.source = context.source.slice(length)
}
export function createRoot(children: Expression[]): Root {
  return {
    children,
  }
}
function parseElement(context: Context, ancestors: ELementExpression[]) {
  const element = parseTag(context, TagType.START)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  parseTag(context, TagType.END)

  return element
}
function parseTag(context: Context, tagType: TagType): ELementExpression {
  const match = /^<\/?([a-z]*)/i.exec(context.source)!
  const tag = match[1]
  advanceBy(context, match[0].length)
  advanceBy(context, 1)
  if (tagType === TagType.END) return
  return {
    tag,
    children: null,
    type: NodeTypes.ELEMENT,
  }
}

function parseText(context: Context) {
  // 是否遇到 {{
  let endIndex = context.source.length
  const endToken = [openBlock, '<']
  endToken.forEach((token) => {
    const closeIndex = context.source.indexOf(token)
    if (closeIndex !== -1 && endIndex > closeIndex) {
      // closeIndex 取小的
      endIndex = closeIndex
    }
  })

  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content,
  }
}

function parseTextData(context: Context, length: number) {
  const content = context.source.slice(0, length)
  advanceBy(context, length)
  return content
}
