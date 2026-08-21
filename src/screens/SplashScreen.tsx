import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme/colors';
import AppLogo from '../components/AppLogo';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  const { user, loading } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!minTimeElapsed || loading) return;
    if (user) {
      if (user.role === 'TEACHER' || user.role === 'STAFF') {
        navigation.replace('TeacherApp');
      } else {
        navigation.replace('ParentApp');
      }
    } else {
      navigation.replace('Onboarding');
    }
  }, [minTimeElapsed, loading, user, navigation]);

  return (
    <View style={styles.container}>
      <AppLogo size={100} />
      <Text style={styles.appName}>Tegbale</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginTop: 12,
  },
});
