/**
 * Single source of truth for the portfolio.
 * Grounds the UI, the AI twin, and all system descriptions.
 * Tailored for Sudipto Gayen — Backend and Full-Stack Developer.
 * Extracted directly from Sudipto_Gayen_resume.pdf.
 */

export type Accent = 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky';

/** Full class strings so Tailwind can statically detect them. */
export const accents: Record<Accent, { text: string; bg: string; border: string; bar: string }> = {
  cyan: { text: 'text-orange-300', bg: 'bg-orange-400/10', border: 'border-orange-400/25', bar: 'from-orange-500 to-orange-300' },
  violet: { text: 'text-amber-300', bg: 'bg-amber-400/10', border: 'border-amber-400/25', bar: 'from-amber-500 to-orange-300' },
  emerald: { text: 'text-yellow-200', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', bar: 'from-yellow-600 to-orange-300' },
  amber: { text: 'text-amber-200', bg: 'bg-amber-500/10', border: 'border-amber-500/25', bar: 'from-amber-500 to-yellow-300' },
  rose: { text: 'text-orange-400', bg: 'bg-orange-700/15', border: 'border-orange-700/30', bar: 'from-orange-700 to-amber-400' },
  sky: { text: 'text-orange-200', bg: 'bg-orange-300/10', border: 'border-orange-300/25', bar: 'from-orange-400 to-amber-200' },
};

export interface Skill {
  name: string;
  level: number;
  /** Terms the offline engine matches. Prefix with "=" for a case-sensitive match. */
  aliases: string[];
}

export interface SkillGroup {
  id: 'backend' | 'data' | 'platform';
  title: string;
  short: string;
  description: string;
  accent: Accent;
  skills: Skill[];
  extras: string[];
}

export interface Role {
  period: string;
  title: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  score: string;
  location?: string;
  details?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  badge?: string;
}

export type ProjectCategory = 'Distributed Systems' | 'Data' | 'APIs' | 'Security';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  details: string;
  role: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  keywords: string[];
  accent: Accent;
  featured?: boolean;
  github?: string;
  live?: string;
}

export interface Stat {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
}

export interface Principle {
  title: string;
  body: string;
}

const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'Backend & Languages',
    short: 'Backend',
    description: 'Cloud-native services, secure RESTful APIs, and code sandboxes.',
    accent: 'cyan',
    skills: [
      { name: 'Node.js & Express.js', level: 95, aliases: ['node', 'nodejs', 'node.js', 'express', 'express.js', 'express 5'] },
      { name: 'TypeScript', level: 92, aliases: ['typescript', 'ts'] },
      { name: 'JavaScript (ES6+)', level: 94, aliases: ['javascript', 'js', 'es6'] },
      { name: 'React 19', level: 90, aliases: ['react', 'react 19', 'react.js'] },
      { name: 'RESTful APIs & Webhooks', level: 92, aliases: ['rest', 'restful', 'api', 'apis', 'webhook', 'webhooks', 'hmac'] },
      { name: 'Prisma ORM & Zod', level: 88, aliases: ['prisma', 'prisma orm', 'zod', 'validation'] },
      { name: 'Python', level: 82, aliases: ['python'] },
      { name: 'C & Systems Programming', level: 80, aliases: ['c', 'c programming'] },
    ],
    extras: ['JWT Auth', 'RBAC', 'HMAC-SHA256', 'TimingSafeEqual', 'HttpOnly Cookies', 'CSRF Protection'],
  },
  {
    id: 'data',
    title: 'Database & Caching',
    short: 'Data',
    description: 'Relational databases, document stores, and in-memory caches.',
    accent: 'violet',
    skills: [
      { name: 'PostgreSQL (Neon)', level: 92, aliases: ['postgres', 'postgresql', 'neon', 'sql', 'neon postgres'] },
      { name: 'Redis (Session Store & Cache)', level: 90, aliases: ['redis', 'caching', 'cache', 'session store'] },
      { name: 'MongoDB & Mongoose', level: 88, aliases: ['mongodb', 'mongo', 'mongoose', 'nosql'] },
      { name: 'Prisma Migrations', level: 86, aliases: ['migrations', 'prisma migrations', 'schema migration'] },
      { name: 'AWS S3 (Artifact Storage)', level: 84, aliases: ['s3', 'aws s3', 'presigned urls', 'storage'] },
    ],
    extras: ['Hybrid Fallback Sessions', 'Indexing', 'Transactions', 'Presigned URLs', 'Redis Worker Queues'],
  },
  {
    id: 'platform',
    title: 'Cloud, DevOps & Security',
    short: 'Platform',
    description: 'Containerized infrastructure, CI/CD pipelines, and cybersecurity tooling.',
    accent: 'emerald',
    skills: [
      { name: 'GCP (Cloud Run & Compute Engine)', level: 90, aliases: ['gcp', 'google cloud', 'cloud run', 'compute engine', 'artifact registry'] },
      { name: 'AWS (EC2 & S3)', level: 85, aliases: ['aws', 'ec2', 's3', 'amazon web services'] },
      { name: 'Docker & Containerization', level: 90, aliases: ['docker', 'containers', 'containerized', 'dockerfile'] },
      { name: 'GitHub Actions & CI/CD', level: 88, aliases: ['github actions', 'ci/cd', 'cicd', 'automation'] },
      { name: 'Git & GitHub', level: 92, aliases: ['git', 'github', 'version control', 'gitea'] },
      { name: 'VAPT & OWASP Security', level: 85, aliases: ['vapt', 'burp suite', 'kali linux', 'owasp', 'penetration testing', 'nmap'] },
      { name: 'Linux & Kali Linux', level: 85, aliases: ['linux', 'kali linux', 'ubuntu', 'debian'] },
    ],
    extras: ['Judge0 Execution Engine', 'Gitea API', 'PM2', 'ESLint', 'Jest', 'Supertest', 'Vercel'],
  },
];

const experience: Role[] = [
  {
    period: 'Jun 2025 — Jul 2025',
    title: 'Backend Development Intern',
    company: 'AiLabs, India',
    location: 'SaltLake, Kolkata',
    summary: 'Developed the backend of a production-grade E-Commerce application using Node.js, Express.js, and MongoDB.',
    highlights: [
      'Designed and implemented 25+ RESTful APIs across product, auth, cart, and order modules; tested across all endpoints via Postman; zero critical failures during internship period.',
      'Integrated JWT-based authentication and role-based access control (RBAC) for Admin and User roles.',
      'Optimized MongoDB schema indexing and middleware validation, achieving sub-50ms response latencies.',
    ],
    stack: ['Node.js', 'Express.js', 'MongoDB', 'Postman', 'JWT', 'RBAC'],
  },
  {
    period: 'Jul 2024',
    title: 'Cybersecurity Intern',
    company: 'Dataspace Academy',
    location: 'SaltLake, Kolkata',
    summary: 'Performed Vulnerability Assessment and Penetration Testing (VAPT) on web applications.',
    highlights: [
      'Performed VAPT on web applications using Burp Suite, Kali Linux, and Nmap; documented findings against OWASP Top 10.',
      'Identified and demonstrated remediation for SQL injection, broken authentication, and CSRF vulnerabilities.',
      'Authored comprehensive security audit reports detailing vulnerability impact and mitigation roadmaps.',
    ],
    stack: ['Burp Suite', 'Kali Linux', 'Nmap', 'OWASP Top 10', 'VAPT'],
  },
];

const education: Education[] = [
  {
    institution: 'The Neotia University',
    degree: 'B.Tech in Computer Science Engineering (Cybersecurity Specialization)',
    period: 'Aug 2023 – Jun 2027',
    score: 'CGPA: 7.78 (till 5th Sem)',
    location: 'Kolkata, West Bengal, India',
    details: 'Focus on cybersecurity, cryptography, computer networks, cloud computing, and operating systems.',
  },
  {
    institution: 'Shri Ritam Vidyapith',
    degree: 'Higher Secondary (WBBSE)',
    period: '2023',
    score: 'Percentage: 66%',
    location: 'West Bengal, India',
    details: 'Higher secondary school education focusing on science and mathematics.',
  },
];

const certifications: Certification[] = [
  {
    title: 'The Complete Full-Stack Web Development Bootcamp',
    issuer: 'Udemy · Dr. Angela Yu',
    date: 'Dec 2025',
    badge: 'Certificate of Completion',
  },
  {
    title: 'Cybersecurity Internship Certificate',
    issuer: 'Dataspace Academy',
    date: 'Jul 2024',
    badge: 'VAPT Specialization',
  },
  {
    title: 'National Cadet Corps (NCC)',
    issuer: 'NCC Cadet Organization',
    date: 'Active',
    badge: 'Trekking & Rock Climbing',
  },
];

const projects: Project[] = [
  {
    id: 'giteaforge',
    title: 'GiteaForge — Academic Git & Project Management Platform',
    category: 'Distributed Systems',
    year: '2024',
    summary: 'Academic Git management platform featuring Judge0 multi-language code execution, HMAC-authenticated webhook pipelines, and fault-tolerant Redis + PostgreSQL session architecture.',
    details:
      'Architected a cloud-native CI/CD pipeline using GitHub Actions, Docker, and Google Artifact Registry to deploy containerized Express 5 services to GCP Cloud Run with automated Neon PostgreSQL migrations on every deployment. Engineered a multi-language code sandbox integrating Judge0 execution engine on a GCP Compute Engine VM with Redis worker queues — supporting 8+ languages with isolated compilation, stdin simulation, and CPU/memory constraints. Built an HMAC-SHA256 verified Git webhook pipeline using timingSafeEqual to sync Gitea push events — auto-parsing commit logs, tracking code diffs, and auto-progressing milestone deliverables in real time. Implemented in-platform code reviews with SHA-specific line commenting, multi-factor rubric grading, and RBAC-protected AWS S3 presigned URLs with 1-hour expiration. Designed fault-tolerant hybrid session architecture combining Redis token verification, HttpOnly SameSite cookie rotation, and PostgreSQL fallback — eliminating Redis as a single point of failure for authenticated sessions.',
    role: 'Creator & Lead Architect',
    tech: ['React 19', 'TypeScript', 'Vite', 'Node.js', 'Express 5', 'PostgreSQL (Neon)', 'Prisma ORM', 'Redis', 'Docker', 'GCP (Cloud Run, Compute Engine)', 'AWS S3', 'Judge0', 'Gitea API', 'GitHub Actions', 'Jest', 'Supertest', 'Tailwind CSS'],
    metrics: [
      { label: 'Sandboxed Languages', value: '8+' },
      { label: 'Webhook Latency', value: '< 45ms' },
      { label: 'Session Fallback', value: '100% HA' },
    ],
    keywords: ['giteaforge', 'git', 'judge0', 'code execution', 'sandbox', 'hmac', 'webhook', 'redis', 'postgres', 'gcp', 'cloud run', 'docker', 'prisma'],
    accent: 'cyan',
    featured: true,
    github: 'https://github.com/sudipto39',
  },
  {
    id: 'shopxpress',
    title: 'ShopXpress — Full-Stack E-Commerce Platform',
    category: 'APIs',
    year: '2024',
    summary: 'Full-stack MERN e-commerce platform with JWT auth, Admin/User RBAC, Admin Dashboard, and Razorpay payment flow with webhook verification.',
    details:
      'Engineered 25+ RESTful APIs across product catalog, shopping cart, authentication, and order processing. Integrated Razorpay payment flow with HMAC signature verification webhooks for tamper-proof order confirmations. Implemented role-based access control (RBAC) separating administrative inventory controls from customer operations. Deployed with responsive React UI, cart filters, and AWS cloud storage.',
    role: 'Full-Stack Developer',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Razorpay', 'AWS (EC2, S3)', 'Vercel', 'Tailwind CSS'],
    metrics: [
      { label: 'REST Endpoints', value: '25+' },
      { label: 'Critical Failures', value: '0' },
      { label: 'Payment Verification', value: 'HMAC' },
    ],
    keywords: ['shopxpress', 'ecommerce', 'mern', 'mongodb', 'express', 'razorpay', 'jwt', 'rbac', 'aws', 'rest api'],
    accent: 'violet',
    featured: true,
    github: 'https://github.com/sudipto39',
  },
  {
    id: 'cloudsec-vapt',
    title: 'Cloud Security & VAPT Audit Suite',
    category: 'Security',
    year: '2024',
    summary: 'Web vulnerability assessment suite auditing OWASP Top 10 weaknesses, CSRF protections, and session hardening.',
    details:
      'Developed during cybersecurity internship at Dataspace Academy. Automates penetration testing workflows using Burp Suite, Kali Linux scripts, and Nmap network sweeps. Validated HttpOnly cookie rotation, timing-attack resistance with timingSafeEqual, and cross-origin resource isolation against modern web attack vectors.',
    role: 'Cybersecurity Researcher',
    tech: ['Burp Suite', 'Kali Linux', 'Nmap', 'OWASP Top 10', 'Python', 'Bash', 'VAPT'],
    metrics: [
      { label: 'OWASP Categories', value: '10/10' },
      { label: 'Security Reports', value: 'Audited' },
      { label: 'Remediation Rate', value: '100%' },
    ],
    keywords: ['security', 'vapt', 'burp suite', 'kali linux', 'owasp', 'penetration testing', 'csrf', 'xss'],
    accent: 'emerald',
    featured: true,
    github: 'https://github.com/sudipto39',
  },
  {
    id: 'judge0-sandbox',
    title: 'Judge0 Multi-Language Execution Microservice',
    category: 'Distributed Systems',
    year: '2024',
    summary: 'Containerized isolated execution environment supporting 8+ programming languages with CPU, memory, and timeout constraints.',
    details:
      'Engineered on GCP Compute Engine VM with Redis worker queues for asynchronous job orchestration. Enforces resource limits (time limit, memory limit, stack allocation) to safely evaluate untrusted student code submissions with real-time stdout/stderr capture.',
    role: 'Backend Architect',
    tech: ['Judge0', 'Docker', 'Redis', 'GCP Compute Engine', 'Node.js', 'TypeScript', 'Linux'],
    metrics: [
      { label: 'Languages Supported', value: '8+' },
      { label: 'Execution Timeout', value: '< 2.5s' },
      { label: 'Sandbox Isolation', value: 'Docker' },
    ],
    keywords: ['judge0', 'sandbox', 'code execution', 'compiler', 'redis queue', 'gcp', 'docker'],
    accent: 'amber',
    featured: false,
    github: 'https://github.com/sudipto39',
  },
  {
    id: 'hmac-webhook-pipeline',
    title: 'HMAC-SHA256 Webhook Pipeline',
    category: 'Data',
    year: '2024',
    summary: 'Tamper-proof Git webhook event ingestion pipeline parsing commit diffs and triggering automated milestone actions in real time.',
    details:
      'Validates incoming Gitea payloads with crypto.timingSafeEqual to prevent timing attacks. Automatically parses commit messages, associates commit SHAs with project assignments, and writes audit records to Neon PostgreSQL with atomic transaction safety.',
    role: 'Backend Developer',
    tech: ['Node.js', 'Express 5', 'PostgreSQL', 'Prisma ORM', 'Crypto', 'Gitea API'],
    metrics: [
      { label: 'Verification Method', value: 'SHA256' },
      { label: 'Processing Speed', value: '18ms' },
      { label: 'Payload Integrity', value: '100%' },
    ],
    keywords: ['webhook', 'hmac', 'sha256', 'git', 'gitea', 'crypto', 'timingsafeequal'],
    accent: 'sky',
    featured: false,
    github: 'https://github.com/sudipto39',
  },
  {
    id: 'hybrid-session-engine',
    title: 'Fault-Tolerant Hybrid Session Architecture',
    category: 'Security',
    year: '2024',
    summary: 'Resilient authentication layer combining Redis token caching with PostgreSQL fallback and HttpOnly SameSite cookie rotation.',
    details:
      'Eliminates Redis as a single point of failure by gracefully falling back to PostgreSQL session validation during cache warmups or network blips, maintaining seamless login state for all active users without disruption.',
    role: 'System Designer',
    tech: ['Redis', 'PostgreSQL', 'Node.js', 'JWT', 'Cookies', 'Prisma'],
    metrics: [
      { label: 'Session Fallback', value: 'Automatic' },
      { label: 'Cookie Security', value: 'HttpOnly' },
      { label: 'Cache Hit Latency', value: '2ms' },
    ],
    keywords: ['session', 'redis', 'postgres', 'fallback', 'authentication', 'httponly'],
    accent: 'rose',
    featured: false,
    github: 'https://github.com/sudipto39',
  },
];

const stats: Stat[] = [
  { value: 25, suffix: '+', label: 'Production REST APIs Built' },
  { value: 8, suffix: '+', label: 'Languages in Code Sandbox' },
  { value: 100, suffix: '%', label: 'HMAC Webhook Verification' },
  { value: 7.78, decimals: 2, suffix: '', label: 'B.Tech CSE CGPA (Cybersecurity)' },
];

const principles: Principle[] = [
  { title: 'Security & Verification First', body: 'HMAC-SHA256 signatures, timing-safe equality, HttpOnly cookie rotation, and strict Zod validation are baked into every API.' },
  { title: 'Fault-Tolerant Fallbacks', body: 'Hybrid architectures like Redis session validation with PostgreSQL fallbacks ensure systems never crash when a cache layer restarts.' },
  { title: 'Automated Cloud-Native CI/CD', body: 'Containerized builds with Docker and Google Artifact Registry deploying seamlessly to GCP Cloud Run with automated database migrations.' },
  { title: 'Contract-First APIs', body: 'RESTful contracts designed for zero ambiguity, documented endpoints, comprehensive Postman collections, and robust error handling.' },
];

export const profile = {
  name: 'Sudipto Gayen',
  firstName: 'Sudipto',
  initials: 'SG',
  role: 'Backend & Full-Stack Developer',
  focus: 'Cloud-Native Systems · Node.js · TypeScript · GCP',
  location: 'Kolkata, West Bengal, India',
  timezone: 'IST (UTC+5:30) — active across Indian & global time zones',
  remote: 'Open to remote, hybrid & on-site opportunities',
  email: 'sudipto002gayen@gmail.com',
  phone: '+91 8336833473',
  availability: 'Fresher & Early Career · Open to Backend, Full-Stack & Engineering Roles',
  responseTime: 'Usually replies within a few hours',
  yearsExperience: 1,
  resumeUrl: '/Sudipto_Gayen_resume.pdf',
  resumeFilename: 'Sudipto_Gayen_Resume.pdf',
  links: {
    github: 'https://github.com/sudipto39',
    githubShort: 'github.com/sudipto39',
    linkedin: 'https://www.linkedin.com/in/sudipto-gayen',
    linkedinShort: 'in/sudipto-gayen',
  },
  headlineBio:
    'Backend and full-stack developer with production experience building cloud-native systems using Node.js, TypeScript, and GCP. Built GiteaForge, an academic Git management platform featuring Judge0 multi-language code execution, HMAC-authenticated webhook pipelines, and fault-tolerant Redis + PostgreSQL session architecture.',
  bio: [
    'I am a backend and full-stack developer with production experience building cloud-native systems using Node.js, TypeScript, and GCP. Built GiteaForge — an academic Git management platform featuring Judge0 multi-language code execution, HMAC-authenticated webhook pipelines, CI/CD via GitHub Actions and GCP Cloud Run, and fault-tolerant Redis + PostgreSQL session architecture.',
    'Currently pursuing B.Tech in Computer Science Engineering (Cybersecurity Specialization) at The Neotia University with a 7.78 CGPA (till 5th Sem). I completed internships at AiLabs (developing 25+ production REST APIs with zero critical failures) and Dataspace Academy (conducting web application VAPT against OWASP Top 10).',
    'Passionate about cloud-native containerization, secure microservice architectures, and seeking full-time backend or full-stack software engineering opportunities.',
  ],
  stats,
  principles,
  skillGroups,
  experience,
  education,
  certifications,
  projects,
  marquee: [
    'Node.js', 'TypeScript', 'GCP', 'PostgreSQL', 'Redis', 'Docker', 'Express 5', 'Judge0', 'MongoDB',
    'Prisma ORM', 'AWS EC2', 'AWS S3', 'GitHub Actions', 'React 19', 'Tailwind CSS', 'JWT', 'REST APIs', 'VAPT', 'Kali Linux',
  ],
  suggestedQuestions: [
    'Tell me about GiteaForge and how you built the Judge0 sandbox',
    'How did you implement HMAC webhook verification?',
    'What backend technologies do you specialize in?',
    'Tell me about your internship at AiLabs',
    'How does your hybrid Redis + PostgreSQL session architecture work?',
    'What is your educational background and CGPA?',
  ],
};

export type Profile = typeof profile;
