import axios from 'axios';
import router from '../router';
import AuthService from './auth';

const API_ENVS = {
  production: '',
  development: '',
  local: 'http://localhost:3000',
};

const httpClient = axios.create({
  baseURL: API_ENVS.local,
});

httpClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token');

  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`; // eslint-disable-line no-param-reassign
  }

  return config;
});

httpClient.interceptors.response.use((response) => response, (error) => {
  const conThrowAnError = error.request.status === 0 || error.request.status === 500;

  if (conThrowAnError) {
    throw new Error(error.message);
  }

  if (error.response.status === 401) {
    router.push({ name: 'Home' });
  }

  return error;
});

export default {
  auth: AuthService(httpClient),
};
