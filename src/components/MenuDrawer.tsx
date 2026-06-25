import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 290;
const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
};

type MenuItem = {
  icon: string;
  label: string;
  screen?: string;
  danger?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: 'person-outline', label: 'My Profile', screen: 'Profile' },
  { icon: 'calendar-outline', label: 'Events', screen: 'Events' },
  { icon: 'settings-outline', label: 'Settings', screen: 'Settings' },
];

function InitialsAvatar({ name, role }: { name: string; role: string }) {
  const parts = name.trim().split(' ');
  const initials = parts.length >= 2
    ? parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
    : name.slice(0, 2).toUpperCase();

  return (
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarInitials}>{initials}</Text>
    </View>
  );
}

export default function MenuDrawer({ visible, onClose, onNavigate }: Props) {
  const { user, logout } = useAuth();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleNavigate = (screen: string) => {
    onClose();
    setTimeout(() => onNavigate?.(screen), 250);
  };

  const handleLogout = async () => {
    onClose();
    setTimeout(() => logout(), 300);
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const roleLabel = user?.role === 'PARENT' ? 'Parent' : user?.role === 'STAFF' ? 'Teacher' : 'Admin';
  const email = user?.email ?? '';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Dim overlay */}
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.drawerHeaderPattern} />
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
            <InitialsAvatar name={fullName} role={user?.role ?? ''} />
            <Text style={styles.drawerName}>{fullName}</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{roleLabel}</Text>
            </View>
            <Text style={styles.drawerEmail} numberOfLines={1}>{email}</Text>
          </View>

          {/* Menu items */}
          <View style={styles.menuSection}>
            {MENU_ITEMS.map((item, i) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => item.screen && handleNavigate(item.screen)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon as any} size={20} color={Colors.primaryBlue} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.borderGray} />
                </TouchableOpacity>
                {i < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
              </React.Fragment>
            ))}
          </View>

          {/* Bottom: logout */}
          <View style={styles.drawerFooter}>
            <View style={styles.footerDivider} />
            <TouchableOpacity style={styles.logoutRow} onPress={handleLogout} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, styles.logoutIconWrap]}>
                <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
              </View>
              <Text style={styles.logoutLabel}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,20,40,0.55)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 16,
  },
  drawerHeader: {
    backgroundColor: '#1B3F72',
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  drawerHeaderPattern: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
    marginBottom: 12,
  },
  avatarInitials: { fontSize: 26, fontWeight: '800', color: Colors.white, letterSpacing: 1 },
  drawerName: { fontSize: 17, fontWeight: '700', color: Colors.white, marginBottom: 6 },
  roleTag: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  roleTagText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.95)' },
  drawerEmail: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  menuSection: { paddingTop: 12, paddingHorizontal: 12 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: Colors.primaryBlue + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.darkText },
  menuDivider: { height: 1, backgroundColor: '#F0F2F5', marginHorizontal: 8 },
  drawerFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 28 },
  footerDivider: { height: 1, backgroundColor: '#EDEFF2', marginHorizontal: 20, marginBottom: 8 },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 12,
  },
  logoutIconWrap: { backgroundColor: '#E74C3C12' },
  logoutLabel: { fontSize: 15, fontWeight: '500', color: '#E74C3C', flex: 1 },
});
