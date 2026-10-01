import {
  siDocker,
  siGithubactions,
  siLinux,
  siMongodb,
  siNodedotjs,
  siPostgresql,
  siPython,
  siRedis,
  siTypescript,
  siJavascript,
  siReact,
  siGooglecloud,
  siGit,
  siPostman,
  siJest,
  siPrisma,
  siTailwindcss,
  siVite,
  siBurpsuite,
  siNginx,
  type SimpleIcon,
} from 'simple-icons';
import { profile, type SkillGroup } from './profile';

export type StackGroup = SkillGroup['id'];

export interface BrandIcon {
  path: string;
  /** Brand colour, lightened when too dark to read on the espresso background. */
  color: string;
}

export interface StackTech {
  id: string;
  name: string;
  group: StackGroup;
  level: number;
  icon: BrandIcon;
  blurb: string;
  /** Terms matched against project/role stacks for the "used in" list. */
  match: string[];
}

export interface OrbitTech {
  id: string;
  name: string;
  path: string;
}

const awsBrandIcon: BrandIcon = {
  path: 'M6.55 16.5c1.92.93 4.22 1.45 6.64 1.45 3.75 0 7.08-1.25 9.58-3.34.3-.25.54-.02.32.25-2.6 3.09-6.38 4.77-10.47 4.77-2.67 0-5.18-.73-7.3-2.03-.33-.2-.14-.54.23-.6zm16.51-1.35c-.4-.49-1.92-.23-2.64-.13-.22.03-.26-.14-.06-.28 1.3-1 2.37-1.12 2.76-.64.39.48-.05 1.76-1.16 2.65-.18.14-.32.06-.23-.13.3-.6.64-1.2.33-1.47zM11.9 4.38h2.38l-4.1 11.23h-2.1L4 4.38h2.44l2.84 8.52 2.62-8.52zm5.72 11.23l-3.2-11.23h2.37l2.08 8.44 2.22-8.44h2.2l-3.33 11.23h-2.34z',
  color: '#FF9900',
};

function brand(icon: SimpleIcon): BrandIcon {
  const hex = icon.hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return { path: icon.path, color: lum < 0.22 ? '#f4ece3' : `#${hex}` };
}

/** Skill levels come from profile.ts so the whole site (and the AI twin) stays consistent. */
function levelOf(skillName: string): number {
  for (const g of profile.skillGroups) {
    const s = g.skills.find((x) => x.name.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(x.name.toLowerCase()));
    if (s) return s.level;
  }
  return 88;
}

export const STACK_GROUPS: { id: StackGroup; label: string; short: string }[] = [
  { id: 'backend', label: 'Languages & Frontend/APIs', short: 'Backend' },
  { id: 'data', label: 'Database & Caching', short: 'Data' },
  { id: 'platform', label: 'Cloud & DevOps', short: 'Platform' },
];

export const coreStack: StackTech[] = [
  // --- Row 1: Languages, Frontend & Data (7 items) ---
  {
    id: 'node',
    name: 'Node.js & Express.js',
    group: 'backend',
    level: levelOf('Node.js & Express.js'),
    icon: brand(siNodedotjs),
    blurb: 'Primary backend platform. Built 129 RESTful APIs for GiteaForge LMS across 14 modules and 25+ APIs for ShopXpress at AiLabs.',
    match: ['node.js', 'node', 'express', 'express.js', 'express 5'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    group: 'backend',
    level: levelOf('TypeScript'),
    icon: brand(siTypescript),
    blurb: 'Type-safe contracts across full-stack applications, Zod runtime validation schemas, and Prisma ORM models with compile-time verification.',
    match: ['typescript', 'ts'],
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    group: 'backend',
    level: levelOf('JavaScript'),
    icon: brand(siJavascript),
    blurb: 'Modern asynchronous JavaScript (ES6+), Promises, async/await, closures, event-driven I/O, and DOM/component architecture.',
    match: ['javascript', 'js', 'es6'],
  },
  {
    id: 'react',
    name: 'React 19',
    group: 'backend',
    level: levelOf('React'),
    icon: brand(siReact),
    blurb: 'Modern client-side application architecture, React 19 hooks, state management, responsive Tailwind UI, and smooth Framer Motion transitions.',
    match: ['react', 'react 19', 'react.js'],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL (Neon)',
    group: 'data',
    level: levelOf('PostgreSQL'),
    icon: brand(siPostgresql),
    blurb: 'Primary relational database. Automated schema migrations with Prisma, relational modeling, and serverless database branching on Neon.',
    match: ['postgresql', 'postgres', 'neon'],
  },
  {
    id: 'redis',
    name: 'Redis',
    group: 'data',
    level: levelOf('Redis'),
    icon: brand(siRedis),
    blurb: 'In-memory caching, token verification, worker queue coordination for asynchronous Judge0 sandboxes, and PostgreSQL fallback sessions.',
    match: ['redis'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    group: 'data',
    level: levelOf('MongoDB'),
    icon: brand(siMongodb),
    blurb: 'NoSQL document store for high-velocity catalogs, e-commerce shopping carts, and dynamic metadata at AiLabs and ShopXpress.',
    match: ['mongodb', 'mongo', 'mongoose'],
  },

  // --- Row 2: Cloud, DevOps, Tools & Systems (7 items) ---
  {
    id: 'docker',
    name: 'Docker',
    group: 'platform',
    level: levelOf('Docker'),
    icon: brand(siDocker),
    blurb: 'Containerized Express 5 services, isolated multi-language code evaluation sandboxes, and reproducible environments across development and GCP.',
    match: ['docker'],
  },
  {
    id: 'gcp',
    name: 'Google Cloud (GCP)',
    group: 'platform',
    level: levelOf('GCP'),
    icon: brand(siGooglecloud),
    blurb: 'GCP Cloud Run containerized service deployments, Compute Engine VM hosting Judge0 code execution engines, and Google Artifact Registry.',
    match: ['gcp', 'google cloud', 'cloud run', 'compute engine'],
  },
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    group: 'platform',
    level: levelOf('AWS'),
    icon: awsBrandIcon,
    blurb: 'AWS S3 presigned URLs with 1-hour expiration for secure artifact distribution, EC2 compute instances, and IAM access controls.',
    match: ['aws', 's3', 'ec2', 'amazon web services'],
  },
  {
    id: 'githubactions',
    name: 'GitHub Actions',
    group: 'platform',
    level: levelOf('GitHub Actions'),
    icon: brand(siGithubactions),
    blurb: 'Automated CI/CD pipelines compiling containers, running Jest test suites, pushing to Google Artifact Registry, and deploying to Cloud Run.',
    match: ['github actions', 'ci/cd'],
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    group: 'platform',
    level: levelOf('Git & GitHub'),
    icon: brand(siGit),
    blurb: 'Distributed version control, branch management, merge conflict resolution, HMAC-SHA256 Git webhook triggers, and automated repository sync.',
    match: ['git', 'github', 'version control', 'gitea'],
  },
  {
    id: 'linux',
    name: 'Linux & Kali Linux',
    group: 'platform',
    level: levelOf('Linux'),
    icon: brand(siLinux),
    blurb: 'Linux server administration on GCP Compute Engine VMs and penetration testing (VAPT) workflows using Kali Linux and Burp Suite.',
    match: ['linux', 'kali linux', 'burp suite', 'vapt'],
  },
  {
    id: 'python',
    name: 'Python',
    group: 'backend',
    level: levelOf('Python'),
    icon: brand(siPython),
    blurb: 'Scripting, security automation, and sandboxed execution environments for algorithms and competitive coding.',
    match: ['python'],
  },
];

export const orbitStack: OrbitTech[] = [
  siPrisma,
  siTailwindcss,
  siPostman,
  siJest,
  siVite,
  siBurpsuite,
  siNginx,
].map((i) => ({ id: i.slug, name: i.title, path: i.path }));

/** Projects and roles that list the technology. */
export function usedIn(tech: StackTech): string[] {
  const hits = (stack: string[]) => stack.some((s) => tech.match.includes(s.toLowerCase()));
  return [
    ...profile.projects.filter((p) => hits(p.tech)).map((p) => p.title),
    ...profile.experience.filter((r) => hits(r.stack)).map((r) => r.company),
  ];
}
