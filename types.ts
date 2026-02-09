
export interface Achievement {
  id: string;
  title: string;
  category: 'academic' | 'sport' | 'art' | 'voluntary';
  date: string;
  description: string;
  image?: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface StudentProfile {
  name: string;
  grade: string;
  school: string;
  bio: string;
  avatar: string;
  email: string;
  hobbies?: string[];
}
