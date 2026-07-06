export interface Form {
  id: string;
  name: string;
  description: string;
  category_id?: string;
  pdf_link?: string;
  website_link?: string;
  eligibility?: string;
  last_date?: string;
  fees?: string;
  state?: string;
  tags?: string[];
  version: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  icon?: any;
  count?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  published_at?: string;
  created_at?: string;
}

// Keeping Job interface to avoid breaking existing UI immediately if it's still rendering
export interface Job {
  id: string;
  title: string;
  category: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  department?: string;
  startDate?: string;
  lastDate?: string;
  qualification?: string;
  location?: string;
  applicationFee?: { category: string; fee: string }[];
  ageLimit?: { category: string; age: string }[];
  vacancies?: { postName: string; count: number }[];
  importantLinks?: { title: string; url: string }[];
  status?: string;
}
