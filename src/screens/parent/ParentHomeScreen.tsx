import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import AvatarCircle from '../../components/AvatarCircle';
import MenuDrawer from '../../components/MenuDrawer';
import { useAuth } from '../../context/AuthContext';
import { listPosts, createComment, Post } from '../../services/postsService';
import { RootStackParamList } from '../../navigation/types';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    content: '@Ebun aced all her tests today. I\'m so proud of her growth.',
    schoolId: '',
    authorId: '',
    author: { id: '', firstName: 'Mrs. Sade', lastName: 'Adeyemi', role: 'STAFF' },
    createdAt: new Date().toISOString(),
    _count: { comments: 1 },
  },
  {
    id: '2',
    content: '@Emeka showed excellent leadership skills during group work today. Well done!',
    schoolId: '',
    authorId: '',
    author: { id: '', firstName: 'Mr. Jerry', lastName: 'Oriyomi', role: 'STAFF' },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    _count: { comments: 3 },
  },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function PostCard({ post }: { post: Post }) {
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const authorName = `${post.author.firstName} ${post.author.lastName}`;

  const handleSendReply = async () => {
    const text = reply.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      await createComment(post.id, text);
      setReply('');
    } catch {
      // silent — don't block the user
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AvatarCircle type="teacher" size={40} />
        <View style={styles.cardHeaderText}>
          <Text style={styles.teacherName}>{authorName}</Text>
          <Text style={styles.teacherRole}>Teacher</Text>
        </View>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={12} color={Colors.secondaryText} />
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.postBody}>{post.content}</Text>

      {post.imageUrl && (
        <View style={styles.photoPlaceholder}>
          <Ionicons name="image-outline" size={28} color={Colors.secondaryText} />
          <Text style={styles.photoPlaceholderText}>Class Photo</Text>
        </View>
      )}

      <TouchableOpacity>
        <Text style={styles.commentLink}>
          {post._count.comments} Comment{post._count.comments !== 1 ? 's' : ''}
        </Text>
      </TouchableOpacity>

      <View style={styles.replyBar}>
        <AvatarCircle type="parent" size={24} />
        <TextInput
          style={styles.replyInput}
          placeholder="Reply to comment"
          placeholderTextColor={Colors.placeholderText}
          value={reply}
          onChangeText={setReply}
        />
        <TouchableOpacity onPress={handleSendReply} disabled={submitting || !reply.trim()}>
          {submitting
            ? <ActivityIndicator size="small" color={Colors.primaryBlue} />
            : <Ionicons name="send" size={18} color={reply.trim() ? Colors.primaryBlue : Colors.secondaryText} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ParentHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.firstName ?? 'there';

  const fetchPosts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await listPosts();
      if (res.posts.length > 0) setPosts(res.posts);
    } catch {
      // keep mock data on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.hamburger}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('ParentNotifications' as any)}>
          <Ionicons name="notifications-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.greetingBar}>
        <Text style={styles.greetingText}>Hello, {firstName} 👋</Text>
        <Text style={styles.greetingSub}>Here's what's happening today</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
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
  headerRight: { padding: 4 },
  greetingBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  greetingText: { fontSize: 15, fontWeight: '700', color: Colors.darkText },
  greetingSub: { fontSize: 12, color: Colors.secondaryText, marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  feed: { paddingVertical: 8 },
  card: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardHeaderText: { flex: 1, marginLeft: 10 },
  teacherName: { fontSize: 14, fontWeight: 'bold', color: Colors.darkText },
  teacherRole: { fontSize: 12, color: Colors.secondaryText },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timestamp: { fontSize: 11, color: Colors.secondaryText },
  postBody: { fontSize: 14, color: Colors.darkText, lineHeight: 21, marginBottom: 10 },
  photoPlaceholder: {
    height: 180,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 6,
  },
  photoPlaceholderText: { fontSize: 13, color: Colors.secondaryText },
  commentLink: { fontSize: 12, color: Colors.primaryBlue, marginBottom: 8, textAlign: 'right', fontWeight: '500' },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F8',
    borderRadius: 20,
    height: 38,
    paddingHorizontal: 10,
    gap: 8,
  },
  replyInput: { flex: 1, fontSize: 13, color: Colors.darkText },
});
