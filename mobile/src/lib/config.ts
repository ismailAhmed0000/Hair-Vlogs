import { Platform } from 'react-native';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_ORIGIN = `http://${HOST}:8080`;
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
