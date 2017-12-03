import React from 'react'
import deepmerge from 'deepmerge'
import warning from 'warning'

//import { Text, View } from 'react-native'
//const converter_ = (getMarkup: () => JSX.Element | JSX.Element[]) => <Text>HALLO CONVERTER</Text>
//export default converter_

//const H2: React.SFC = (() => '\n') as any as React.SFC
//const P: React.SFC = props => {
//  const { children, ...rest } = props
//  return [
//    <Text key={1} { ...rest }>{children}{'\n'}</Text>,
//    <Text key={2} style={{ lineHeight: 5 }}>{'\n'}</Text>
//  ] as any
//}

const app = () => {
  //parser(() => [<div style={{ marginBottom: 10 }} onClick={() => alert('HALLO')}>
  //  <h2>header</h2>
  //  <p color='red'>
  //    text text text
  //    <b>asdasdf</b>
  //  </p>
  //</div>, <i>ITALIC</i>])
  return null
}

//https://github.com/oyyd/htmlparser2-without-node-native
const converter = (getMarkup: () => JSX.Element | JSX.Element[]) => {

  type Border = Partial<{ Color: string; Width: number; Style: string /*solid x none*/ }>
  type Font = Partial<{ color: string; backgroundColor: string; fontSize: number; fontWeight: RN.TextStyle['fontWeight']; ital: boolean; und: boolean; strike: boolean }> //color-bkgndColor-fontSize-fontWeight-lineHeight-italic-underline 
  type Margin = Partial<{ Left: number; Top: number; Right: number; Bottom: number }>
  type Style = {
    margin: Margin
    padding: Margin
    border: Border
    font: Font
  }
  type TagDefault = { isBlock?: boolean, style: RN.TextStyle }
  type Parsed = { type: string, style: Style, styleRest: React.CSSProperties, props: object, children: Array<Parsed | string>}
  type FontWeight = RN.TextStyle['fontWeight']

  const fontSize = 14
  const startTag: Parsed = {
    type: 'div',
    props: null,
    children: null,
    style: { margin: {}, padding: {}, border: {}, font: { color: 'black', backgroundColor: 'white', fontSize: fontSize, fontWeight: '400', ital: false, und: false, strike: false } },
    styleRest: null
  }

  const mapObject = (obj: object, prefix: string, isAdd: boolean, defaultValue?: number) => {
    if (!obj) return null
    const res = {}
    for (const p in obj) {
      let val = obj[p];
      if (!val) { if (typeof defaultValue == 'undefined') continue; val = defaultValue };
      res[isAdd ? prefix + p : p.substr(prefix.length)] = val
    }
    return res
  }

  const em = 1000

  //https://www.w3schools.com/cssref/css_default_values.asp
  const tagDefaults: { [tag: string]: TagDefault } = {
    div: { isBlock: true, style: {} },
    blockquote: { isBlock: true, style: { marginTop: 1 / em, marginBottom: 1 / em, marginLeft: 40, marginRight: 40, } },
    p: { isBlock: true, style: { marginTop: 1 / em, marginBottom: 1 / em, } },
    h1: { isBlock: true, style: { fontWeight: '500', fontSize: 2 / em, marginTop: 0.67 / em, marginBottom: 0.67 / em, } },
    h2: { isBlock: true, style: { fontSize: 1.5 / em, marginTop: 0.83 / em, marginBottom: 0.83 / em, } },
    h3: { isBlock: true, style: { fontSize: 1.17 / em, marginTop: 1 / em, marginBottom: 1 / em, } },
    h4: { isBlock: true, style: { marginTop: 1.33 / em, marginBottom: 1.33 / em, } },
    ul: { isBlock: true, style: { marginTop: 1 / em, marginBottom: 1 / em, marginLeft: 0, marginRight: 0, paddingLeft: 40, } },
    ol: { isBlock: true, style: { marginTop: 1 / em, marginBottom: 1 / em, marginLeft: 0, marginRight: 0, paddingLeft: 40, } },
    li: { isBlock: true, style: {} },
    b: { style: { fontWeight: '500' } },
    i: { style: { fontStyle: 'italic' } },
    em: { style: { fontStyle: 'italic' } },
    u: { style: { textDecorationLine: 'underline' } },
    a: { style: { textDecorationLine: 'underline', color: 'blue' } },
    span: { style: {} },
  }

  const old = React.createElement
  //parsing
  let parsed: Parsed | Parsed[]
  try {
    (React as any)['createElement'] = (type: string, pars, ...children) => {

      //if (typeof type !== 'string') return { type, props: pars, children, styleRest: null, style: null } as Parsed

      const tagDefault = tagDefaults[type]

      const defStyle: RN.TextStyle = tagDefault.style
      const { __source = null, style: styleSource = {}, ...props } = pars || {}

      const { margin, marginTop, marginBottom, marginLeft, marginRight,
        padding, paddingTop, paddingBottom, paddingLeft, paddingRight,
        borderColor, borderWidth, borderStyle,
        color, backgroundColor, fontSize, fontWeight, fontStyle, textDecorationLine,
        ...styleRest } = { ...defStyle, ...styleSource } as RN.TextStyle

      const style: Style = {
        margin: mapObject({ marginTop, marginBottom, marginLeft, marginRight }, 'margin', false, margin as number),
        padding: mapObject({ paddingTop, paddingBottom, paddingLeft, paddingRight }, 'padding', false, padding as number),
        border: mapObject({ borderColor, borderWidth, borderStyle }, 'border', false),
        font: {
          ...color && { color },
          ...backgroundColor && { backgroundColor },
          ...fontSize && { fontSize },
          ...fontWeight && { fontWeight: fontWeight.toString() as FontWeight },
          ...fontStyle && { ital: fontStyle === 'italic' },
          ...textDecorationLine && { und: textDecorationLine.indexOf('underline') >= 0 },
          ...textDecorationLine && { strike: textDecorationLine.indexOf('line-through') >= 0 },
        }
      }

      //not accepted INLINE style attributes
      const checkEmpty = (obj: object, type: string, propName: string) => {
        if (!obj) return
        for (const p in obj) {
          warning(false, `*** reactx-html: Wrong property ${propName}.${p} of inline ${type} tag (${JSON.stringify(obj, null, 2)})`) //'`'
          break
        }
      }
      if (!tagDefault.isBlock) {
        checkEmpty(style.margin, type, 'margin')
        checkEmpty(style.padding, type, 'padiding')
        checkEmpty(style.border, type, 'border')
      }

      return { type, props, children, styleRest, style, knownTag: true } as Parsed
    }
    parsed = getMarkup() as any
  } finally {
    React.createElement = old
  }

  //const json = JSON.stringify(parsed, null, 2); debugger

  const mergeStyles = (parent: Style, child: Style) => {
    const res: Style = {
      margin: {},
      padding: { ...child.padding },
      border: { ...child.border },
      font: { ...parent.font, ...child.font }
    }
    return res
  }

  const convert = (tag: Parsed, parent: Parsed) => {
    tag.style = mergeStyles(parent.style, tag.style)
    const tagDefault = tagDefaults[tag.type]
    if (!tagDefaults[parent.type as string].isBlock) warning(!tagDefault.isBlock, `*** reactx-html: BLOCK tag ('${parent.type}') cannot be nested in INLINE tag ('${tag.type}')`) //'`'
    let children: Parsed[] = []
    let waitingInlines = []

    const emptyWaitings = () => {
      if (waitingInlines.length == 0) return null
      //children.push(...) //TODO
      waitingInlines = []
    }

    if (tag.children) tag.children.forEach(ch => {
      if (typeof ch == 'string') { waitingInlines.push(ch); return }
      if (!tagDefault.isBlock) waitingInlines.push(convert(ch, tag))
      emptyWaitings()
      children.push(convert(ch as Parsed, tag))
    })
    emptyWaitings()
    tag.children = children
    return tag
  }

  //return <code><pre>xxx</pre></code>
  //console.log(parsed)
  //parsed[0].props.onClick()

  let res
  if (Array.isArray(parsed)) res = parsed.map(p => convert(p, startTag))
  else res = convert(parsed, startTag)

  const json = JSON.stringify(parsed, null, 2); debugger

  return null

}

export default converter
//<Typography>Colors</Typography>
//<Text>{JSON.stringify(createMuiTheme({}), null, 2)}</Text>


const x = `

`