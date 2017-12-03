import React from 'react'
import ReactDOM from 'react-dom'
import app from 'test/index'

const AppComp: React.SFC = props => <h1>HALLO</h1>

const ActApp = app


export const init = () => ReactDOM.render(<ActApp/>, document.getElementById('content'))

