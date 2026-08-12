import { API_BASE_URL, API_ORIGIN } from '../lib/config';
import { useAuthStore } from '../store/authStore';

interface UploadFile {
  uri: string;
  name?: string;
  type?: string;
}

export async function uploadImage(file: UploadFile): Promise<string> {
  const token = useAuthStore.getState().token;

  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name ?? 'photo.jpg',
    type: file.type ?? 'image/jpeg',
  } as unknown as Blob);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? 'Failed to upload image');
  }

  return `${API_ORIGIN}${data.url}`;
}
