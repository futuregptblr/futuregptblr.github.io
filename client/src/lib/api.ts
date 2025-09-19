import { API_BASE_URL } from './utils';

function authHeaders(token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

type RegisterPayload = { name: string; email: string; password: string };
type LoginPayload = { email: string; password: string };

export async function apiRegister(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Registration failed');
  }
  return res.json();
}

export async function apiLogin(payload: LoginPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Login failed');
  }
  return res.json();
}

export async function apiAdminLogin(payload: LoginPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Admin login failed');
  }
  return res.json();
}

// Admin: Cloudinary sign
export async function apiCloudinarySign(token: string, body: { folder?: string; public_id?: string; eager?: string; invalidate?: boolean }) {
  const res = await fetch(`${API_BASE_URL}/api/cloudinary/sign`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to sign upload');
  }
  return res.json();
}

// Team
import type { TeamMember } from '../types';

export async function apiGetTeam(): Promise<TeamMember[]> {
  const res = await fetch(`${API_BASE_URL}/api/team`);
  if (!res.ok) throw new Error('Failed to load team');
  return res.json();
}

export async function apiCreateTeamMember(token: string, payload: Partial<TeamMember> & { image: string }): Promise<TeamMember> {
  const res = await fetch(`${API_BASE_URL}/api/team`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create');
  }
  return res.json();
}

export async function apiUpdateTeamMember(token: string, id: string, payload: Partial<TeamMember>): Promise<TeamMember> {
  const res = await fetch(`${API_BASE_URL}/api/team/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to update');
  }
  return res.json();
}

export async function apiDeleteTeamMember(token: string, id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/api/team/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to delete');
  }
  return res.json();
}

