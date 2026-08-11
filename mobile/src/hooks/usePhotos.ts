import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as photosApi from '../api/photos';
import { haircutKeys } from './useHaircuts';
import type { CreatePhotoRequest, UpdatePhotoRequest } from '../types/api';

export const photoKeys = {
  forHaircut: (haircutId: string) => ['haircuts', haircutId, 'photos'] as const,
};

export function usePhotos(haircutId: string) {
  return useQuery({
    queryKey: photoKeys.forHaircut(haircutId),
    queryFn: () => photosApi.listPhotos(haircutId),
    enabled: !!haircutId,
  });
}

export function useCreatePhoto(haircutId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePhotoRequest) =>
      photosApi.createPhoto(haircutId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: photoKeys.forHaircut(haircutId),
      });
      queryClient.invalidateQueries({
        queryKey: haircutKeys.detail(haircutId),
      });
    },
  });
}

export function useUpdatePhoto(haircutId: string, photoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePhotoRequest) =>
      photosApi.updatePhoto(photoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: photoKeys.forHaircut(haircutId),
      });
      queryClient.invalidateQueries({
        queryKey: haircutKeys.detail(haircutId),
      });
    },
  });
}

export function useDeletePhoto(haircutId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => photosApi.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: photoKeys.forHaircut(haircutId),
      });
      queryClient.invalidateQueries({
        queryKey: haircutKeys.detail(haircutId),
      });
    },
  });
}

export function useSetCoverPhoto(haircutId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => photosApi.setCoverPhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: photoKeys.forHaircut(haircutId),
      });
      queryClient.invalidateQueries({
        queryKey: haircutKeys.detail(haircutId),
      });
    },
  });
}
