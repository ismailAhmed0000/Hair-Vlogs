import { apiFetch } from '../lib/apiClient';
import type {
  CreatePhotoRequest,
  Photo,
  UpdatePhotoRequest,
} from '../types/api';

export function listPhotos(haircutId: string) {
  return apiFetch<Photo[]>(`/haircuts/${haircutId}/photos`);
}

export function createPhoto(haircutId: string, payload: CreatePhotoRequest) {
  return apiFetch<Photo>(`/haircuts/${haircutId}/photos`, {
    method: 'POST',
    body: payload,
  });
}

export function getPhoto(id: string) {
  return apiFetch<Photo>(`/photos/${id}`);
}

export function updatePhoto(id: string, payload: UpdatePhotoRequest) {
  return apiFetch<Photo>(`/photos/${id}`, { method: 'PUT', body: payload });
}

export function deletePhoto(id: string) {
  return apiFetch<void>(`/photos/${id}`, { method: 'DELETE' });
}

export function setCoverPhoto(id: string) {
  return apiFetch<Photo>(`/photos/${id}/cover`, { method: 'PATCH' });
}
