import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'

describe('parse', () => {
  it.skip('simple interpolation', () => {
    const ast = baseParse('{{ message }}')

    expect(ast.children).toMatchInlineSnapshot(`
      [
        [
          {
            "content": {
              "content": "message",
              "type": 1,
            },
            "type": 0,
          },
        ],
      ]
    `)
  })
  it.skip('element', () => {
    const ast = baseParse('<div></div>')
    expect(ast.children).toMatchInlineSnapshot(`
      [
        {
          "tag": "div",
          "type": 2,
        },
      ]
    `)
  })
  it.skip('simple text', () => {
    const ast = baseParse('text')
    expect(ast.children[0]).toMatchInlineSnapshot(`
        {
          "content": "text",
          "type": 3,
        }
      `)
  })

  it('', () => {
    const ast = baseParse('<div>text,{{message}}</div>')
    expect(ast.children[0]).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "content": "text,",
            "type": 3,
          },
          {
            "content": {
              "content": "message",
              "type": 1,
            },
            "type": 0,
          },
        ],
        "tag": "div",
        "type": 2,
      }
    `)
  })

  it('', () => {
    const ast = baseParse('<div><p>p tag</p>{{message}}</div>')
    expect(ast.children[0]).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              {
                "content": "p tag",
                "type": 3,
              },
            ],
            "tag": "p",
            "type": 2,
          },
          {
            "content": {
              "content": "message",
              "type": 1,
            },
            "type": 0,
          },
        ],
        "tag": "div",
        "type": 2,
      }
    `)
  })
  it('should trow error when not close the tag', () => {
    expect(() => {
      baseParse('<div><span></div>')
    }).toThrowError('Missing close tag :span')
  })
})
