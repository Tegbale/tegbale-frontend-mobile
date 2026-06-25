import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  logoName: { fontSize: 24, fontWeight: 'bold', color: Colors.primaryBlue },
  screenTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.white },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.darkText },
  sectionHeading: { fontSize: 16, fontWeight: 'bold', color: Colors.darkText },
  body: { fontSize: 14, color: Colors.darkText },
  secondary: { fontSize: 13, color: Colors.secondaryText },
  timestamp: { fontSize: 11, color: Colors.secondaryText },
  link: { fontSize: 13, color: Colors.linkText, textDecorationLine: 'underline' },
  buttonLabel: { fontSize: 16, fontWeight: '600', color: Colors.white },
  tabLabel: { fontSize: 10 },
  heading22: { fontSize: 22, fontWeight: 'bold', color: Colors.darkText },
  name15: { fontSize: 15, fontWeight: 'bold', color: Colors.darkText },
  sub12: { fontSize: 12, color: Colors.secondaryText },
});
