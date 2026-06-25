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
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import AvatarCircle from '../../components/AvatarCircle';
import MenuDrawer from '../../components/MenuDrawer';
import {
  listNotifications,
  markAsRead,
  markAllRead,
  Notification,
} from '../../services/notificationsService';
import { useSocket } from '../../context/SocketContext';

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function NotificationsScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { socket, setNotifCount } = useSocket();

  // Live incoming notifications
  useEffect(() => {
    if (!socket) return;
    const handler = (notif: Notification) => {
      setNotifications(prev => [notif, ...prev]);
    };
    socket.on('notification:new', handler);
    // Reset badge while screen is open
    setNotifCount(0);
    return () => { socket.off('notification:new', handler); };
  }, [socket, setNotifCount]);

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await listNotifications();
      setNotifications(res.notifications);
    } catch {
      // leave empty on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(true);
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.hamburger}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBar} onPress={handleMarkAllRead} activeOpacity={0.8}>
          <Text style={styles.markAllText}>Mark all as read ({unreadCount})</Text>
        </TouchableOpacity>
      )}

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, item.isRead ? styles.rowRead : styles.rowUnread]}
              onPress={() => !item.isRead && handleMarkRead(item.id)}
              activeOpacity={item.isRead ? 1 : 0.7}
            >
              <AvatarCircle type="parent" size={40} />
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.rowPreview} numberOfLines={2}>{item.body}</Text>
              </View>
              <View style={styles.rowMeta}>
                <Text style={styles.rowTime}>{formatTime(item.createdAt)}</Text>
                {!item.isRead && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryBlue} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.secondaryText} />
              <Text style={styles.emptyText}>No notifications yet</Text>
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
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: Colors.white },
  headerRight: { width: 28 },
  markAllBar: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
    alignItems: 'flex-end',
  },
  markAllText: { fontSize: 13, color: Colors.primaryBlue, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.secondaryText },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 64,
    gap: 12,
  },
  rowUnread: { backgroundColor: Colors.notificationUnread },
  rowRead: { backgroundColor: Colors.white },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.darkText, lineHeight: 19 },
  rowPreview: { fontSize: 13, color: Colors.secondaryText, marginTop: 2, lineHeight: 18 },
  rowMeta: { alignItems: 'flex-end', gap: 6, paddingTop: 2 },
  rowTime: { fontSize: 11, color: Colors.secondaryText },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryBlue,
  },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderGray },
});
