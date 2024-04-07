import axios, { AxiosRequestConfig } from 'axios';
import { CreateUserParams, UserCredentialsParams } from './types';

const API_URL = import.meta.env.VITE_BASE_URL;

const axiosClient = axios.create({ baseURL: API_URL });
const config: AxiosRequestConfig = { withCredentials: true };

export const checkUsernameExists = (username: string) =>
  axiosClient.get(`/users/check?username=${username}`, config);

export const postRegisterUser = (data: CreateUserParams) =>
  axiosClient.post(`/auth/register`, data, config);

export const postLoginUser = (data: UserCredentialsParams) =>
  axiosClient.post(`/auth/login`, data, config);