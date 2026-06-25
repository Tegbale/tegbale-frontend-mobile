import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import { getConversation, sendMessage, markConversationRead, Message } from '../../services/messagesService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

type UIMessage = {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  dateSeparator?: string;
  pending?: boolean;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h % 12 || 12}:${m}${h >= 12 ? 'pm' : 'am'}`;
}

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toUIMessages(messages: Message[], currentUserId: string): UIMessage[] {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return sorted.map((msg, i) => {
    const prev = sorted[i - 1];
    const thisDay = dayLabel(msg.createdAt);
    const prevDay = prev ? dayLabel(prev.createdAt) : null;
    return {
      id: msg.id,
      text: msg.body,
      sent: msg.senderId === currentUserId,
      time: formatTime(msg.createdAt),
      dateSeparator: thisDay !== prevDay ? thisDay : undefined,
    };
  });
}

export default function ChatScreen({ navigation, route }: Props) {
  const { contact } = route.params;
  const { user } = useAuth();
  const { socket } = useSocket();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const fetchConversation = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getConversation(contact.id);
      setMessages(toUIMessages(res.messages, user.id));
    } catch {
      // leave empty
    } finally {
      setLoading(false);
    }
  }, [contact.id, user]);

  useEffect(() => {
    fetchConversation();
    markConversationRead(contact.id).catch(() => {});
  }, [fetchConversation, contact.id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [messages.length]);

  // Live incoming messages via socket
  useEffect(() => {
    if (!socket || !user) return;

    const handler = (msg: Message) => {
      const isThisConversation =
        (msg.senderId === contact.id && msg.receiverId === user.id) ||
        (msg.senderId === user.id && msg.receiverId === contact.id);
      if (!isThisConversation) return;

      const uiMsg: UIMessage = {
        id: msg.id,
        text: msg.body,
        sent: msg.senderId === user.id,
        time: formatTime(msg.createdAt),
      };
      setMessages(prev => {
        // avoid duplicate if optimistic message already committed it
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, uiMsg];
      });
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
      markConversationRead(contact.id).catch(() => {});
    };

    socket.on('message:new', handler);
    return () => { socket.off('message:new', handler); };
  }, [socket, contact.id, user]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending || !user) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic: UIMessage = {
      id: tempId,
      text,
      sent: true,
      time: formatTime(new Date().toISOString()),
      pending: true,
    };

    setMessages(prev => [...prev, optimistic]);
    setInput('');
    setSending(true);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const sent = await sendMessage(contact.id, text);
      setMessages(prev =>
        prev.map(m =>
          m.id === tempId
            ? { id: sent.id, text: sent.body, sent: true, time: formatTime(sent.createdAt) }
            : m,
        ),
      );
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: UIMessage }) => (
    <>
      {item.dateSeparator && (
        <View style={styles.dateSeparatorWrap}>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>{item.dateSeparator}</Text>
          </View>
        </View>
      )}
      <View style={[styles.bubbleWrap, item.sent ? styles.sentWrap : styles.receivedWrap]}>
        <View style={[styles.bubble, item.sent ? styles.sentBubble : styles.receivedBubble, item.pending && styles.pendingBubble]}>
          <Text style={[styles.bubbleText, item.sent && styles.sentText]}>{item.text}</Text>
        </View>
        <Text style={[styles.bubbleTime, item.sent && styles.sentTime]}>
          {item.time}{item.sent ? (item.pending ? ' ✓' : ' ✓✓') : ''}
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatBg}>
        <View style={styles.sheet}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={Colors.primaryBlue} />
            </TouchableOpacity>
            <Text style={styles.chatTitle}>{contact.name}</Text>
            <View style={styles.infoBtn} />
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={Colors.primaryBlue} />
            </View>
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.flex}
              keyboardVerticalOffset={0}
            >
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageList}
                renderItem={renderItem}
                ListEmptyComponent={
                  <View style={styles.center}>
                    <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
                  </View>
                }
              />

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.inputField}
                  placeholder="Type a message"
                  placeholderTextColor={Colors.placeholderText}
                  value={input}
                  onChangeText={setInput}
                  multiline
                  onSubmitEditing={handleSend}
                />
                <TouchableOpacity
                  style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
                  onPress={handleSend}
                  disabled={!input.trim() || sending}
                >
                  <Ionicons name="send" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryBlue },
  chatBg: { flex: 1, backgroundColor: Colors.primaryBlue },
  flex: { flex: 1 },
  sheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 4,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  backBtn: { padding: 4 },
  chatTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: Colors.darkText },
  infoBtn: { width: 30 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 14, color: Colors.secondaryText },
  messageList: { paddingHorizontal: 12, paddingVertical: 16, flexGrow: 1 },
  dateSeparatorWrap: { alignItems: 'center', marginVertical: 10 },
  datePill: {
    backgroundColor: Colors.chatDatePill,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  datePillText: { color: Colors.white, fontSize: 13 },
  bubbleWrap: { marginVertical: 2 },
  sentWrap: { alignItems: 'flex-end' },
  receivedWrap: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '72%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sentBubble: { backgroundColor: Colors.sentBubble, borderBottomRightRadius: 4 },
  receivedBubble: { backgroundColor: Colors.receivedBubble, borderBottomLeftRadius: 4 },
  pendingBubble: { opacity: 0.6 },
  bubbleText: { fontSize: 14, color: Colors.darkText },
  sentText: { color: Colors.white },
  bubbleTime: { fontSize: 11, color: Colors.secondaryText, marginTop: 2, marginHorizontal: 4 },
  sentTime: { color: Colors.secondaryText },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGray,
  },
  inputField: {
    flex: 1,
    backgroundColor: Colors.replyBarBg,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.darkText,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
