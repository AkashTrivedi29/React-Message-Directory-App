import React from 'react';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import AppNavigator from './src/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });

  if (!fontsLoaded) return <AppLoading />;
  return <AppNavigator />;
}
