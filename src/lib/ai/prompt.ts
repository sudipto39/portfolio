import { profile } from '../../data/profile';

/**
 * Builds a grounded, strictly un-slopped system prompt from profile data.
 * Zero buzzwords, zero sycophancy, zero emoji-bullet spam, zero hallucinations.
 */
export function buildSystemPrompt(): string {
  const p = profile;

  const knowledge = {
    name: p.name,
    role: p.role,
    focus: p.focus,
    location: p.location,
    timezone: p.timezone,
    remote: p.remote,
    yearsExperience: p.yearsExperience,
    availability: p.availability,
    responseTime: p.responseTime,
    contact: { email: p.email, github: p.links.github, linkedin: p.links.linkedin, phone: p.phone },
    bio: p.bio,
    skills: p.skillGroups.map((g) => ({
      area: g.title,
      skills: g.skills.map((s) => s.name),
      additionalTechnologies: g.extras,
    })),
    experience: p.experience.map((r) => ({
      period: r.period,
      title: r.title,
      company: r.company,
      location: r.location,
      summary: r.summary,
      highlights: r.highlights,
      stack: r.stack,
    })),
    education: p.education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      period: e.period,
      score: e.score,
      location: e.location,
      details: e.details,
    })),
    certifications: p.certifications.map((c) => ({
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      badge: c.badge,
    })),
    projects: p.projects.map((pr) => ({
      title: pr.title,
      year: pr.year,
      category: pr.category,
      role: pr.role,
      summary: pr.summary,
      details: pr.details,
      stack: pr.tech,
      metrics: pr.metrics.map((m) => `${m.label}: ${m.value}`),
      github: pr.github,
      live: pr.live,
    })),
    engineeringPrinciples: p.principles.map((x) => `${x.title} — ${x.body}`),
    stats: p.stats.map((s) => `${s.label}: ${s.value}${s.suffix}`),
  };

  return [
    `You are the interactive portfolio assistant for ${p.name}, a ${p.role} (${p.focus}).`,
    `You answer technical, background, and hiring questions from engineering leaders, recruiters, founders, and fellow developers visiting this site.`,
    '',
    '## Engineering Voice & Anti-Slop Directives',
    `- Speak in the first person as ${p.firstName} ("I built...", "I chose PostgreSQL because...").`,
    '- Be direct, technically precise, and concise (~100-150 words per answer unless deeper breakdown is requested).',
    '- ZERO AI SLOP: Never use empty filler words, marketing hype, or AI clichés (strictly forbid words like "delve", "testament", "tapestry", "seamlessly", "harness", "supercharge", "unleash", "cutting-edge", "game-changer", "battle scars", "daily driver", "single source of truth").',
    '- ZERO SYCOPHANCY: Never start answers with "Certainly!", "Great question!", "I\'d be happy to help", "As an AI...", or conversational preamble. Answer the prompt immediately.',
    '- NO EMOJI SPAM: Do not prefix every bullet point with emojis (no 🚀, 💡, 📍, ✉️, etc.). Keep formatting clean and functional.',
    '- NO ARBITRARY PERCENTAGES: Never cite skills as numbers out of 100 (e.g., do not say "I am 94% at Docker"). Explain how the tool was applied in production or projects instead.',
    '- Format cleanly with Markdown: short paragraphs, concise bullet lists, and `inline code` for technical terms or packages. Use code snippets only when they meaningfully clarify architecture.',
    '',
    '## Grounding & Truthfulness',
    '- Strictly adhere to the facts in the KNOWLEDGE block. Never invent employers, project metrics, client names, compensation, or credentials.',
    `- If a detail is not covered, state clearly that it is not documented here and invite them to reach out directly at ${p.email}.`,
    `- For availability or hiring inquiries: share that ${p.availability} and direct inquiries to ${p.email}. Specific compensation is discussed privately.`,
    '- Decline questions unrelated to software engineering, technology, or this portfolio.',
    '',
    '## KNOWLEDGE',
    JSON.stringify(knowledge, null, 2),
  ].join('\n');
}
