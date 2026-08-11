import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as haircutsApi from '../api/haircuts';
import { CreateHaircutRequest, UpdateHaircutRequest } from '../types/api';

export const haircutKeys = {
  all: ['haircuts'] as const,
  detail: (id: string) => ['haircuts', id] as const,
};

export function useHaircuts() {
  return useQuery({
    queryKey: haircutKeys.all,
    queryFn: haircutsApi.listHaircuts,
  });
}

export function useHaircut(id: string) {
  return useQuery({
    queryKey: haircutKeys.detail(id),
    queryFn: () => haircutsApi.getHaircut(id),
    enabled: !!id,
  });
}

export function useCreateHaircut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHaircutRequest) =>
      haircutsApi.createHaircut(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: haircutKeys.all }),
  });
}
export function useUpdateHaircut(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateHaircutRequest) =>
      haircutsApi.updateHaircut(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircutKeys.all });
      queryClient.invalidateQueries({ queryKey: haircutKeys.detail(id) });
    },
  });
}

export function useDeleteHaircut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => haircutsApi.deleteHaircut(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: haircutKeys.all }),
  });
}
