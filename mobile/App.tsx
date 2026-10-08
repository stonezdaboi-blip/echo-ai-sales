import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ResearchListScreen from './src/ResearchListScreen';
import ResearchDetailScreen from './src/ResearchDetailScreen';
import SearchScreen from './src/SearchScreen';
import PatternsScreen from './src/PatternsScreen';
import SettingsScreen from './src/SettingsScreen';

const Stack = createNativeStackNavigator();

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderText}>
        This ECHO module is being built.
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Research"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1A1A2E',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0F0F1E',
          },
        }}
      >
        <Stack.Screen
          name="Research"
          component={ResearchListScreen}
          options={{ title: 'ECHO Research' }}
        />

        <Stack.Screen
          name="ResearchDetail"
          component={ResearchDetailScreen}
          options={{ title: 'Research Detail' }}
        />

        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Search' }}
        />

        <Stack.Screen
          name="Patterns"
          component={PatternsScreen}
          options={{ title: 'Patterns' }}
        />

        <Stack.Screen
          name="Facts"
          options={{ title: 'Facts' }}
        >
          {() => <PlaceholderScreen title="Verified Facts" />}
        </Stack.Screen>

        <Stack.Screen
          name="Alerts"
          options={{ title: 'Alerts' }}
        >
          {() => <PlaceholderScreen title="Research Alerts" />}
        </Stack.Screen>

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: '#0F0F1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholderText: {
    color: '#888888',
    fontSize: 15,
    textAlign: 'center',
  },
});
