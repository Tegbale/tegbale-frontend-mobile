import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import AvatarCircle from '../../components/AvatarCircle';
import { RootStackParamList } from '../../navigation/types';
import { searchUsers, UserResult } from '../../services/usersService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateMessage'>;
};

function roleLabel(role: string): string {
  if (role === 'STAFF' || role === 'TEACHER') return 'Teacher';
  if (role === 'PARENT') return 'Parent';
  if (role === 'SCHOOL_ADMIN') return 'Admin';
  return role;
}

export default function CreateMessageScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const users = await searchUsers(text);
      setResults(users);
      setSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor={Colors.placeholderText}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {loading && <ActivityIndicator size="small" color={Colors.primaryBlue} style={styles.searchSpinner} />}
      </View>

      {!query.trim() ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={48} color={Colors.secondaryText} />
          <Text style={styles.hintText}>Search for a teacher or parent to message</Text>
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.hintText}>No users found for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => navigation.navigate('Chat', {
                contact: { id: item.id, name: `${item.firstName} ${item.lastName}` },
              })}
              activeOpacity={0.8}
            >
              <AvatarCircle type={item.role === 'PARENT' ? 'parent' : 'teacher'} size={44} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.contactRole}>{roleLabel(item.role)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.secondaryText} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: Colors.white },
  headerRight: { width: 28 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F2F4F8',
    borderRadius: 24,
    height: 46,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.darkText },
  searchSpinner: { marginLeft: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
  hintText: { fontSize: 14, color: Colors.secondaryText, textAlign: 'center' },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    minHeight: 64,
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: 'bold', color: Colors.darkText },
  contactRole: { fontSize: 12, color: Colors.secondaryText, marginTop: 2 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderGray, marginLeft: 72 },
});
