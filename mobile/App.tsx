import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// Screens
import ResearchListScreen from './src/screens/ResearchListScreen';
import ResearchDetailScreen from './src/screens/ResearchDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1A1A2E',
          },
          headerTintColor: '#00D4FF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: '#0F0F1E',
          },
        }}
      >
        <Stack.Screen
          name="ResearchList"
          component={ResearchListScreen}
          options={{ title: 'ECHO - Research' }}
        />
        <Stack.Screen
          name="ResearchDetail"
          component={ResearchDetailScreen}
          options={{ title: 'Research Details' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Search Intelligence' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
