import { API_BASE_URL } from "./utils";

function authHeaders(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

type RegisterPayload = { name: string; email: string; password: string };
type LoginPayload = { email: string; password: string };

export async function apiRegister(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Registration failed");
  }
  return res.json();
}

export async function apiLogin(payload: LoginPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Login failed");
  }
  return res.json();
}

export async function apiAdminLogin(payload: LoginPayload) {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Admin login failed");
  }
  return res.json();
}

export async function apiVerifyAdmin(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin-verify`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Admin session expired");
  }
  return res.json();
}

export async function apiForgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to request password reset");
  }
  return res.json();
}

export async function apiResetPassword(params: {
  token: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to reset password");
  }
  return res.json();
}

// Admin: Cloudinary sign
export async function apiCloudinarySign(
  token: string,
  body: {
    folder?: string;
    public_id?: string;
    eager?: string;
    invalidate?: boolean;
  },
) {
  const res = await fetch(`${API_BASE_URL}/api/cloudinary/sign`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to sign upload");
  }
  return res.json();
}

// Resume upload sign
export async function apiCloudinarySignResume(
  token: string,
  body: { public_id?: string; timestamp?: number },
) {
  const res = await fetch(`${API_BASE_URL}/api/cloudinary/sign-resume`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to sign resume upload");
  }
  return res.json();
}

export async function apiUploadResume(
  token: string,
  file: File,
): Promise<{ url: string; public_id: string; resource_type: string }> {
  const publicId = `resume_${Date.now()}_${file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^A-Za-z0-9_-]+/g, "_")}`;
  const signature = await apiCloudinarySignResume(token, {
    public_id: publicId,
  });

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signature.apiKey);
  form.append("timestamp", String(signature.timestamp));
  form.append("folder", signature.folder);
  form.append("public_id", signature.public_id || publicId);
  form.append("signature", signature.signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/raw/upload`,
    {
      method: "POST",
      body: form,
    },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to upload resume");
  }
  const data = await res.json();
  return {
    url: data.secure_url || data.url,
    public_id: data.public_id,
    resource_type: data.resource_type,
  };
}

// Team
import type { GlobalApplication, GlobalJob, GlobalSavedJob, TeamMember, User } from "../types";

export async function apiGetTeam(): Promise<TeamMember[]> {
  const res = await fetch(`${API_BASE_URL}/api/team`);
  if (!res.ok) throw new Error("Failed to load team");
  return res.json();
}

export async function apiCreateTeamMember(
  token: string,
  payload: Partial<TeamMember> & { image: string },
): Promise<TeamMember> {
  const res = await fetch(`${API_BASE_URL}/api/team`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create");
  }
  return res.json();
}

export async function apiUpdateTeamMember(
  token: string,
  id: string,
  payload: Partial<TeamMember>,
): Promise<TeamMember> {
  const res = await fetch(`${API_BASE_URL}/api/team/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update");
  }
  return res.json();
}

export async function apiDeleteTeamMember(
  token: string,
  id: string,
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/api/team/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete");
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
  locationUrl?: string;
  chapter?: string;
  type?: string;
  capacity?: number;
  isPremium?: boolean;
  price?: number;
  image?: string;
  speakers?: string[];
  tags?: string[];
  registrationsCount?: number;
  registrationLink?: string;
};

export async function apiListEvents(
  scope: "upcoming" | "past" | "all" = "upcoming",
): Promise<EventDto[]> {
  const params = new URLSearchParams();
  if (scope && scope !== "all") params.set("scope", scope);
  const res = await fetch(`${API_BASE_URL}/api/events?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export async function apiAdminListAllEvents(
  token: string,
): Promise<EventDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/events?scope=all`, {
    headers: authHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to load all events");

  return res.json();
}

export async function apiRegisterForEvent(eventId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Registration failed");
  }
  return res.json();
}

export async function apiListMyEventRegistrations(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/events/me/registrations`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load registrations");
  }
  return res.json();
}

export async function apiCreateEvent(
  token: string,
  payload: Partial<EventDto>,
) {
  const res = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create event");
  }
  return res.json();
}

export async function apiUpdateEvent(
  token: string,
  eventId: string,
  payload: Partial<EventDto>,
) {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update event");
  }
  return res.json();
}

export async function apiDeleteEvent(token: string, eventId: string) {
  const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete event");
  }
  return res.json();
}

export async function apiAdminListRegistrations(
  token: string,
  eventId: string,
) {
  const res = await fetch(
    `${API_BASE_URL}/api/events/${eventId}/registrations`,
    {
      headers: authHeaders(token),
    },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load registrations");
  }
  return res.json();
}

export async function apiUpdateRegistrationStatus(
  token: string,
  registrationId: string,
  status: string,
) {
  const res = await fetch(
    `${API_BASE_URL}/api/events/registrations/${registrationId}/status`,
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update status");
  }
  return res.json();
}

export async function apiGetStats(): Promise<{
  users: number;
  premiumUsers: number;
  jobs: number;
  upcomingEvents: number;
  teamMembers: number;
  waitlist: number;
}> {
  const res = await fetch(`${API_BASE_URL}/api/stats`);
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json();
}

export type ActivityItem = {
  type: "event" | "job" | "discussion" | "user";
  title: string;
  description: string;
  createdAt: string;
  meta?: Record<string, any>;
};

export async function apiGetRecentActivity(): Promise<ActivityItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/stats/recent`);
  if (!res.ok) throw new Error("Failed to load activity");
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
  if (!res.ok) throw new Error("Failed to load discussions");
  return res.json();
}

export async function apiCreateDiscussion(
  token: string,
  payload: Partial<DiscussionDto> & { title: string; content: string },
): Promise<DiscussionDto> {
  const res = await fetch(`${API_BASE_URL}/api/community/discussions`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create discussion");
  }
  return res.json();
}

export async function apiAddComment(
  token: string,
  discussionId: string,
  content: string,
): Promise<DiscussionDto> {
  const res = await fetch(
    `${API_BASE_URL}/api/community/discussions/${discussionId}/comments`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ content }),
    },
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to add comment");
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
  if (!res.ok) throw new Error("Failed to load groups");
  return res.json();
}

export async function apiCreateGroup(
  token: string,
  payload: Partial<GroupDto> & { name: string },
): Promise<GroupDto> {
  const res = await fetch(`${API_BASE_URL}/api/community/groups`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create group");
  }
  return res.json();
}
export async function apiUpdateProfile(
  token: string,
  payload: Partial<User>,
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update profile");
  }
  return res.json();
}

export async function apiGetProfile(token: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load profile");
  }
  return res.json();
}

export type GlobalJobsResponse = {
  jobs: GlobalJob[];
  pagination: { page: number; limit: number; total: number; pages: number };
  cache?: "hit" | "refreshed" | "stale";
  refreshedAt?: string;
  providerErrors?: string[];
};

export type GlobalJobFilters = {
  search?: string;
  provider?: string;
  country?: string;
  workMode?: string;
  page?: number;
  limit?: number;
  refresh?: boolean;
};

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export async function apiListGlobalJobs(filters: GlobalJobFilters = {}): Promise<GlobalJobsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs${buildQuery(filters)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load global jobs");
  }
  return res.json();
}

export async function apiGetGlobalJob(jobId: string): Promise<GlobalJob> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/${encodeURIComponent(jobId)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load global job");
  }
  return res.json();
}

export async function apiListGlobalSavedJobs(token: string): Promise<GlobalSavedJob[]> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/saved`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load saved global jobs");
  }
  return res.json();
}

export async function apiSaveGlobalJob(token: string, jobId: string): Promise<GlobalSavedJob> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/${encodeURIComponent(jobId)}/save`, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to save global job");
  }
  return res.json();
}

export async function apiUnsaveGlobalJob(token: string, jobId: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/${encodeURIComponent(jobId)}/save`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to remove saved global job");
  }
  return res.json();
}

export async function apiConfirmGlobalApplication(token: string, jobId: string): Promise<GlobalApplication> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/${encodeURIComponent(jobId)}/applications`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ appliedDate: new Date().toISOString() }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to confirm application");
  }
  return res.json();
}

export async function apiListGlobalApplications(token: string): Promise<GlobalApplication[]> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/applications`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load global applications");
  }
  return res.json();
}

export async function apiListGlobalApplicationStatuses(token: string): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/applications/statuses`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load application statuses");
  }
  return res.json();
}

export async function apiUpdateGlobalApplicationStatus(
  token: string,
  applicationId: string,
  status: string,
): Promise<GlobalApplication> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/applications/${applicationId}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update application status");
  }
  return res.json();
}

export async function apiAddGlobalApplicationNote(
  token: string,
  applicationId: string,
  note: string,
): Promise<GlobalApplication> {
  const res = await fetch(`${API_BASE_URL}/api/global-jobs/applications/${applicationId}/notes`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ note }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to save application note");
  }
  return res.json();
}
