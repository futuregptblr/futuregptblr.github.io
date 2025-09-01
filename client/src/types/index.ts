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
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  chapter?: string;
  image: string;
  bio: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  premiumPurchaseDate?: string;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  description: string;
  website?: string;
  logo?: string;
  industry: string;
  size: string;
  location: string;
  isVerified: boolean;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  experience: string;
  skills: string[];
  benefits: string[];
  isActive: boolean;
  createdAt: string;
  applications: number;
}
