import { Category, Job } from './types';

export const categories: Category[] = [
  { id: '1', name: 'Latest Jobs', icon: 'Briefcase', count: 124 },
  { id: '2', name: 'Results', icon: 'Award', count: 45 },
  { id: '3', name: 'Admit Cards', icon: 'FileText', count: 32 },
  { id: '4', name: 'Answer Key', icon: 'Key', count: 18 },
  { id: '5', name: 'Admissions', icon: 'GraduationCap', count: 56 },
  { id: '6', name: 'Syllabus', icon: 'BookOpen', count: 89 },
];

export const allJobs: Job[] = [
  {
    id: 'j1',
    title: 'SSC CGL 2026 Official Notification & Application',
    category: 'Latest Jobs',
    date: 'Jul 03, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400&h=250',
    excerpt: 'Staff Selection Commission has released the notification for Combined Graduate Level Examination 2026. Apply online now.',
    department: 'Staff Selection Commission (SSC)',
    startDate: 'Jul 05, 2026',
    lastDate: 'Aug 04, 2026',
    qualification: 'Bachelor\'s Degree',
    location: 'All India',
    status: 'Active',
    applicationFee: [
      { category: 'General / OBC / EWS', fee: '₹ 100/-' },
      { category: 'SC / ST / PH / Women', fee: '₹ 0/-' }
    ],
    ageLimit: [
      { category: 'Minimum Age', age: '18 Years' },
      { category: 'Maximum Age', age: '27-32 Years (Post Wise)' }
    ],
    vacancies: [
      { postName: 'Assistant Audit Officer', count: 250 },
      { postName: 'Assistant Section Officer', count: 1200 },
      { postName: 'Inspector of Income Tax', count: 450 }
    ],
    importantLinks: [
      { title: 'Apply Online', url: '#' },
      { title: 'Download Notification', url: '#' },
      { title: 'Official Website', url: '#' }
    ]
  },
  {
    id: 'j2',
    title: 'SBI Probationary Officer (PO) Recruitment 2026',
    category: 'Latest Jobs',
    date: 'Jun 28, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400&h=250',
    excerpt: 'State Bank of India is inviting applications for the post of Probationary Officers across various branches.',
    department: 'State Bank of India (SBI)',
    startDate: 'Jul 01, 2026',
    lastDate: 'Jul 21, 2026',
    qualification: 'Graduation in any discipline',
    location: 'All India',
  },
  {
    id: 'j3',
    title: 'UPSC Civil Services Prelims Result 2026 Declared',
    category: 'Results',
    date: 'Jul 04, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&q=80&w=400&h=250',
    excerpt: 'The Union Public Service Commission has announced the results for the Civil Services Preliminary Examination held earlier this year.',
    department: 'Union Public Service Commission (UPSC)',
    location: 'New Delhi',
  },
  {
    id: 'j4',
    title: 'Railway RRB NTPC Admit Card Download Available',
    category: 'Admit Cards',
    date: 'Jul 02, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1478818513635-985221971167?auto=format&fit=crop&q=80&w=400&h=250',
    excerpt: 'Railway Recruitment Board has issued the admit cards for the upcoming Non-Technical Popular Categories exams.',
    department: 'Railway Recruitment Board (RRB)',
    location: 'All India',
  },
  {
    id: 'j5',
    title: 'IBPS Clerk Main Exam Answer Key Released',
    category: 'Answer Key',
    date: 'Jun 25, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=400&h=250',
    excerpt: 'Institute of Banking Personnel Selection has published the official answer key for the Clerk Main examination.',
    department: 'IBPS',
    location: 'All India',
  },
  {
    id: 'j6',
    title: 'Delhi Police Constable Syllabus & Exam Pattern',
    category: 'Syllabus',
    date: 'Jun 20, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=250',
    excerpt: 'Detailed syllabus and revised exam pattern for the upcoming Delhi Police Constable recruitment drive.',
    department: 'Delhi Police',
    location: 'New Delhi',
  },
  {
    id: 'j7',
    title: 'Indian Navy Agniveer MR Recruitment 2026',
    category: 'Latest Jobs',
    date: 'Jul 01, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&q=80&w=400&h=250',
    excerpt: 'Indian Navy invites online applications from unmarried male and unmarried female candidates for Agniveer (MR).',
    department: 'Indian Navy',
    startDate: 'Jul 15, 2026',
    lastDate: 'Jul 30, 2026',
    qualification: 'Matriculation (10th pass)',
    location: 'All India',
  },
  {
    id: 'j8',
    title: 'UPPSC RO/ARO Final Result 2025',
    category: 'Results',
    date: 'Jun 30, 2026',
    thumbnail: 'https://images.unsplash.com/photo-1577415124269-b9140d580bf3?auto=format&fit=crop&q=80&w=400&h=250',
    excerpt: 'Uttar Pradesh Public Service Commission has released the final result for Review Officer/Assistant Review Officer.',
    department: 'UPPSC',
    location: 'Uttar Pradesh',
  },
];

export const latestUpdates: Job[] = allJobs.slice(0, 3);
export const trendingJobs: Job[] = [allJobs[1], allJobs[4], allJobs[5]];

