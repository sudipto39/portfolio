/**
 * SEO metadata — shared by the runtime (<RouteSeo />) and the build-time
 * prerender plugin (seo-plugin.ts), so crawlers and browsers see the same tags.
 */
import { profile } from './profile';

/** Canonical production origin (no trailing slash). */
export const SITE_URL = 'https://sudiptogayen.com';
export const SITE_NAME = 'Sudipto Gayen';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface RouteMeta {
  /** Canonical pathname, e.g. "/projects/giteaforge". */
  path: string;
  title: string;
  description: string;
  /** Whether the route belongs in the sitemap / may be indexed. */
  indexable: boolean;
  /** Sitemap priority (0–1). */
  priority: number;
}

const staticRoutes: RouteMeta[] = [
  {
    path: '/',
    title: 'Sudipto Gayen — Backend & Full-Stack Developer · Cloud-Native Systems',
    description:
      'Backend and full-stack developer with production experience building cloud-native systems using Node.js, TypeScript, and GCP. Built GiteaForge and ShopXpress.',
    indexable: true,
    priority: 1.0,
  },
  {
    path: '/about',
    title: 'About — Sudipto Gayen',
    description:
      'B.Tech CSE (Cybersecurity) student and backend developer. Internships at AiLabs and Dataspace Academy, building secure, cloud-native Node.js and TypeScript systems.',
    indexable: true,
    priority: 0.8,
  },
  {
    path: '/projects',
    title: 'Projects — Sudipto Gayen',
    description:
      'Selected backend and full-stack projects: GiteaForge (129 REST APIs), ShopXpress e-commerce, a Judge0 code sandbox, HMAC webhook pipelines and VAPT security audits.',
    indexable: true,
    priority: 0.9,
  },
  {
    path: '/stack',
    title: 'Tech Stack — Sudipto Gayen',
    description:
      'Node.js, TypeScript, Express, PostgreSQL, Redis, Docker, GCP, AWS and React — the tools Sudipto Gayen uses to ship production backend systems.',
    indexable: true,
    priority: 0.7,
  },
  {
    path: '/experience',
    title: 'Experience & Education — Sudipto Gayen',
    description:
      'Backend engineering internship at AiLabs, cybersecurity internship at Dataspace Academy, and B.Tech CSE (Cybersecurity) at The Neotia University.',
    indexable: true,
    priority: 0.7,
  },
  {
    path: '/ai-twin',
    title: 'AI Twin — Ask Sudipto Gayen Anything',
    description:
      "Chat with Sudipto's AI twin to learn about his projects, backend architecture decisions, skills and experience.",
    indexable: true,
    priority: 0.5,
  },
  {
    path: '/contact',
    title: 'Contact — Sudipto Gayen',
    description:
      'Get in touch with Sudipto Gayen about backend, full-stack and cloud-native engineering roles. Usually replies within a few hours.',
    indexable: true,
    priority: 0.6,
  },
];

const projectRoutes: RouteMeta[] = profile.projects.map((p) => ({
  path: `/projects/${p.id}`,
  title: `${p.title.split(' — ')[0]} — Project by Sudipto Gayen`,
  description: p.summary.length > 158 ? `${p.summary.slice(0, 155).trimEnd()}…` : p.summary,
  indexable: true,
  priority: p.featured ? 0.8 : 0.6,
}));

export const allRoutes: RouteMeta[] = [...staticRoutes, ...projectRoutes];

export const notFoundMeta: RouteMeta = {
  path: '/404',
  title: 'Page not found — Sudipto Gayen',
  description: 'The page you are looking for does not exist.',
  indexable: false,
  priority: 0,
};

const normalize = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

/** Resolve metadata for a pathname; unknown paths fall back to the 404 meta. */
export function getRouteMeta(pathname: string): RouteMeta {
  const path = normalize(pathname);
  return allRoutes.find((r) => r.path === path) ?? notFoundMeta;
}

export const canonicalUrl = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;

/**
 * Tag values keyed by the `data-seo` attribute used in index.html.
 * `attr` is the attribute holding the value ("content" or "href").
 */
export function seoTags(meta: RouteMeta): Record<string, { attr: 'content' | 'href'; value: string }> {
  const url = canonicalUrl(meta.path);
  return {
    description: { attr: 'content', value: meta.description },
    robots: { attr: 'content', value: meta.indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow' },
    canonical: { attr: 'href', value: url },
    'og:title': { attr: 'content', value: meta.title },
    'og:description': { attr: 'content', value: meta.description },
    'og:url': { attr: 'content', value: url },
    'twitter:title': { attr: 'content', value: meta.title },
    'twitter:description': { attr: 'content', value: meta.description },
  };
}
