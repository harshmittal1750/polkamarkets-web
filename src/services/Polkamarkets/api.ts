import axios, { AxiosError, AxiosResponse } from 'axios';

import { onResponse, onError } from './interceptors';

const api = axios.create();

api.interceptors.response.use(
  (response: AxiosResponse) => onResponse(response),
  (error: AxiosError) => onError(error)
);

export default api;

const REACT_APP_POLKAMARKETS_API_URL = 'http://localhost:4000';

export { REACT_APP_POLKAMARKETS_API_URL as polkamarketsApiUrl };
