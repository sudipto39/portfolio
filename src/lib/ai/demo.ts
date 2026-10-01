import { profile, type Project, type Role, type Skill, type SkillGroup } from '../../data/profile';

/**
 * Offline "demo mode": a tiny intent engine over the profile data.
 * Zero network, zero keys — so the AI twin works for every visitor.
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

function levelWord(level: number): string {
  if (level >= 92) return 'a daily driver — expert level';
  if (level >= 85) return 'an advanced, production-hardened skill';
  if (level >= 75) return 'a strong skill I use regularly';
  return 'solid working knowledge';
}

/* ------------------------------ answers ------------------------------ */

const greet = () =>
  `Hey! 👋 I'm **${profile.firstName}'s AI twin**. Ask me about my **projects**, **stack**, **experience** or **availability** — what would you like to know?`;

const aboutTwin = () =>
  [
    `I'm **${profile.firstName}'s AI twin** — an assistant grounded on the same data that renders this portfolio.`,
    '- **Live mode** streams answers from **Claude** (Anthropic) or **DeepSeek**, called straight from your browser.',
    '- **Demo mode** — what you’re using now — is a tiny on-device intent engine: instant and private, but it only knows a few topics.',
    'Open **AI settings** (the model pill at the top of this chat) to connect a provider with your own key.',
  ].join('\n\n');

const availability = () =>
  [
    `**${profile.availability}.**`,
    `- 📍 ${profile.location} (${profile.timezone})\n- 🌍 ${profile.remote}\n- ✉️ [${profile.email}](mailto:${profile.email}) — ${profile.responseTime.toLowerCase()}`,
    'Rates depend on scope, so I discuss them privately — send me a short note about the problem you’re solving.',
  ].join('\n\n');

const contact = () =>
  [
    'Here’s how to reach me:',
    `- ✉️ **Email:** [${profile.email}](mailto:${profile.email}) — ${profile.responseTime.toLowerCase()}\n- 💼 **LinkedIn:** [${host(profile.links.linkedin)}](${profile.links.linkedin})\n- 🐙 **GitHub:** [${host(profile.links.github)}](${profile.links.github})`,
    'Or use the contact form at the bottom of this page.',
  ].join('\n\n');

const projectDetail = (p: Project) =>
  [
    `### ${p.title} · ${p.year}`,
    p.summary,
    `**My role:** ${p.role}`,
    `**How it works:** ${p.details}`,
    `**Impact**\n${p.metrics.map((m) => `- ${m.label}: **${m.value}**`).join('\n')}`,
    `**Stack:** ${p.tech.map((t) => `\`${t}\``).join(' · ')}`,
    p.github ? `Code: [${host(p.github)}](${p.github})` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

const roleDetail = (r: Role) =>
  [
    `### ${r.title} @ ${r.company}`,
    `_${r.period} · ${r.location}_`,
    r.summary,
    r.highlights.map((h) => `- ${h}`).join('\n'),
    `**Stack:** ${r.stack.map((t) => `\`${t}\``).join(' · ')}`,
  ].join('\n\n');

const projectList = () =>
  [
    'A few systems I’m proud of:',
    profile.projects
      .map((p) => `- **${p.title}** (${p.year}) — ${p.summary} _${p.metrics[0].label}: ${p.metrics[0].value}_`)
      .join('\n'),
    'Ask me about any of them for the architecture deep-dive.',
  ].join('\n\n');

function skillDetail(list: GroupedSkill[]): string {
  const parts = list.slice(0, 3).map((s) => {
    const projects = profile.projects.filter((p) => usesSkill(p.tech, s));
    const roles = profile.experience.filter((r) => usesSkill(r.stack, s));
    const lines = [`**${s.name}** is ${levelWord(s.level)} (**${s.level}/100**, ${s.group}).`];
    if (projects.length) lines.push(`Projects:\n${projects.map((p) => `- **${p.title}** — ${p.summary}`).join('\n')}`);
    if (roles.length) lines.push(`Roles:\n${roles.map((r) => `- ${r.title} @ **${r.company}** (${r.period})`).join('\n')}`);
    return lines.join('\n\n');
  });
  return `${parts.join('\n\n---\n\n')}\n\nWant details on any of these? Just ask.`;
}

function groupDetail(g: SkillGroup): string {
  const related = profile.projects.filter((p) => g.skills.some((s) => usesSkill(p.tech, s)));
  return [
    `**${g.title}** — ${g.description}`,
    [...g.skills]
      .sort((a, b) => b.level - a.level)
      .map((s) => `- \`${s.name}\` — **${s.level}/100**, ${levelWord(s.level)}`)
      .join('\n'),
    `Also comfortable with ${g.extras.map((e) => `\`${e}\``).join(', ')}.`,
    related.length ? `Where it shows up: ${related.map((p) => `**${p.title}**`).join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function skillsOverview(): string {
  const groups = profile.skillGroups
    .map((g) => {
      const top = [...g.skills]
        .sort((a, b) => b.level - a.level)
        .slice(0, 4)
        .map((s) => `\`${s.name}\``)
        .join(', ');
      return `- **${g.title}:** ${top}`;
    })
    .join('\n');
  return [
    'My core stack is **Node.js & Express 5, TypeScript, PostgreSQL (Neon), and Redis**, containerized with **Docker** and deployed on **GCP Cloud Run**.',
    groups,
    'I specialize in secure RESTful APIs, HMAC-verified webhook pipelines, and sandboxed code execution environments like Judge0.',
  ].join('\n\n');
}

const experienceAnswer = () =>
  [
    `I am an early-career backend and full-stack developer with real-world production internship experience:`,
    profile.experience.map((r) => `- **${r.period}** — ${r.title} @ **${r.company}**: ${r.summary}`).join('\n'),
    'Ask me about any role for the technical highlights, APIs built, or security tooling used.',
  ].join('\n\n');

const educationAnswer = () =>
  [
    `Here is my **academic background**:`,
    ...profile.education.map(
      (e) =>
        `- 🎓 **${e.degree}** @ **${e.institution}** (${e.period})\n  - ${e.score ? `**${e.score}** · ` : ''}📍 ${e.location}\n  - ${e.details}`
    ),
    'Feel free to ask about my cybersecurity coursework, algorithms, or technical focus.',
  ].join('\n\n');

const certificationsAnswer = () =>
  [
    `Here are my **certifications & credentials**:`,
    ...profile.certifications.map(
      (c) => `- 📜 **${c.title}** — issued by **${c.issuer}** (${c.date})${c.badge ? ` [${c.badge}]` : ''}`
    ),
    `You can also download my full resume: [Download Resume PDF](${profile.resumeUrl}).`,
  ].join('\n\n');

const resumeAnswer = () =>
  [
    `📄 **Download My Resume**:`,
    `You can download my updated resume directly here: **[${profile.resumeFilename}](${profile.resumeUrl})**`,
    `Key highlights:`,
    `- **Education**: B.Tech in CSE (Cybersecurity) @ The Neotia University (CGPA: 7.78 till 5th Sem)`,
    `- **Industry Experience**: Backend Intern @ AiLabs (25+ production REST APIs) & Cybersecurity Intern @ Dataspace Academy (VAPT)`,
    `- **Flagship Project**: GiteaForge (GCP Cloud Run, Judge0 sandbox VM, HMAC-SHA256 webhooks, Redis + Postgres hybrid session)`,
    `- **Email**: [${profile.email}](mailto:${profile.email}) · **Phone**: ${profile.phone}`,
  ].join('\n\n');

const principlesAnswer = () =>
  [
    'How I approach system design:',
    profile.principles.map((p) => `- **${p.title}** — ${p.body}`).join('\n'),
    'In practice: start with a well-modelled PostgreSQL schema, clear API contracts with Zod & Postman, strict security audits — then optimize latencies.',
  ].join('\n\n');

const locationAnswer = () => `I'm based in **${profile.location}** (${profile.timezone}). ${profile.remote}.`;

const thanks = () => 'Anytime! 🙌 Anything else — maybe a deep-dive into GiteaForge or my backend stack?';

const fallback = () =>
  [
    'I don’t have a canned answer for that in **offline demo mode**. I can tell you about:',
    `- my **projects** — e.g. GiteaForge (Judge0 sandbox, HMAC webhooks), ShopXpress, CloudSec VAPT Suite\n- my **stack** — Node.js, Express, TypeScript, PostgreSQL, Redis, Docker, GCP Cloud Run…\n- my **experience & internships** — AiLabs, Dataspace Academy\n- my **education & credentials** — The Neotia University (CGPA 7.78), Udemy Bootcamp, VAPT\n- my **resume** — download PDF`,
    `For free-form questions, connect **DeepSeek** or **Claude** in AI settings — or email [${profile.email}](mailto:${profile.email}).`,
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
  if (mentionsAny(q, ['who are you', 'are you ai', 'are you an ai', 'are you a bot', 'are you real', 'what model', 'which model', 'deepseek', 'claude', 'how do you work', 'ai twin', 'llm'])) return aboutTwin();

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
