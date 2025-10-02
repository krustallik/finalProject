import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.239:3000';

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
