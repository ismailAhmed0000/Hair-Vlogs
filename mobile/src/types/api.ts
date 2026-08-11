export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export type PhotoAngle = 'front' | 'side' | 'back' | 'other';

export interface Photo {
  id: string;
  haircut_id: string;
  image_url: string;
  angle: PhotoAngle;
  is_cover: boolean;
  uploaded_at: string;
}

export interface Haircut {
  id: string;
  user_id: string;
  title: string;
  date_taken: string;
  notes: string;
  created_at: string;
  photos?: Photo[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface CreateHaircutRequest {
  title: string;
  date_taken: string;
  notes?: string;
}

export interface UpdateHaircutRequest {
  title?: string;
  date_taken?: string;
  notes?: string;
}

export interface CreatePhotoRequest {
  image_url: string;
  angle?: PhotoAngle;
  is_cover?: boolean;
}

export interface UpdatePhotoRequest {
  image_url?: string;
  angle?: PhotoAngle;
  is_cover?: boolean;
}
