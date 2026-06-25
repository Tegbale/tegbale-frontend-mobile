import { api } from './api';

export type Ward = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  classroom: {
    id: string;
    name: string;
  } | null;
};

type WardsResponse = { wards: Ward[]; total: number };

export async function listWards(): Promise<WardsResponse> {
  return api.get<WardsResponse>('/api/parents/me/wards');
}
