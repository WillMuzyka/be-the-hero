import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import { SplashScreen } from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Routes from './src/routes'

export default function App() {
	SplashScreen.preventAutoHide()
	setTimeout(() => { SplashScreen.hide() }, 750)
	return (
		<Routes />
	);
}