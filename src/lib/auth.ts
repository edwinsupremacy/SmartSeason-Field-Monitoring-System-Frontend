import api from './api';
import { AuthResponse, LoginRequest } from '../types/api';

interface RegisterRequest extends LoginRequest {
  userName: string;
  firstName: string;
  secondName: string;
  phoneNumber: string;
  confirmPassword: string;
}

export const loginAdmin = async (payload: LoginRequest) => {
  const response = await api.post<AuthResponse>('/auth/login/admin', {
    UserName: '',
    Email: payload.email,
    Password: payload.password,
  });
  const data = response.data;
  saveSession(data.token, data.role, {
    firstName: data.FirstName,
    secondName: data.SecondName,
    email: data.Email,
    userName: data.UserName,
    phoneNumber: data.PhoneNumber,
  });
  return data;
};

export const loginFieldAgent = async (payload: LoginRequest) => {
  const response = await api.post<AuthResponse>('/auth/login/field-agent', {
    UserName: '',
    Email: payload.email,
    Password: payload.password,
  });
  const data = response.data;
  saveSession(data.token, data.role, {
    firstName: data.FirstName,
    secondName: data.SecondName,
    email: data.Email,
    userName: data.UserName,
    phoneNumber: data.PhoneNumber,
  });
  return data;
};

export const registerAdmin = async (payload: RegisterRequest) => {
  const response = await api.post<AuthResponse>('/auth/register/admin', {
    UserName: payload.userName,
    FirstName: payload.firstName,
    SecondName: payload.secondName,
    Email: payload.email,
    PhoneNumber: payload.phoneNumber,
    Password: payload.password,
    ConfirmPassword: payload.confirmPassword,
  });
  const data = response.data;
  saveSession(data.token, data.role, {
    firstName: data.FirstName,
    secondName: data.SecondName,
    email: data.Email,
    userName: data.UserName,
    phoneNumber: data.PhoneNumber,
  });
  return data;
};

export const registerFieldAgent = async (payload: RegisterRequest) => {
  const response = await api.post<AuthResponse>('/auth/register/field-agent', {
    UserName: payload.userName,
    FirstName: payload.firstName,
    SecondName: payload.secondName,
    Email: payload.email,
    PhoneNumber: payload.phoneNumber,
    Password: payload.password,
    ConfirmPassword: payload.confirmPassword,
  });
  const data = response.data;
  saveSession(data.token, data.role, {
    firstName: data.FirstName,
    secondName: data.SecondName,
    email: data.Email,
    userName: data.UserName,
    phoneNumber: data.PhoneNumber,
  });
  return data;
};

export const saveSession = (token: string, role: string, user: { firstName: string; secondName: string; email: string; userName: string; phoneNumber: string }) => {
  localStorage.setItem('smartseason_token', token);
  localStorage.setItem('smartseason_role', role);
  localStorage.setItem('smartseason_user', JSON.stringify(user));
};

export const getUser = () => {
  const userStr = localStorage.getItem('smartseason_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const clearSession = () => {
  localStorage.removeItem('smartseason_token');
  localStorage.removeItem('smartseason_role');
  localStorage.removeItem('smartseason_user');
};

export const getRole = () => localStorage.getItem('smartseason_role') as 'Admin' | 'FieldAgent' | null;

export const fetchCurrentUser = async () => {
  const response = await api.get<AuthResponse>('/auth/me');
  return response.data;
};
