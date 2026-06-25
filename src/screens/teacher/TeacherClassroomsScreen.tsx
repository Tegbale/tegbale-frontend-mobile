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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import SearchBar from '../../components/SearchBar';
import AvatarCircle from '../../components/AvatarCircle';
import MenuDrawer from '../../components/MenuDrawer';
import { RootStackParamList, ClassroomData } from '../../navigation/types';
import { listClassrooms, Classroom } from '../../services/classroomsService';

const MOCK_CLASSROOMS: ClassroomData[] = [
  { id: '1', name: 'Primary 5 Classroom', studentCount: 20 },
  { id: '2', name: 'Primary 2 Classroom', studentCount: 15 },
  { id: '3', name: 'Primary 5A Classroom', studentCount: 20 },
  { id: '4', name: 'Primary 2B Classroom', studentCount: 15 },
  { id: '5', name: 'Primary 3 Classroom', studentCount: 18 },
  { id: '6', name: 'Primary 1 Classroom', studentCount: 22 },
];

function classroomToData(c: Classroom): ClassroomData {
  return {
    id: c.id,
    name: c.name,
    studentCount: c._count?.students ?? 0,
  };
}

export default function TeacherClassroomsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [classrooms, setClassrooms] = useState<ClassroomData[]>(MOCK_CLASSROOMS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClassrooms = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await listClassrooms();
      if (res.classrooms.length > 0) setClassrooms(res.classrooms.map(classroomToData));
    } catch {
      // keep mock data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchClassrooms(); }, [fetchClassrooms]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClassrooms(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.hamburger}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Classrooms</Text>
        <View style={styles.headerRight} />
      </View>

      <SearchBar placeholder="Search classroom" />

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        </View>
      ) : (
        <FlatList
          data={classrooms}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.classRow}
              onPress={() => navigation.navigate('ClassroomDetail', { classroom: item })}
              activeOpacity={0.8}
            >
              <AvatarCircle
                type={index % 2 === 0 ? 'student-boy' : 'student-girl'}
                size={44}
              />
              <View style={styles.classInfo}>
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.classCount}>{item.studentCount} Students</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.secondaryText} />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryBlue} />
          }
        />
      )}

      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={(screen) => navigation.navigate(screen as any)}
      />
    </SafeAreaView>
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
  headerRight: { width: 28 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 68,
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
});
