import Expo from 'expo';
import React from 'react'

import App from './src/test/mui'

import { Text } from 'react-native'
//import app from 'test/index'

//const AppComp: React.SFC = props => <Text>HALLO REACTX-HTML</Text>
const AppComp = App

//export default AppComp
//export default app

Expo.registerRootComponent(AppComp)
