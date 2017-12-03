import React from 'react'
import ReactDOM from 'react-dom'
import app from 'test/index'

//const AppComp: React.SFC = props => <h1>HALLO</h1>
const AppComp = app


export const init = () => ReactDOM.render(<AppComp/>, document.getElementById('content'))

