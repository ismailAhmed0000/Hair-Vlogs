import { apiFetch } from '../lib/apiClient';
import type {
  CreateHaircutRequest,
  Haircut,
  UpdateHaircutRequest,
} from '../types/api';

export function listHaircuts() {
  return apiFetch<Haircut[]>('/haircuts');
}

export function getHaircut(id: string) {
  return apiFetch<Haircut>(`/haircuts/${id}`);
}

export function createHaircut(payload: CreateHaircutRequest) {
  return apiFetch<Haircut>('/haircuts', { method: 'POST', body: payload });
}

export function updateHaircut(id: string, payload: UpdateHaircutRequest) {
  return apiFetch<Haircut>(`/haircuts/${id}`, { method: 'PUT', body: payload });
}

export function deleteHaircut(id: string) {
  return apiFetch<void>(`/haircuts/${id}`, { method: 'DELETE' });
}
