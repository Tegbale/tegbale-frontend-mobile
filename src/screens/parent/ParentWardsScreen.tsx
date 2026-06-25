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
import StudentCard from '../../components/StudentCard';
import MenuDrawer from '../../components/MenuDrawer';
import { RootStackParamList, StudentData } from '../../navigation/types';
import { listWards, Ward } from '../../services/wardsService';

const MOCK_WARDS: StudentData[] = [
  { id: '1', name: 'Emeka U.', firstName: 'Emeka', classroom: 'Primary 5 Classroom', avatarType: 'boy' },
  { id: '2', name: 'Ebun F.', firstName: 'Ebun', classroom: 'Primary 5 Classroom', avatarType: 'girl' },
  { id: '3', name: 'Aisha M.', firstName: 'Aisha', classroom: 'Primary 3 Classroom', avatarType: 'girl' },
  { id: '4', name: 'Tunde A.', firstName: 'Tunde', classroom: 'Primary 2 Classroom', avatarType: 'boy' },
  { id: '5', name: 'Chisom O.', firstName: 'Chisom', classroom: 'Primary 4 Classroom', avatarType: 'girl' },
  { id: '6', name: 'David E.', firstName: 'David', classroom: 'Primary 1 Classroom', avatarType: 'boy' },
];

function wardToStudentData(w: Ward): StudentData {
  return {
    id: w.id,
    name: `${w.firstName} ${w.lastName[0]}.`,
    firstName: w.firstName,
    classroom: w.classroom?.name ?? '',
    classroomId: w.classroom?.id,
    avatarType: w.gender?.toLowerCase() === 'male' ? 'boy' : 'girl',
  };
}

export default function ParentWardsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [wards, setWards] = useState<StudentData[]>(MOCK_WARDS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWards = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await listWards();
      if (res.wards.length > 0) setWards(res.wards.map(wardToStudentData));
    } catch {
      // keep mock data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchWards(); }, [fetchWards]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWards(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.hamburger}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wards</Text>
        <View style={styles.headerRight} />
      </View>

      <SearchBar placeholder="Search ward" />

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        </View>
      ) : (
        <FlatList
          data={wards}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onPress={() => navigation.navigate('ViewWard', { student: item })}
            />
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
  container: { flex: 1, backgroundColor: Colors.white },
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
  grid: { paddingHorizontal: 8, paddingVertical: 12 },
  row: { paddingHorizontal: 2 },
});
