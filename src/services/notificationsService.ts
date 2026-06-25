import { api } from './api';

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: string | null;
  isRead: boolean;
  userId: string;
  createdAt: string;
};

type NotificationsResponse = { notifications: Notification[]; total: number };

export async function listNotifications(page = 1, limit = 30): Promise<NotificationsResponse> {
  return api.get<NotificationsResponse>(`/api/notifications?page=${page}&limit=${limit}`);
}

export async function markAsRead(id: string): Promise<Notification> {
  return api.patch<Notification>(`/api/notifications/${id}/read`, {});
}

export async function markAllRead(): Promise<void> {
  return api.patch<void>('/api/notifications/read-all', {});
}
