import { Chapter, ChapterLead } from '../types';

export const chapterLeads: ChapterLead[] = [
  {
    name: "Rahul Sharma",
    role: "Founder & Global Community Lead",
    chapter: "Global",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    linkedin: "https://linkedin.com/in/rahulsharma",
    bio: "AI enthusiast and community builder with 10+ years of experience in technology."
  },
  {
    name: "Priya Patel",
    role: "Chapter Lead",
    chapter: "Bangalore",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    linkedin: "https://linkedin.com/in/priyapatel",
    bio: "ML Engineer passionate about democratizing AI education."
  }
];

export const chapters: Chapter[] = [
  {
    id: "bangalore",
    city: "Bangalore",
    country: "India",
    leads: [chapterLeads[1]],
    memberCount: 18000,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "https://www.meetup.com/futuregpt"
  },
  {
    id: "pune",
    city: "Pune",
    country: "India",
    leads: [],
    memberCount: 2500,
    image: "/chapter/pune.jpeg",
    link: "https://www.meetup.com/futuregpt"
  },
  {
    id: "hyderabad",
    city: "Hyderabad",
    country: "India",
    leads: [],
    memberCount: 1500,
    image: "/chapter/hyderabad.jpeg",
    link: "https://www.meetup.com/futuregpt"
  },
  {
    id: "chennai",
    city: "Chennai",
    country: "India",
    leads: [],
    memberCount: 1100,
    image: "/chapter/chennai.jpeg",
    link: "https://www.meetup.com/futuregpt"
  },
  {
    id: "Mumbai",
    city: "Mumbai",
    country: "India",
    leads: [],
    memberCount: 1000,
    image: "/chapter/mumbai.jpeg",
    link: "https://www.meetup.com/futuregpt"
  },
  {
    id: "Delhi",
    city: "Delhi",
    country: "India",
    leads: [],
    memberCount: 1000,
    image: "/chapter/delhi.jpeg",
    link: "https://www.meetup.com/futuregpt"
  }
];