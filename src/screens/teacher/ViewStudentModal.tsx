import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';
import AvatarCircle from '../../components/AvatarCircle';
import { getClassroomTeachers, ClassroomTeacher } from '../../services/classroomsService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ViewStudent'>;
  route: RouteProp<RootStackParamList, 'ViewStudent'>;
};

type TabKey = 'comments' | 'teachers';

const MOCK_COMMENTS = [
  {
    id: '1',
    teacher: 'Sade (Teacher)',
    time: 'Today 14:20pm',
    text: 'Great participation in class today. Keep it up!',
    commentCount: 1,
    photo: false,
  },
  {
    id: '2',
    teacher: 'Jerry Oriyomi (Teacher)',
    time: 'Yesterday 10:00am',
    text: 'Excellent work on the group project.',
    commentCount: 4,
    photo: true,
  },
];

export default function ViewStudentModal({ navigation, route }: Props) {
  const { student } = route.params;
  const [activeTab, setActiveTab] = useState<TabKey>('teachers');
  const [replyText, setReplyText] = useState('');
  const [teachers, setTeachers] = useState<ClassroomTeacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  useEffect(() => {
    if (!student.classroomId) return;
    setLoadingTeachers(true);
    getClassroomTeachers(student.classroomId)
      .then(setTeachers)
      .catch(() => {})
      .finally(() => setLoadingTeachers(false));
  }, [student.classroomId]);

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.sheet}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        <AvatarCircle
          type={student.avatarType === 'boy' ? 'student-boy' : 'student-girl'}
          size={70}
        />
        <Text style={styles.studentName}>{student.firstName} {student.name.split(' ')[1] ?? ''}</Text>
        <Text style={styles.classroomLabel}>{student.classroom} Student</Text>

        <View style={styles.tabRow}>
          {(['comments', 'teachers'] as TabKey[]).map(tab => (
            <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'teachers' ? (
            loadingTeachers ? (
              <ActivityIndicator size="large" color={Colors.primaryBlue} style={{ marginTop: 32 }} />
            ) : teachers.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>No teachers assigned to this classroom yet.</Text>
              </View>
            ) : (
              teachers.map(t => (
                <View key={t.id} style={styles.teacherRow}>
                  <AvatarCircle type="teacher" size={40} />
                  <View style={styles.teacherInfo}>
                    <Text style={styles.teacherName}>{t.user.firstName} {t.user.lastName}</Text>
                    <Text style={styles.teacherClassroom}>{student.classroom}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Chat', {
                      contact: { id: t.user.id, name: `${t.user.firstName} ${t.user.lastName}` },
                    })}
                  >
                    <Ionicons name="chatbubble-outline" size={22} color={Colors.primaryBlue} />
                  </TouchableOpacity>
                </View>
              ))
            )
          ) : (
            MOCK_COMMENTS.map(comment => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <AvatarCircle type="teacher" size={36} />
                  <Text style={styles.commentTeacher}>{comment.teacher}</Text>
                  <Text style={styles.commentTime}>🕐 {comment.time}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
                {comment.photo && (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoText}>📷 Class Photo</Text>
                  </View>
                )}
                <TouchableOpacity>
                  <Text style={styles.commentLink}>{comment.commentCount} Comment{comment.commentCount !== 1 ? 's' : ''} (View all)</Text>
                </TouchableOpacity>
                <View style={styles.replyBar}>
                  <TextInput
                    style={styles.replyInput}
                    placeholder="Reply comment"
                    placeholderTextColor={Colors.placeholderText}
                    value={replyText}
                    onChangeText={setReplyText}
                  />
                  <TouchableOpacity>
                    <Text style={styles.sendIcon}>✈️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0, top: '8%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  closeBtn: { position: 'absolute', top: 16, left: 16, padding: 4 },
  closeText: { fontSize: 18, color: Colors.primaryBlue },
  studentName: { fontSize: 16, fontWeight: 'bold', color: Colors.darkText, marginTop: 10 },
  classroomLabel: { fontSize: 13, color: Colors.secondaryText, marginBottom: 12 },
  tabRow: { flexDirection: 'row', width: '100%', borderBottomWidth: 1, borderBottomColor: Colors.borderGray },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabText: { fontSize: 14, color: Colors.secondaryText },
  tabTextActive: { color: Colors.primaryBlue, fontWeight: 'bold' },
  tabUnderline: { position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 2, backgroundColor: Colors.primaryBlue },
  content: { width: '100%', paddingHorizontal: 16 },
  emptyWrap: { alignItems: 'center', paddingTop: 32 },
  emptyText: { fontSize: 14, color: Colors.secondaryText },
  teacherRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.primaryBlue, borderRadius: 12, padding: 12, marginTop: 10, gap: 12 },
  teacherInfo: { flex: 1 },
  teacherName: { fontSize: 15, fontWeight: 'bold', color: Colors.darkText },
  teacherClassroom: { fontSize: 12, color: Colors.secondaryText },
  commentCard: { backgroundColor: Colors.cardBg, borderRadius: 10, padding: 12, marginTop: 12 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  commentTeacher: { flex: 1, fontSize: 14, fontWeight: 'bold', color: Colors.darkText },
  commentTime: { fontSize: 11, color: Colors.secondaryText },
  commentText: { fontSize: 14, color: Colors.darkText, lineHeight: 20, marginBottom: 8 },
  photoPlaceholder: { height: 160, backgroundColor: Colors.borderGray, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  photoText: { fontSize: 14, color: Colors.secondaryText },
  commentLink: { fontSize: 12, color: Colors.primaryBlue, marginBottom: 8 },
  replyBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.replyBarBg, borderRadius: 18, height: 36, paddingHorizontal: 12, gap: 8 },
  replyInput: { flex: 1, fontSize: 13, color: Colors.darkText },
  sendIcon: { fontSize: 14 },
});
