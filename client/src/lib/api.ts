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

// Events
export type EventDto = {
  _id: string;
  title: string;
  description?: string;
  date: string; // ISO
  startTime?: string;
  endTime?: string;
  location: string;
  chapter?: string;
  type?: string;
  capacity?: number;
  isPremium?: boolean;
  price?: number;
  image?: string;
  speakers?: string[];
  tags?: string[];
  registrationsCount?: number;
};

export async function apiListEvents(scope: 'upcoming' | 'past' | 'all' = 'upcoming'): Promise<EventDto[]> {
  const params = new URLSearchParams();
  if (scope && scope !== 'all') params.set('scope', scope);
  const res = await fetch(`${API_BASE_URL}/api/events?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load events');
  return res.json();
}

export async function apiAdminListAllEvents(token: string): Promise<EventDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/events/admin/all`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to load all events');
  return res.json();
}

export async function apiRegisterForEvent(eventId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Registration failed');
  }
  return res.json();
}

export async function apiListMyEventRegistrations(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/events/me/registrations`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to load registrations');
  }
  return res.json();
}

export async function apiCreateEvent(token: string, payload: Partial<EventDto>) {
  const res = await fetch(`${API_BASE_URL}/api/events`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create event');
  }
  return res.json();
}

export async function apiGetStats(): Promise<{ users: number; premiumUsers: number; jobs: number; upcomingEvents: number; teamMembers: number; waitlist: number; }> {
  const res = await fetch(`${API_BASE_URL}/api/stats`);
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}

export type ActivityItem = {
  type: 'event' | 'job' | 'discussion' | 'user';
  title: string;
  description: string;
  createdAt: string;
  meta?: Record<string, any>;
};

export async function apiGetRecentActivity(): Promise<ActivityItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/stats/recent`);
  if (!res.ok) throw new Error('Failed to load activity');
  return res.json();
}

// Community
export type DiscussionDto = {
  _id: string;
  title: string;
  content: string;
  authorName?: string;
  category?: string;
  tags?: string[];
  replies?: number;
  likes?: number;
  isPinned?: boolean;
  createdAt?: string;
  comments?: { authorName?: string; content: string; createdAt?: string }[];
};

export async function apiListDiscussions(): Promise<DiscussionDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/community/discussions`);
  if (!res.ok) throw new Error('Failed to load discussions');
  return res.json();
}

export async function apiCreateDiscussion(token: string, payload: Partial<DiscussionDto> & { title: string; content: string }): Promise<DiscussionDto> {
  const res = await fetch(`${API_BASE_URL}/api/community/discussions`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create discussion');
  }
  return res.json();
}

export async function apiAddComment(token: string, discussionId: string, content: string): Promise<DiscussionDto> {
  const res = await fetch(`${API_BASE_URL}/api/community/discussions/${discussionId}/comments`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to add comment');
  }
  return res.json();
}

export type GroupDto = {
  _id: string;
  name: string;
  description?: string;
  members?: number;
  isPrivate?: boolean;
  category?: string;
  avatar?: string;
  tags?: string[];
  recentActivity?: string;
  createdAt?: string;
};

export async function apiListGroups(): Promise<GroupDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/community/groups`);
  if (!res.ok) throw new Error('Failed to load groups');
  return res.json();
}

export async function apiCreateGroup(token: string, payload: Partial<GroupDto> & { name: string }): Promise<GroupDto> {
  const res = await fetch(`${API_BASE_URL}/api/community/groups`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to create group');
  }
  return res.json();
}

