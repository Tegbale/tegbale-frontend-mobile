import { api } from './api';

export type UserResult = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
};

export async function searchUsers(q: string): Promise<UserResult[]> {
  if (!q.trim()) return [];
  return api.get<UserResult[]>(`/api/users/search?q=${encodeURIComponent(q.trim())}`);
}
