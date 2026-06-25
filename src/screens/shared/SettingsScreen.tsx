import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const APP_VERSION = '1.0.0';

export default function SettingsScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Notifications" />
        <View style={styles.card}>
          <ToggleRow
            icon="notifications-outline"
            label="Push Notifications"
            sub="Receive alerts on your device"
            value={pushNotifications}
            onToggle={setPushNotifications}
          />
          <Divider />
          <ToggleRow
            icon="chatbubble-outline"
            label="Message Alerts"
            sub="Notify me of new messages"
            value={messageAlerts}
            onToggle={setMessageAlerts}
          />
          <Divider />
          <ToggleRow
            icon="calendar-outline"
            label="Event Reminders"
            sub="Remind me of upcoming events"
            value={eventReminders}
            onToggle={setEventReminders}
          />
        </View>

        <SectionHeader title="Account" />
        <View style={styles.card}>
          <LinkRow
            icon="person-outline"
            label="My Profile"
            onPress={() => navigation.navigate('Profile')}
          />
        </View>

        <SectionHeader title="About" />
        <View style={styles.card}>
          <InfoTextRow icon="information-circle-outline" label="App Version" value={APP_VERSION} />
          <Divider />
          <InfoTextRow icon="code-slash-outline" label="Platform" value="Tègbalé Mobile" />
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutBtn, loggingOut && styles.logoutBtnDisabled]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
            <Text style={styles.logoutText}>{loggingOut ? 'Logging out…' : 'Log Out'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function ToggleRow({
  icon, label, sub, value, onToggle,
}: {
  icon: string; label: string; sub: string; value: boolean; onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon as any} size={20} color={Colors.primaryBlue} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.borderGray, true: Colors.primaryBlue }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

function LinkRow({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon as any} size={20} color={Colors.primaryBlue} />
      </View>
      <Text style={[styles.rowLabel, { flex: 1 }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.secondaryText} />
    </TouchableOpacity>
  );
}

function InfoTextRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon as any} size={20} color={Colors.primaryBlue} />
      </View>
      <Text style={[styles.rowLabel, { flex: 1 }]}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryBlue + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '500', color: Colors.darkText },
  rowSub: { fontSize: 12, color: Colors.secondaryText, marginTop: 2 },
  rowValue: { fontSize: 14, color: Colors.secondaryText },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 16 },
  logoutSection: { paddingHorizontal: 16, marginTop: 32 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FEECEC',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E74C3C30',
  },
  logoutBtnDisabled: { opacity: 0.6 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#E74C3C' },
});
