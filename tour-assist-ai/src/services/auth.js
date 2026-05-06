import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from './api';

function normalizeUser(user) {
  return {
    id: user.id,
    name: user.fullName,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function persistSession({ user, token }) {
  const normalizedUser = normalizeUser(user);

  await AsyncStorage.multiSet([
    ['@user_name', normalizedUser.name || 'Voyageur'],
    ['@user_data', JSON.stringify(normalizedUser)],
    ['@user_session', JSON.stringify({ token, user: normalizedUser })],
  ]);

  return normalizedUser;
}

export async function loginUser({ email, password }) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const user = await persistSession(response.data);
  return { user, token: response.data.token };
}

export async function registerUser({ fullName, email, password }) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });

  return response.data;
}

export async function verifyEmailCode({ email, code }) {
  const response = await apiRequest('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });

  const user = await persistSession(response.data);
  return { user, token: response.data.token };
}

export async function resendVerificationCode({ email }) {
  const response = await apiRequest('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  return response.data;
}

export async function requestPasswordReset({ email }) {
  const response = await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  return response.data;
}

export async function verifyPasswordResetCode({ email, code }) {
  const response = await apiRequest('/auth/verify-password-reset-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });

  return response.data;
}

export async function resetPassword({ resetToken, newPassword }) {
  const response = await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword }),
  });

  return response.data;
}
