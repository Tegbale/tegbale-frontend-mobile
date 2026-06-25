import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import AvatarCircle from './AvatarCircle';
import { StudentData } from '../navigation/types';

type Props = {
  student: StudentData;
  onPress?: () => void;
};

export default function StudentCard({ student, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <AvatarCircle type={student.avatarType === 'boy' ? 'student-boy' : 'student-girl'} size={60} />
      <Text style={styles.name} numberOfLines={1}>{student.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.85,
    borderWidth: 1.5,
    borderColor: Colors.primaryBlue,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  name: {
    fontSize: 13,
    color: Colors.darkText,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
