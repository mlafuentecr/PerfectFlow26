import axios from 'axios';
import { Platform } from 'react-native';

const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';

const api = axios.create({
  baseURL,
  adapter: 'xhr',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
