import { useQuery } from '@tanstack/react-query';
import * as usersApi from '../api/users';

export const userKeys = {
  me: ['users', 'me'] as const,
};

export function useMe() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: usersApi.getMe,
  });
}
