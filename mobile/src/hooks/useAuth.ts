import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest } from '../types/api';
import * as authApi from '../api/auth';

export function useRegister() {
  const setAuth = useAuthStore(state => state.setAuth);
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: data => setAuth(data.token, data.user),
  });
}

export function useLogin() {
  const setAuth = useAuthStore(state => state.setAuth);
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: data => setAuth(data.token, data.user),
  });
}
