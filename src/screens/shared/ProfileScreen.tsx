import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/InputField';
import { changePassword } from '../../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

function InitialsAvatar({ name, role }: { name: string; role: string }) {
  const parts = name.trim().split(' ');
  const initials = parts.length >= 2
    ? parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
    : name.slice(0, 2).toUpperCase();
  const bgColor = role === 'PARENT' ? '#27AE60' : role === 'STAFF' ? '#4A90D9' : '#8E44AD';
  return (
    <View style={[styles.avatarCircle, { backgroundColor: bgColor }]}>
      <Text style={styles.avatarInitials}>{initials}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  const roleLabel = user.role === 'PARENT' ? 'Parent' : user.role === 'STAFF' ? 'Teacher / Staff' : 'School Admin';

  const handleChangePassword = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await changePassword(currentPass, newPass);
      Alert.alert('Success', 'Password changed successfully');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setShowChangePassword(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <InitialsAvatar name={fullName} role={user.role} />
          <Text style={styles.fullName}>{fullName}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="mail-outline" label="Email" value={user.email} />
            <Divider />
            <InfoRow icon="call-outline" label="Phone" value={user.phone ?? 'Not set'} />
            <Divider />
            <InfoRow icon="school-outline" label="School ID" value={user.schoolId} />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.changePassBtn}
            onPress={() => setShowChangePassword((v) => !v)}
          >
            <View style={styles.changePassLeft}>
              <View style={styles.changePassIcon}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.primaryBlue} />
              </View>
              <Text style={styles.changePassLabel}>Change Password</Text>
            </View>
            <Ionicons
              name={showChangePassword ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={Colors.secondaryText}
            />
          </TouchableOpacity>

          {showChangePassword && (
            <View style={styles.changePassForm}>
              <InputField
                placeholder="Current password"
                value={currentPass}
                onChangeText={setCurrentPass}
                secureTextEntry
              />
              <InputField
                placeholder="New password"
                value={newPass}
                onChangeText={setNewPass}
                secureTextEntry
              />
              <InputField
                placeholder="Confirm new password"
                value={confirmPass}
                onChangeText={setConfirmPass}
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleChangePassword}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as any} size={18} color={Colors.secondaryText} style={styles.infoIcon} />
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    backgroundColor: Colors.primaryBlue,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backBtn: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: Colors.white },
  body: { paddingBottom: 40 },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInitials: { fontSize: 34, fontWeight: '800', color: Colors.white, letterSpacing: 1 },
  fullName: { fontSize: 20, fontWeight: '700', color: Colors.darkText, marginBottom: 8 },
  rolePill: {
    backgroundColor: Colors.primaryBlue + '18',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { fontSize: 13, fontWeight: '600', color: Colors.primaryBlue },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: Colors.secondaryText, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  infoIcon: { marginRight: 12 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 11, color: Colors.secondaryText, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { fontSize: 14, color: Colors.darkText, fontWeight: '500', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 16 },
  changePassBtn: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  changePassLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  changePassIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryBlue + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePassLabel: { fontSize: 15, fontWeight: '600', color: Colors.darkText },
  changePassForm: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  saveBtn: {
    backgroundColor: Colors.primaryBlue,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
});
