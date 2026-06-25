import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import AppLogo from '../../components/AppLogo';
import AvatarCircle from '../../components/AvatarCircle';

type Role = 'teacher' | 'parent';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SelectAccountType'>;
};

export default function SelectAccountTypeScreen({ navigation }: Props) {
  const [role, setRole] = useState<Role>('parent');

  const handleContinue = () => {
    if (role === 'teacher') {
      navigation.navigate('TeacherLogin');
    } else {
      navigation.navigate('ParentLogin');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoSection}>
        <AppLogo size={60} />
        <Text style={styles.appName}>Tegbale</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.heading}>Welcome to Tegbale</Text>
        <Text style={styles.sub}>Choose your account type to get started</Text>

        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'teacher' && styles.roleBtnSelectedTeacher]}
            onPress={() => setRole('teacher')}
            activeOpacity={0.85}
          >
            <AvatarCircle type="teacher" size={36} />
            <Text style={[styles.roleBtnText, role === 'teacher' && styles.roleBtnTextSelected]}>
              I am a Teacher
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, role === 'parent' && styles.roleBtnSelected]}
            onPress={() => setRole('parent')}
            activeOpacity={0.85}
          >
            <AvatarCircle type="parent" size={36} />
            <Text style={[styles.roleBtnText, role === 'parent' && styles.roleBtnTextSelected]}>
              I am a Parent
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={styles.ctaText}>
            {role === 'teacher' ? 'Continue as a Teacher' : 'Continue as a Parent'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 48,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryBlue,
    marginTop: 8,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.darkText,
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 40,
  },
  roleButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: Colors.primaryBlue,
    borderRadius: 28,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: Colors.white,
  },
  roleBtnSelectedTeacher: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  roleBtnSelected: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  roleBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkText,
  },
  roleBtnTextSelected: {
    color: Colors.white,
  },
  ctaBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
