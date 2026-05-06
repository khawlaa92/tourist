/**
 * App.js — Version Corrigée
 *
 * Corrections :
 * - Masquage du SplashScreen après le chargement du ThemeContext
 * - Ajout de GestureHandlerRootView (requis par react-native-gesture-handler)
 * - SafeAreaProvider ajouté (requis par react-native-safe-area-context)
 * - Transition d'animation entre écrans plus fluide
 */

import React, { useContext } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, ThemeContext } from './src/context/ThemeContext';

// Screens
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from './screens/ResetPasswordScreen';
import { VerifyResetCodeScreen } from './screens/VerifyResetCodeScreen';
import { VerifyEmailScreen } from './screens/VerifyEmailScreen';
import { HomeScreen } from './screens/HomeScreenV2';
import { ChatScreen } from './screens/ChatScreen';
import { MapScreen } from './screens/MapScreen';
import { TranslationScreen } from './screens/TranslationScreen';
import { MoneyConverterScreen } from './screens/MoneyConverterScreenV2';
import { DashboardScreen } from './screens/DashboardScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { TermsScreen } from './screens/TermsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const { theme, isDarkMode } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: isDarkMode ? '#8E8E93' : '#6B7280',
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 0,
          borderRadius: 24,
          backgroundColor: isDarkMode ? '#171717' : '#FFFFFF',
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconName = {
            Home: focused ? 'home' : 'home-outline',
            Dashboard: focused ? 'grid' : 'grid-outline',
            Settings: focused ? 'settings' : 'settings-outline',
          }[route.name] || 'ellipse-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function NavigationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // Animation fluide entre les écrans
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen
        name="Translation"
        component={TranslationScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="MoneyConverter"
        component={MoneyConverterScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <NavigationStack />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
