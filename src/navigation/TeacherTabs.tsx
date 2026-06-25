import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useSocket } from '../context/SocketContext';
import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';
import TeacherClassroomsScreen from '../screens/teacher/TeacherClassroomsScreen';
import EventsScreen from '../screens/shared/EventsScreen';
import MessageListScreen from '../screens/shared/MessageListScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';

const Tab = createBottomTabNavigator();

type TabIconProps = {
  focused: boolean;
  name: string;
  badge?: boolean;
};

function TabIcon({ focused, name, badge }: TabIconProps) {
  return (
    <View style={styles.iconWrap}>
      {focused && <View style={styles.activePill} />}
      <Ionicons
        name={(focused ? name : `${name}-outline`) as any}
        size={24}
        color={focused ? Colors.primaryBlue : '#A0A8B8'}
      />
      {badge && (
        <View style={styles.badge} />
      )}
    </View>
  );
}

export default function TeacherTabs() {
  const { notifCount } = useSocket();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="TeacherHome"
        component={TeacherHomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="home" /> }}
      />
      <Tab.Screen
        name="TeacherClassrooms"
        component={TeacherClassroomsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="school" /> }}
      />
      <Tab.Screen
        name="TeacherEvents"
        component={EventsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="calendar" /> }}
      />
      <Tab.Screen
        name="TeacherMessages"
        component={MessageListScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="chatbubbles" /> }}
      />
      <Tab.Screen
        name="TeacherNotifications"
        component={NotificationsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="notifications" badge={notifCount > 0} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    borderTopWidth: 0,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconWrap: {
    width: 48,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryBlue,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
});
