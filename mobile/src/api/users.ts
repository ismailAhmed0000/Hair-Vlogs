import { apiFetch } from '../lib/apiClient';
import type { UpdateUserRequest, User } from '../types/api';

export function getMe() {
  return apiFetch<User>('/users/me');
}

export function updateMe(payload: UpdateUserRequest) {
  return apiFetch<User>('/users/me', { method: 'PUT', body: payload });
}

export function deleteMe() {
  return apiFetch<void>('/users/me', { method: 'DELETE' });
}
