import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

type Props = { size?: number };

export default function AppLogo({ size = 80 }: Props) {
  const fontSize = size * 0.45;
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.letter, { fontSize }]}>T</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});
