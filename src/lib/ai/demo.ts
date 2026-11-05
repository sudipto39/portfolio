import { profile, type Project, type Role, type Skill, type SkillGroup } from '../../data/profile';

/**
 * Offline demo engine: deterministic intent matcher over profile and architecture data.
 * Zero network calls, zero tracking, fully private and grounded in verified facts.
 */

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function mentions(text: string, term: string): boolean {
  const strict = term.startsWith('=');
  const needle = strict ? term.slice(1) : term;
  return new RegExp(`(^|[^A-Za-z0-9])${escapeRe(needle)}(?=$|[^A-Za-z0-9])`, strict ? '' : 'i').test(text);
}

const mentionsAny = (text: string, terms: string[]) => terms.some((t) => mentions(text, t));
const normalize = (s: string) => s.replace(/^=/, '').toLowerCase();
const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

type GroupedSkill = Skill & { group: string };
const allSkills: GroupedSkill[] = profile.skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.title })));

function usesSkill(stack: string[], skill: Skill): boolean {
  const names = [skill.name, ...skill.aliases].map(normalize);
  return stack.some((tech) => {
    const t = tech.toLowerCase();
    return names.some((n) => t === n || (n.length > 3 && t.includes(n)) || (t.length > 3 && n.includes(t)));
  });
}

/* ------------------------------ answers ------------------------------ */

const greet = () =>
  `Hi, I'm **${profile.firstName}'s portfolio assistant**. Ask me about my **backend projects**, **system architecture**, **API contracts**, **tech stack**, or **experience**. What would you like to explore?`;

const aboutTwin = () =>
  [
    `I am an interactive assistant grounded directly on **${profile.firstName}'s** engineering projects, code designs, and verified resume.`,
    '- **Live mode:** Streams answers from **Google Gemini** or **Groq** directly to your browser with low latency.',
    '- **Offline mode:** Uses an on-device rule matcher over project schemas — zero network calls and completely private.',
  ].join('\n\n');

const availability = () =>
  [
    `**${profile.availability}**`,
    `- **Location:** ${profile.location} (${profile.timezone})\n- **Work mode:** ${profile.remote}\n- **Direct email:** [${profile.email}](mailto:${profile.email}) (${profile.responseTime.toLowerCase()})`,
    'Open to discussing engineering roles, project scope, and timelines over email or LinkedIn.',
  ].join('\n\n');

const contact = () =>
  [
    'You can reach me directly via:',
    `- **Email:** [${profile.email}](mailto:${profile.email}) (${profile.responseTime.toLowerCase()})\n- **LinkedIn:** [${host(profile.links.linkedin)}](${profile.links.linkedin})\n- **GitHub:** [${host(profile.links.github)}](${profile.links.github})\n- **Phone:** ${profile.phone}`,
    'Or use the contact form at the bottom of the contact page.',
  ].join('\n\n');

const projectDetail = (p: Project) =>
  [
    `### ${p.title} (${p.year})`,
    p.summary,
    `**Role:** ${p.role}`,
    `**Architecture & Implementation:**\n${p.details}`,
    `**Key Metrics & Verification:**\n${p.metrics.map((m) => `- ${m.label}: **${m.value}**`).join('\n')}`,
    `**Tech Stack:** ${p.tech.map((t) => `\`${t}\``).join(' · ')}`,
    p.github ? `Repository: [${host(p.github)}](${p.github})` : '',
    p.live ? `Deployment: [${host(p.live)}](${p.live})` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

const roleDetail = (r: Role) =>
  [
    `### ${r.title} — ${r.company}`,
    `*${r.period} · ${r.location}*`,
    r.summary,
    r.highlights.map((h) => `- ${h}`).join('\n'),
    `**Technologies:** ${r.stack.map((t) => `\`${t}\``).join(' · ')}`,
  ].join('\n\n');

const projectList = () =>
  [
    'Key backend and full-stack systems built by Sudipto:',
    profile.projects
      .map((p) => `- **${p.title}** (${p.year}) — ${p.summary} (*${p.metrics[0].label}: ${p.metrics[0].value}*)`)
      .join('\n'),
    'Ask about any project for its system design, database models, or security mechanisms.',
  ].join('\n\n');

function skillDetail(list: GroupedSkill[]): string {
  const parts = list.slice(0, 3).map((s) => {
    const projects = profile.projects.filter((p) => usesSkill(p.tech, s));
    const roles = profile.experience.filter((r) => usesSkill(r.stack, s));
    const lines = [`**${s.name}** (${s.group})`];
    if (projects.length) lines.push(`Projects:\n${projects.map((p) => `- **${p.title}**: ${p.summary}`).join('\n')}`);
    if (roles.length) lines.push(`Experience:\n${roles.map((r) => `- ${r.title} @ **${r.company}** (${r.period})`).join('\n')}`);
    return lines.join('\n\n');
  });
  return `${parts.join('\n\n---\n\n')}\n\nAsk about any of these for technical architecture details.`;
}

function groupDetail(g: SkillGroup): string {
  const related = profile.projects.filter((p) => g.skills.some((s) => usesSkill(p.tech, s)));
  return [
    `**${g.title}** — ${g.description}`,
    g.skills.map((s) => `- \`${s.name}\``).join('\n'),
    `Additional tools: ${g.extras.map((e) => `\`${e}\``).join(', ')}.`,
    related.length ? `Used in: ${related.map((p) => `**${p.title}**`).join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function skillsOverview(): string {
  const groups = profile.skillGroups
    .map((g) => {
      const top = g.skills.slice(0, 4).map((s) => `\`${s.name}\``).join(', ');
      return `- **${g.title}:** ${top}`;
    })
    .join('\n');
  return [
    'Core engineering stack: **Node.js, Express 5, TypeScript, PostgreSQL (Neon), and Redis**, containerized with **Docker** and deployed on **GCP Cloud Run**.',
    groups,
    'Key specialties include RESTful API engineering, HMAC-SHA256 webhook ingestion, and sandboxed code execution environments (Judge0).',
  ].join('\n\n');
}

const experienceAnswer = () =>
  [
    `Production and internship experience:`,
    profile.experience.map((r) => `- **${r.period}** — ${r.title} @ **${r.company}**: ${r.summary}`).join('\n'),
    'Ask about any role to review technical contributions, APIs delivered, or security tooling.',
  ].join('\n\n');

const educationAnswer = () =>
  [
    `**Academic Background:**`,
    ...profile.education.map(
      (e) =>
        `- **${e.degree}** — **${e.institution}** (${e.period})\n  ${e.score ? `Result: **${e.score}** · ` : ''}Location: ${e.location}\n  ${e.details}`
    ),
    'Coursework covers cybersecurity, network defense, data structures, algorithms, and cloud systems.',
  ].join('\n\n');

const certificationsAnswer = () =>
  [
    `**Certifications & Credentials:**`,
    ...profile.certifications.map(
      (c) => `- **${c.title}** — issued by **${c.issuer}** (${c.date})${c.badge ? ` (${c.badge})` : ''}`
    ),
    `Full resume available for download: [Download Resume PDF](${profile.resumeUrl}).`,
  ].join('\n\n');

const resumeAnswer = () =>
  [
    `**Resume Download & Highlights:**`,
    `Download the verified resume: **[${profile.resumeFilename}](${profile.resumeUrl})**`,
    `Summary:`,
    `- **Education:** B.Tech in CSE (Cybersecurity Specialization) @ The Neotia University (CGPA: 7.85 till 6th Sem)`,
    `- **Experience:** Backend Intern @ AiLabs (25+ REST APIs for ShopXpress) & Cybersecurity Intern @ Dataspace Academy (VAPT)`,
    `- **Flagship Project:** GiteaForge (129 REST APIs, Judge0 sandbox VM, HMAC-SHA256 webhooks, Redis + Postgres hybrid session)`,
    `- **Contact:** [${profile.email}](mailto:${profile.email}) · Phone: ${profile.phone}`,
  ].join('\n\n');

const principlesAnswer = () =>
  [
    'Engineering approach & design principles:',
    profile.principles.map((p) => `- **${p.title}:** ${p.body}`).join('\n'),
    'In practice: well-modeled relational schemas, strict API contracts with Zod validation, defensive error handling, and security-first defaults.',
  ].join('\n\n');

const locationAnswer = () => `Based in **${profile.location}** (${profile.timezone}). ${profile.remote}.`;

const thanks = () => 'Glad I could help. Let me know if you would like to inspect any other architecture details, API contracts, or project schemas.';

const fallback = () =>
  [
    'In offline mode, responses are generated locally from verified project schemas and profile data. I can answer questions about:',
    `- **Projects:** GiteaForge (Judge0 sandbox, HMAC webhooks), ShopXpress, CloudSec VAPT Suite\n- **Stack:** Node.js, Express 5, TypeScript, PostgreSQL, Redis, Docker, GCP Cloud Run\n- **Experience:** AiLabs backend internship, Dataspace Academy VAPT internship\n- **Credentials:** Degree, certifications, and resume download`,
    `To ask open-ended questions, switch to **Google Gemini** or **Groq** using the engine selector, or contact Sudipto directly at [${profile.email}](mailto:${profile.email}).`,
  ].join('\n\n');

/* ------------------------------ router ------------------------------ */

function findProject(q: string): Project | undefined {
  const lower = q.toLowerCase();
  return (
    profile.projects.find((p) => lower.includes(p.title.toLowerCase())) ??
    profile.projects.find((p) => mentionsAny(q, p.keywords))
  );
}

export function answerLocally(input: string): string {
  const q = input.trim();
  if (!q) return fallback();

  if (q.length < 40 && /^(hi|hello|hey|yo|hiya|hola|good (morning|afternoon|evening))\b/i.test(q)) return greet();
  if (mentionsAny(q, ['who are you', 'are you ai', 'are you an ai', 'are you a bot', 'are you real', 'what model', 'which model', 'gemini', 'groq', 'how do you work', 'ai twin', 'llm'])) return aboutTwin();

  if (mentionsAny(q, ['resume', 'cv', 'download resume', 'pdf'])) return resumeAnswer();
  if (mentionsAny(q, ['education', 'college', 'university', 'degree', 'cgpa', 'school', 'marks', 'academic', 'studies', 'study', 'btech', 'b.tech', 'neotia', 'ritam'])) return educationAnswer();
  if (mentionsAny(q, ['certification', 'certifications', 'certificate', 'certificates', 'course', 'bootcamp', 'ncc', 'angela yu', 'udemy'])) return certificationsAnswer();

  const project = findProject(q);
  if (project) return projectDetail(project);

  const role = profile.experience.find((r) => mentions(q, r.company) || mentions(q, r.company.split(' ')[0]));
  if (role) return roleDetail(role);

  if (mentionsAny(q, ['hire', 'hiring', 'available', 'availability', 'open to', 'freelance', 'contractor', 'consulting', 'consult', 'rates', 'salary', 'job', 'jobs', 'roles', 'position', 'work together', 'work with you', 'opportunity', 'recruiter', 'fresher'])) return availability();
  if (mentionsAny(q, ['contact', 'email', 'reach you', 'get in touch', 'linkedin', 'github', 'phone', 'call', 'mobile'])) return contact();

  const group = profile.skillGroups.find((g) => q.toLowerCase().includes(g.title.toLowerCase()));
  if (group) return groupDetail(group);

  // Short names like "Go" or "C" only match case-sensitively, so "how do you go about…" doesn't trigger them.
  const skills = allSkills.filter((s) => mentionsAny(q, [s.name.length <= 3 ? `=${s.name}` : s.name, ...s.aliases]));
  if (skills.length) return skillDetail(skills);

  if (mentionsAny(q, ['projects', 'project', 'portfolio', 'built', 'shipped', 'proud', 'case study', 'case studies', 'work samples'])) return projectList();
  if (mentionsAny(q, ['stack', 'skills', 'skill', 'tech', 'technologies', 'languages', 'language', 'tools', 'strongest', 'best at', 'expertise', 'proficient'])) return skillsOverview();
  if (mentionsAny(q, ['experience', 'career', 'background', 'worked', 'where did you work', 'work history', 'companies', 'employer', 'years', 'journey', 'internship', 'intern', 'previous'])) return experienceAnswer();
  if (mentionsAny(q, ['design', 'architecture', 'architect', 'approach', 'philosophy', 'principles', 'scale', 'scaling', 'scalable', 'reliability', 'reliable', 'best practices', 'microservices', 'monolith'])) return principlesAnswer();
  if (mentionsAny(q, ['where', 'location', 'located', 'based', 'timezone', 'time zone', 'remote', 'relocate', 'relocation', 'kolkata'])) return locationAnswer();
  if (q.length < 30 && mentionsAny(q, ['thanks', 'thank you', 'thx', 'cheers', 'awesome', 'great', 'cool', 'nice'])) return thanks();

  return fallback();
}

/* --------------------------- fake streaming --------------------------- */

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export async function streamDemo(question: string, opts: { signal: AbortSignal; onText: (delta: string) => void }) {
  const answer = answerLocally(question);
  await sleep(350 + Math.random() * 300, opts.signal);
  const tokens = answer.match(/\s+|[^\s]+/g) ?? [answer];
  for (let i = 0; i < tokens.length; i += 3) {
    opts.onText(tokens.slice(i, i + 3).join(''));
    await sleep(12 + Math.random() * 20, opts.signal);
  }
}
