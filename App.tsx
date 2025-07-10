/**
 * BuzzCall React Native App
 * Enterprise Push Notification Engine
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  SafeAreaView, 
  StatusBar, 
  Alert,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './src/navigation/RootNavigation';
import NotificationService from './src/services/NotificationService';
import HomeScreen from './src/screens/HomeScreen';
import NotificationHistoryScreen from './src/screens/NotificationHistoryScreen';
import CallScreen from './src/screens/CallScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'History') {
            iconName = 'history';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'BuzzCall' }} />
      <Tab.Screen name="History" component={NotificationHistoryScreen} options={{ title: 'Notifications' }} />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize notification service
        await NotificationService.initialize();

        // Request notification permission
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
          
          // Get FCM token
          const fcmToken = await messaging().getToken();
          console.log('FCM Token:', fcmToken);
        }

        // Handle foreground messages
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          console.log('Foreground message received:', remoteMessage);
          NotificationService.handleForegroundMessage(remoteMessage);
        });

        // Handle background messages
        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('Background message received:', remoteMessage);
        });

        // Handle notification tap when app is in background
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('Notification opened app from background:', remoteMessage);
          NotificationService.handleNotificationTap(remoteMessage);
        });

        // Handle notification tap when app is killed
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log('Notification opened app from killed state:', remoteMessage);
              NotificationService.handleNotificationTap(remoteMessage);
            }
          });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing app:', error);
        Alert.alert('Initialization Error', 'Failed to initialize BuzzCall');
      }
    };

    initializeApp();
  }, []);

  const containerStyle = { flex: 1 };

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer 
        ref={navigationRef}
        linking={{
          prefixes: ['buzzcall://'],
          config: {
            screens: {
              Main: {
                screens: {
                  Home: 'home',
                  History: 'history',
                },
              },
              Call: 'call/:type/:id',
            },
          },
        }}
      >
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Call" 
            component={CallScreen}
            options={{ 
              headerShown: false,
              presentation: 'modal'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
