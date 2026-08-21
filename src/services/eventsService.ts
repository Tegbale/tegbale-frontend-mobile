import { api } from './api';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export type SchoolEvent = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  status: EventStatus;
  schoolId: string;
};

type EventsResponse = { events: SchoolEvent[]; total: number };

export async function listEvents(page = 1, limit = 20, status?: EventStatus): Promise<EventsResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) params.append('status', status);
  return api.get<EventsResponse>(`/v1/events?${params.toString()}`);
}

export async function getEvent(id: string): Promise<SchoolEvent> {
  return api.get<SchoolEvent>(`/v1/events/${id}`);
}
