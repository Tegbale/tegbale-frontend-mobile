import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import AvatarCircle from '../../components/AvatarCircle';
import MenuDrawer from '../../components/MenuDrawer';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';

export default function TeacherHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  const firstName = user?.firstName ?? 'Teacher';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.hamburger}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('TeacherNotifications' as any)}>
          <Ionicons name="notifications-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <AvatarCircle type="teacher" size={56} />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeHeading}>Good morning, {firstName}!</Text>
            <Text style={styles.welcomeSub}>You have 2 classrooms today</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Classrooms</Text>
        {[
          { name: 'Primary 5 Classroom', count: '20 Students', type: 'student-boy' as const },
          { name: 'Primary 2 Classroom', count: '15 Students', type: 'student-girl' as const },
        ].map((cls, i) => (
          <TouchableOpacity
            key={i}
            style={styles.classRow}
            onPress={() => navigation.navigate('ClassroomDetail', { classroom: { id: String(i), name: cls.name, studentCount: parseInt(cls.count) } })}
            activeOpacity={0.8}
          >
            <AvatarCircle type={cls.type} size={44} />
            <View style={styles.classInfo}>
              <Text style={styles.className}>{cls.name}</Text>
              <Text style={styles.classCount}>{cls.count}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.secondaryText} />
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Quick Stats</Text>
        <View style={styles.statsRow}>
          <StatCard icon="people" label="Total Students" value="35" color="#4A90D9" />
          <StatCard icon="chatbubbles" label="Messages" value="8" color="#27AE60" />
          <StatCard icon="calendar" label="Events" value="3" color="#9B59B6" />
        </View>
      </ScrollView>

      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={(screen) => navigation.navigate(screen as any)}
      />
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    paddingHorizontal: 16,
  },
  hamburger: { padding: 4 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: Colors.white },
  headerRight: { padding: 4 },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeText: { flex: 1 },
  welcomeHeading: { fontSize: 16, fontWeight: 'bold', color: Colors.darkText },
  welcomeSub: { fontSize: 13, color: Colors.secondaryText, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.darkText, marginBottom: 12 },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  classInfo: { flex: 1 },
  className: { fontSize: 15, fontWeight: '600', color: Colors.darkText },
  classCount: { fontSize: 12, color: Colors.secondaryText, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 4,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: Colors.secondaryText, textAlign: 'center', fontWeight: '500' },
});
