import { api } from './api';

export type MessageUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export type Message = {
  id: string;
  body: string;
  subject?: string;
  senderId: string;
  receiverId: string;
  sender: MessageUser;
  receiver: MessageUser;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
};

type MessagesResponse = { messages: Message[]; total: number };

export async function listMessages(page = 1, limit = 100): Promise<MessagesResponse> {
  return api.get<MessagesResponse>(`/api/messages?page=${page}&limit=${limit}&type=all`);
}

export async function getConversation(partnerId: string, limit = 100): Promise<MessagesResponse> {
  return api.get<MessagesResponse>(`/api/messages?partnerId=${partnerId}&limit=${limit}`);
}

export async function markConversationRead(partnerId: string): Promise<void> {
  return api.patch<void>('/api/messages/read-conversation', { partnerId });
}

export async function sendMessage(receiverId: string, body: string): Promise<Message> {
  return api.post<Message>('/api/messages', { receiverId, body });
}

export async function getMessage(id: string): Promise<Message> {
  return api.get<Message>(`/api/messages/${id}`);
}
