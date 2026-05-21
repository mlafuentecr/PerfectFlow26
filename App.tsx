import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import IndexScreen from './app/index';
import HomeScreen from './app/home';
import BreathingScreen from './app/breathing';
import InsightsScreen from './app/insights';
import LearnDetailScreen from './app/learnDetail';
import SessionsScreen from './app/sessions';
import ProgressScreen from './app/progress';
import ProfileScreen from './app/profile';
import LegalScreen from './app/legal';
import { I18nProvider } from './services/i18n';

export type RootStackParamList = {
  index: undefined;
  home: undefined;
  breathing: { technique?: string } | undefined;
  insights: undefined;
  learnDetail: { itemId: string };
  sessions: undefined;
  progress: undefined;
  profile: undefined;
  legal: { kind: 'faq' | 'terms' | 'privacy' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <I18nProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" component={IndexScreen} />
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="breathing" component={BreathingScreen} />
          <Stack.Screen name="insights" component={InsightsScreen} />
          <Stack.Screen name="learnDetail" component={LearnDetailScreen} />
          <Stack.Screen name="sessions" component={SessionsScreen} />
          <Stack.Screen name="progress" component={ProgressScreen} />
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="legal" component={LegalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nProvider>
  );
}
