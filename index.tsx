import React from 'react'
import ReactDOM from 'react-dom'
//import app from 'test/index'
import App from './src/test/mui'

//const AppComp: React.SFC = props => <h1>HALLO</h1>
//const AppComp = app


export const init = () => ReactDOM.render(<App />, document.getElementById('content'))

//() => ReactDOM.render(<AppComp/>, document.getElementById('content'))

