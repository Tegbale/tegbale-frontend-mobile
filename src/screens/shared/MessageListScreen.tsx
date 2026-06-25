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
import { Colors } from '../../theme/colors';
import SearchBar from '../../components/SearchBar';
import AvatarCircle from '../../components/AvatarCircle';
import MenuDrawer from '../../components/MenuDrawer';
import { RootStackParamList } from '../../navigation/types';
import { listMessages, Message, MessageUser } from '../../services/messagesService';
import { useAuth } from '../../context/AuthContext';

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  latestAt: number;
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    const h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, '0');
    return `Today ${h % 12 || 12}:${m}${h >= 12 ? 'pm' : 'am'}`;
  }
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function buildConversations(messages: Message[], currentUserId: string): Conversation[] {
  const map = new Map<string, { partner: MessageUser; msgs: Message[]; latestAt: number }>();

  for (const msg of messages) {
    const partner: MessageUser = msg.senderId === currentUserId ? msg.receiver : msg.sender;
    const time = new Date(msg.createdAt).getTime();
    if (!map.has(partner.id)) {
      map.set(partner.id, { partner, msgs: [], latestAt: 0 });
    }
    const entry = map.get(partner.id)!;
    entry.msgs.push(msg);
    if (time > entry.latestAt) entry.latestAt = time;
  }

  return Array.from(map.values())
    .sort((a, b) => b.latestAt - a.latestAt)
    .map(({ partner, msgs, latestAt }) => {
      const latest = [...msgs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
      const unread = msgs.filter(m => m.senderId !== currentUserId && m.status !== 'READ').length;
      return {
        id: partner.id,
        name: `${partner.firstName} ${partner.lastName}`,
        lastMessage: latest.body,
        time: formatTime(latest.createdAt),
        unreadCount: unread,
        latestAt,
      };
    });
}

export default function MessageListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMessages = useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    try {
      const res = await listMessages(1, 100);
      setConversations(buildConversations(res.messages, user.id));
    } catch {
      // leave empty on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.hamburger}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerRight} />
      </View>

      <SearchBar placeholder="Search messages" />

      <TouchableOpacity
        style={styles.newMessageBtn}
        onPress={() => navigation.navigate('CreateMessage')}
        activeOpacity={0.85}
      >
        <View style={styles.newMessageIcon}>
          <Text style={styles.newMessagePlus}>+</Text>
        </View>
        <Text style={styles.newMessageText}>Write new message</Text>
      </TouchableOpacity>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.convoRow}
              onPress={() => navigation.navigate('Chat', { contact: { id: item.id, name: item.name } })}
              activeOpacity={0.8}
            >
              <AvatarCircle type="contact" size={44} />
              <View style={styles.convoContent}>
                <Text style={styles.convoName}>{item.name}</Text>
                <Text style={styles.convoPreview} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              <View style={styles.convoMeta}>
                <Text style={styles.convoTime}>{item.time}</Text>
                {item.unreadCount > 0 ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                  </View>
                ) : (
                  <Text style={styles.readTick}>✓✓</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryBlue} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No messages yet</Text>
            </View>
          }
        />
      )}

      <MenuDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} />
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
  hamburgerIcon: { fontSize: 20, color: Colors.white },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: Colors.white },
  headerRight: { width: 28 },
  newMessageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBlue,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    gap: 10,
  },
  newMessageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newMessagePlus: { fontSize: 20, color: Colors.primaryBlue, fontWeight: 'bold', lineHeight: 24 },
  newMessageText: { fontSize: 15, fontWeight: '600', color: Colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: Colors.secondaryText },
  convoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    minHeight: 60,
  },
  convoContent: { flex: 1 },
  convoName: { fontSize: 15, fontWeight: 'bold', color: Colors.darkText },
  convoPreview: { fontSize: 13, color: Colors.secondaryText, marginTop: 2 },
  convoMeta: { alignItems: 'flex-end', gap: 4 },
  convoTime: { fontSize: 11, color: Colors.secondaryText },
  unreadBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: { fontSize: 11, fontWeight: 'bold', color: Colors.white },
  readTick: { fontSize: 12, color: Colors.primaryBlue },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderGray, marginLeft: 72 },
});
