import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from './app/index';
import HomeScreen from './app/home';
import BreathingScreen from './app/breathing';
import InsightsScreen from './app/insights';
import SessionsScreen from './app/sessions';
import ProgressScreen from './app/progress';

export type RootStackParamList = {
  index: undefined;
  home: undefined;
  breathing: { technique?: string } | undefined;
  insights: undefined;
  sessions: undefined;
  progress: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" component={IndexScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="breathing" component={BreathingScreen} />
        <Stack.Screen name="insights" component={InsightsScreen} />
        <Stack.Screen name="sessions" component={SessionsScreen} />
        <Stack.Screen name="progress" component={ProgressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
