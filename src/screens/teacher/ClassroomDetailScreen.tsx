import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, StudentData } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import SearchBar from '../../components/SearchBar';
import StudentCard from '../../components/StudentCard';
import { listClassroomStudents, ClassroomStudent } from '../../services/classroomsService';

type Tab = 'students' | 'settings';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ClassroomDetail'>;
  route: RouteProp<RootStackParamList, 'ClassroomDetail'>;
};

const MOCK_STUDENTS: StudentData[] = [
  { id: '1', name: 'Ebun F.', firstName: 'Ebun', classroom: 'Primary 5 Classroom', avatarType: 'girl' },
  { id: '2', name: 'Aisha M.', firstName: 'Aisha', classroom: 'Primary 5 Classroom', avatarType: 'girl' },
  { id: '3', name: 'Emeka U.', firstName: 'Emeka', classroom: 'Primary 5 Classroom', avatarType: 'boy' },
  { id: '4', name: 'Tunde A.', firstName: 'Tunde', classroom: 'Primary 5 Classroom', avatarType: 'boy' },
  { id: '5', name: 'Chisom O.', firstName: 'Chisom', classroom: 'Primary 5 Classroom', avatarType: 'girl' },
  { id: '6', name: 'David E.', firstName: 'David', classroom: 'Primary 5 Classroom', avatarType: 'boy' },
];

function studentToData(s: ClassroomStudent): StudentData {
  return {
    id: s.id,
    name: `${s.firstName} ${s.lastName[0]}.`,
    firstName: s.firstName,
    classroom: s.classroom?.name ?? '',
    classroomId: s.classroom?.id,
    avatarType: s.gender?.toLowerCase() === 'male' ? 'boy' : 'girl',
  };
}

export default function ClassroomDetailScreen({ navigation, route }: Props) {
  const { classroom } = route.params;
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [students, setStudents] = useState<StudentData[]>(MOCK_STUDENTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudents = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await listClassroomStudents(classroom.id);
      if (res.students.length > 0) setStudents(res.students.map(studentToData));
    } catch {
      // keep mock data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [classroom.id]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{classroom.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.tabRow}>
        {(['students', 'settings'] as Tab[]).map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'students' ? (
        <>
          <SearchBar placeholder="Search student" />
          {loading && !refreshing ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={Colors.primaryBlue} />
            </View>
          ) : (
            <FlatList
              data={students}
              keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) => (
                <StudentCard
                  student={item}
                  onPress={() => navigation.navigate('ViewStudent', { student: item })}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryBlue} />
              }
            />
          )}
        </>
      ) : (
        <View style={styles.settingsPlaceholder}>
          <Text style={styles.settingsText}>Classroom Settings</Text>
          <Text style={styles.settingsSub}>Configure classroom name, add/remove students</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    backgroundColor: Colors.primaryBlue,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 20, color: Colors.white },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: Colors.white },
  headerRight: { width: 28 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
    backgroundColor: Colors.white,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabText: { fontSize: 15, color: Colors.secondaryText },
  tabTextActive: { color: Colors.primaryBlue, fontWeight: 'bold' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Colors.primaryBlue,
  },
  grid: { paddingHorizontal: 10, paddingVertical: 8 },
  settingsPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  settingsText: { fontSize: 16, fontWeight: 'bold', color: Colors.darkText, marginBottom: 8 },
  settingsSub: { fontSize: 14, color: Colors.secondaryText, textAlign: 'center' },
});
