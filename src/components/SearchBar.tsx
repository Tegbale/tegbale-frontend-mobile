import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

type Props = {
  placeholder?: string;
  style?: ViewStyle;
};

export default function SearchBar({ placeholder = 'Search', style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholderText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
    color: Colors.secondaryText,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.darkText,
  },
});
