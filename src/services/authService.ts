import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, TOKEN_KEY, REFRESH_TOKEN_KEY } from './api';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PARENT' | 'STAFF' | 'SCHOOL_ADMIN';
  phone?: string;
  avatar?: string;
  schoolId: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export async function login(email: string, password: string): Promise<User> {
  const data = await api.post<LoginResponse>('/api/auth/login', { email, password });
  await AsyncStorage.setItem(TOKEN_KEY, data.accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  return data.user;
}

export async function logout(): Promise<void> {
  const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } catch {}
  }
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function getMe(): Promise<User | null> {
  try {
    return await api.get<User>('/api/auth/me');
  } catch {
    return null;
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.patch('/api/auth/change-password', { currentPassword, newPassword });
}