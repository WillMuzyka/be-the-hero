import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

const AppStack = createStackNavigator()

import Incidents from './pages/Incidents'
import Detail from './pages/Detail'

export default function Routes() {
	return (
		<NavigationContainer screenOptions={{ headerShown: false }}>
			<AppStack.Navigator>
				<AppStack.Screen name="Incidents" component={Incidents} options={{ headerShown: false }} />
				<AppStack.Screen name="Detail" component={Detail} options={{ headerShown: false }} />
			</AppStack.Navigator>
		</NavigationContainer>
	)
}