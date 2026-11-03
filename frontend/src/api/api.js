import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android Emulator reaches the host machine through 10.0.2.2.
// Override with EXPO_PUBLIC_API_URL for a physical device or another environment.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';
if (!__DEV__ && !/^https:\/\//i.test(BASE_URL)) {
    throw new Error('Release builds require an HTTPS API URL.');
}


/**
 * Axios instance для роботи з бекендом.
 */
export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
});

/**
 * Request interceptor:
 * - перед кожним запитом дістає токен із AsyncStorage
 * - додає його у заголовок `Authorization: Bearer ...`
 */
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
