import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

type AvatarType = 'teacher' | 'parent' | 'student-boy' | 'student-girl' | 'contact';

type Props = {
  type: AvatarType;
  size?: number;
  initials?: string;
};

const AVATAR_CONFIG: Record<AvatarType, { bg: string; emoji: string }> = {
  teacher:      { bg: '#F4C430', emoji: '👩‍🏫' },
  parent:       { bg: Colors.green,  emoji: '👨‍👩‍👧' },
  'student-boy': { bg: '#FFD580', emoji: '👦' },
  'student-girl':{ bg: '#FFBBA0', emoji: '👧' },
  contact:      { bg: '#B0BEC5', emoji: '🧑‍💼' },
};

export default function AvatarCircle({ type, size = 40, initials }: Props) {
  const config = AVATAR_CONFIG[type];
  const fontSize = size * 0.45;

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: config.bg }]}>
      {initials ? (
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
      ) : (
        <Text style={{ fontSize }}>{config.emoji}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});
