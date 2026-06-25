import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import SelectAccountTypeScreen from '../screens/auth/SelectAccountTypeScreen';
import TeacherLoginScreen from '../screens/auth/TeacherLoginScreen';
import ParentLoginScreen from '../screens/auth/ParentLoginScreen';
import ParentTabs from './ParentTabs';
import TeacherTabs from './TeacherTabs';
import ViewWardModal from '../screens/parent/ViewWardModal';
import ViewStudentModal from '../screens/teacher/ViewStudentModal';
import CreateMessageScreen from '../screens/shared/CreateMessageScreen';
import ChatScreen from '../screens/shared/ChatScreen';
import ClassroomDetailScreen from '../screens/teacher/ClassroomDetailScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';
import EventsScreen from '../screens/shared/EventsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <AuthProvider>
      <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="SelectAccountType" component={SelectAccountTypeScreen} />
          <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
          <Stack.Screen name="ParentLogin" component={ParentLoginScreen} />
          <Stack.Screen name="ParentApp" component={ParentTabs} />
          <Stack.Screen name="TeacherApp" component={TeacherTabs} />
          <Stack.Screen name="ClassroomDetail" component={ClassroomDetailScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="ViewWard" component={ViewWardModal} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="ViewStudent" component={ViewStudentModal} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="CreateMessage" component={CreateMessageScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="Events" component={EventsScreen} options={{ animation: 'slide_from_right' }} />
        </Stack.Navigator>
      </NavigationContainer>
      </SocketProvider>
    </AuthProvider>
  );
}
