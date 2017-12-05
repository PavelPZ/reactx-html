import Expo from 'expo';
import React from 'react'

import App from './src/test/mui'
import icon from './src/test/icons'

import { Text } from 'react-native'
//import app from 'test/index'

const AppComp: React.SFC = props => <Text>ICON: {icon}</Text>
//const AppComp = App

//export default AppComp
//export default app

Expo.registerRootComponent(AppComp)
