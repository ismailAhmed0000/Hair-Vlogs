import { apiFetch } from '../lib/apiClient';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';

export function register(payload: RegisterRequest) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export function login(payload: LoginRequest) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
    auth: false,
  });
}
