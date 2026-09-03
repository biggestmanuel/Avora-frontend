import { apiClient } from './client';

export interface AuthUser {
  id: string;
  email: string;
  phone?: string | null;
  name?: string | null;
  photoUrl?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  [key: string]: unknown;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export async function signup(input: {
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResult> {
  const { data } = await apiClient.post<ApiEnvelope<AuthResult>>('/api/auth/signup', input);
  return data.data;
}

export async function login(input: { email: string; password: string }): Promise<AuthResult> {
  const { data } = await apiClient.post<ApiEnvelope<AuthResult>>('/api/auth/login', input);
  return data.data;
}

export async function verifyEmail(input: { userId: string; code: string }): Promise<AuthUser> {
  const { data } = await apiClient.post<ApiEnvelope<AuthUser>>('/api/auth/verify-email', input);
  return data.data;
}

export async function verifyPhone(input: { userId: string; code: string }): Promise<AuthUser> {
  const { data } = await apiClient.post<ApiEnvelope<AuthUser>>('/api/auth/verify-phone', input);
  return data.data;
}

// NOTE: backend has no resend-code endpoint yet (verify-email/verify-phone just
// validate any 6-digit code — no OTP delivery is wired up server-side). Resend
// buttons on the verify screens are UI-only until that exists.

export async function forgotPassword(input: {
  email: string;
}): Promise<{ success: boolean; resetToken?: string }> {
  const { data } = await apiClient.post<ApiEnvelope<{ success: boolean; resetToken?: string }>>(
    '/api/auth/forgot-password',
    input
  );
  return data.data;
}
