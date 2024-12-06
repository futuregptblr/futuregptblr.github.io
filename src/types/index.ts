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