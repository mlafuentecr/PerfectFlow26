import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Start from '../screens/Start'; // Make sure to provide the correct path to Start component
import HomePage from '../screens/HomePage'; // Make sure to provide the correct path to HomePage component
import RateUs from '../screens/RateUs';
import Settings from '../screens/Settings';
import Breath from '../screens/Breath';
import Benefits from '../screens/Benefits';
import Learn from '../screens/Learn';
import Help from '../screens/Help';
import Faq from '../screens/Faq';
import Privacy from '../screens/Privacy';
import TermsAndConditions from '../screens/Terms_and_conditions';
import Acknowledgment from '../screens/Acknowledgment';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // Hide the header for all screens
        headerTransparent: true, // Make the header transparent
        headerTitle: '',
      }}>
      <Stack.Screen
        name="Start"
        component={Start}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{presentation: 'transparentModal', headerShown: false}}
      />

      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="Breath"
        component={Breath}
        options={{presentation: 'transparentModal'}}
      />

      <Stack.Screen
        name="Benefits"
        component={Benefits}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="Learn"
        component={Learn}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="RateUs"
        component={RateUs}
        options={{presentation: 'transparentModal'}}
      />

      <Stack.Screen
        name="Help"
        component={Help}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="Faq"
        component={Faq}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{presentation: 'transparentModal'}}
      />
      <Stack.Screen
        name="Acknowledgment"
        component={Acknowledgment}
        options={{presentation: 'transparentModal'}}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
