import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import AvatarCircle from '../../components/AvatarCircle';
import InputField from '../../components/InputField';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ParentLogin'>;
};

export default function ParentLoginScreen({ navigation }: Props) {
  const { login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const u = await login(email.trim().toLowerCase(), password);
      if (u.role !== 'PARENT') {
        await logout();
        Alert.alert('Wrong Portal', 'This login is for parents only. Please use the Teacher login.');
        return;
      }
      navigation.navigate('ParentApp');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message ?? 'Invalid credentials. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <AvatarCircle type="parent" size={52} />
            <Text style={styles.title}>Parent Login</Text>
          </View>

          <Text style={styles.hint}>
            Use the credentials sent to your email when your school account was set up.
          </Text>

          <View style={styles.form}>
            <InputField
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn} activeOpacity={0.85} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  backBtn: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backArrow: { fontSize: 22, color: Colors.darkText },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
    marginTop: 16,
    gap: 14,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.darkText },
  hint: {
    fontSize: 13,
    color: Colors.secondaryText,
    paddingHorizontal: 24,
    marginBottom: 28,
    lineHeight: 18,
  },
  form: {},
  signInBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: { fontSize: 16, fontWeight: '600', color: Colors.white },
});
