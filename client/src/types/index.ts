export interface ChapterLead {
  name: string;
  role: string;
  chapter: string;
  image: string;
  linkedin: string;
  bio: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  chapter: string;
  description: string;
  image: string;
  registrationLink: string;
}

export interface Chapter {
  id: string;
  city: string;
  country: string;
  leads: ChapterLead[];
  memberCount: number;
  image: string;
  link: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  designation: string;
  chapter?: string;
  image: string;
  bio: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  company?: string;
  title?: string;
  startDate?: string; // ISO string
  endDate?: string | null; // ISO string or null for present
  description?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isPremium?: boolean;
  premiumPurchaseDate?: string | null;
  paymentId?: string | null;
  orderId?: string | null;
  phone?: string;
  location?: string;
  role?: string;
  company?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  resumeUrl?: string;
  experience?: Experience[];
  avatar?: string;
  joinDate?: string;
  profileVisibility?: 'public' | 'members' | 'private';
  showOnlineStatus?: boolean;
  allowDirectMessages?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  eventReminders?: boolean;
  jobAlerts?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  _id: string;
  companyId: string | { _id: string; $oid?: string };
  companyName: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: {
    min?: number;
    max?: number;
    currency?: string;
  };
  experience: string;
  skills: string[];
  benefits: string[];
  isActive: boolean;
  applications: number;
  department?: string;
  remotePolicy: 'remote' | 'hybrid' | 'onsite';
  applicationDeadline?: string;
  startDate?: string;
  contractDuration?: string;
  visaSponsorship: boolean;
  relocationAssistance: boolean;
  allowCoverLetter: boolean;
  requireResume: boolean;
  maxApplications: number;
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  _id: string;
  name: string;
  email: string;
  website?: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  logo?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}