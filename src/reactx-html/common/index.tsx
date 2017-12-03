import React from 'react'
import { Text, View } from 'react-native'

const H2: React.SFC = (() => '\n') as any as React.SFC
const P: React.SFC = props => {
  const { children, ...rest } = props
  return [
    <Text key={1} { ...rest }>{children}{'\n'}</Text>,
    <Text key={2} style={{ lineHeight: 5 }}>{'\n'}</Text>
  ] as any
}

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

export default app

//https://github.com/oyyd/htmlparser2-without-node-native
export const converter = (getMarkup: () => JSX.Element | JSX.Element[]) => {

  type Border = Partial<{ Color: string; Width: number; Style: boolean /*solid x none*/ }>
  type Font = Partial<{ color: string; backgroundColor: string; size: number; weight: number /*-1:light, 0: normal, 1: bold*/; ital: boolean; und: boolean; strike: boolean }> //color-bkgndColor-fontSize-fontWeight-lineHeight-italic-underline 
  type Margin = Partial<{ Left: number; Top: number; Right: number; Bottom: number }>
  type Style = {
    margin: Margin
    padding: Margin
    border: Border
    font: Font
  }
  const fontSize = 14
  type BlockDefault = Partial<{ font: Font, margin: Margin }>
  type Parsed = { type: string, style: React.CSSProperties, props: object, childs: Array<Parsed | string> }
  const defaultFont: Font = { color: 'black', backgroundColor: 'white', size: fontSize, weight: 0, ital: false, und: false, strike: false }

  //https://www.w3schools.com/cssref/css_default_values.asp
  const blocksDefaults: { [tag: string]: BlockDefault } = {
    div: {},
    blockquote: { margin: { Left: 40 }, font: {} },
    p: { margin: { Top: fontSize, Bottom: fontSize }, font: {} },
    h1: { margin: { Top: 2 * 0.67 * fontSize, Bottom: 2 * 0.67 * fontSize }, font: { size: 2 * fontSize, weight: 1 } },
    h2: { margin: { Top: 1.5 * 0.83 * fontSize, Bottom: 1.5 * 0.83 * fontSize }, font: { size: 1.5 * fontSize, weight: 1 } },
    h3: { margin: { Top: 1.17 * fontSize, Bottom: 1.17 * fontSize }, font: { size: 1.17 * fontSize, weight: 1 } },
    h4: { margin: { Top: 1.33 * fontSize, Bottom: 1.33 * fontSize }, font: { size: 1 * fontSize, weight: 1 } },
    ul: { margin: { Top: fontSize, Bottom: fontSize }, font: {} },
    ol: { margin: { Top: fontSize, Bottom: fontSize }, font: {} },
    li: { margin: { Top: fontSize, Bottom: fontSize }, font: {} },
  }

  const old = React.createElement
  //parsing
  let parsed: Parsed | Parsed[]
  try {
    (React as any)['createElement'] = (type: string, pars, ...children) => {
      const { __source, style: {
        margin, marginTop, marginBottom, marginLeft, marginRight, 
        padding, paddingTop, paddingBottom, paddingLeft, paddingRight, 
        borderColor, borderWidth, borderStyle,
        color, backgroundColor, fontSize, fontWeight, fontStyle, textDecorationLine,
        ...styleRest },
        ...props } = pars
      return { type, props, children }
    }
    parsed = getMarkup() as any
  } finally {
    React.createElement = old
  }

  const convert = (block: Parsed, parent?: Style) => {
    const start: Style = parent || { margin: {}, padding: {}, border: {}, font: { ...defaultFont } }
    //TODO: merge block style to start
    let childs = null
    if (block.childs) childs = block.childs.map(ch => {
      if (typeof ch == 'string') return ch
      return convert(ch, start)
    })
    //const blockStack: BlockStackItem[] = []
    return { type: block.type, pars: start, childs }
  }

  //console.log(parsed)
  //parsed[0].props.onClick()
  if (Array.isArray(parsed)) return parsed.map(p => convert(p))
  else return convert(parsed)
}

//<Typography>Colors</Typography>
//<Text>{JSON.stringify(createMuiTheme({}), null, 2)}</Text>
