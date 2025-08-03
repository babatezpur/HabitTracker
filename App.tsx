import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { useNotifications } from './src/hooks/useNotifications';
import HomeScreen from './src/screens/HomeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  const { requestPermissions, checkPermissions } = useNotifications();

  useEffect(() => {
    const initializeNotifications = async () => {
      const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        // Request permissions on first launch
        await requestPermissions();
      }
    };

    initializeNotifications();
  }, [checkPermissions, requestPermissions]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#28a745',
          tabBarInactiveTintColor: '#6c757d',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e9ecef',
            paddingBottom: 25,
            paddingTop: 8,
            height: 65,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📊</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>⚙️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
