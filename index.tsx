import React from 'react'
import ReactDOM from 'react-dom'
//import app from 'test/index'
import App from './src/test/mui'
import icon from './src/test/icons'

const AppComp: React.SFC = props => <h3>{icon}</h3>
//const AppComp = app


export const init = () => ReactDOM.render(<AppComp />, document.getElementById('content'))



