import React from 'react'
//import converter from 'reactx-html/current/index'
import converter from '../reactx-html/native/index'

const app = () => <div>
  {converter(() => <>
    text alone
    <div style={{ margin: 10, marginTop: 20, marginLeft: 30, borderColor: 'red', borderWidth: 1, borderStyle: 'solid', padding: 5 }}>
      <h1>h1</h1>
      <h2>h2</h2>
      <h3>h3</h3>
      <h4>h4</h4>
    <b>Bold</b> and <i>italic</i> and <u>underline</u>
    <b>Bold <span style={{ fontWeight: '400' }}>not bold</span></b> and <i>italic and <span style={{ fontStyle: 'normal' }}>no italic</span></i> and <u>underline</u>
    </div>
    <div style={{}}>before span <span></span> after span</div>
    <div>no style</div>
    </>)}
</div>

const app2 = () => <div>
  {converter(() => <span style={{ borderColor: 'green', }}>
    <div style={{ margin: 10, marginTop: 20, marginLeft: 30, borderColor: 'red', borderWidth: 1, borderStyle: 'solid', padding: 5 }}/>
  </span>)}
</div>

export default app2

