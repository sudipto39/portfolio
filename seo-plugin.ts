import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { allRoutes, canonicalUrl, seoTags, SITE_URL } from "./src/data/seo";

const escapeAttr = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Rewrite the data-seo tagged elements + <title> of an HTML string. */
function applyMeta(html: string, meta: (typeof allRoutes)[number]): string {
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(meta.title)}</title>`);
  for (const [key, { attr, value }] of Object.entries(seoTags(meta))) {
    const tag = new RegExp(`<(meta|link)\\b[^>]*data-seo="${key}"[^>]*>`, "g");
    out = out.replace(tag, (match) =>
      match.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${escapeAttr(value)}"`),
    );
  }
  return out;
}

/**
 * After the build: writes a prerendered index.html per route (so crawlers and
 * social scrapers that don't run JS get correct meta), plus sitemap.xml and
 * a 404.html fallback. Works with vite-plugin-singlefile output.
 */
export function seoPrerender(): Plugin {
  let outDir = "dist";
  return {
    name: "seo-prerender",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle: {
      order: "post",
      handler() {
        const indexPath = path.join(outDir, "index.html");
        if (!fs.existsSync(indexPath)) return;
        const template = fs.readFileSync(indexPath, "utf8");

        for (const route of allRoutes) {
          const html = applyMeta(template, route);
          if (route.path === "/") {
            fs.writeFileSync(indexPath, html);
          } else {
            const dir = path.join(outDir, route.path);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, "index.html"), html);
          }
        }

        const today = new Date().toISOString().slice(0, 10);
        const urls = allRoutes
          .filter((r) => r.indexable)
          .map(
            (r) =>
              `  <url>\n    <loc>${canonicalUrl(r.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`,
          )
          .join("\n");
        fs.writeFileSync(
          path.join(outDir, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        );

        // SPA fallback (GitHub Pages et al.) — noindex so it never ranks.
        fs.writeFileSync(
          path.join(outDir, "404.html"),
          applyMeta(template, {
            path: "/404",
            title: "Page not found — Sudipto Gayen",
            description: "The page you are looking for does not exist.",
            indexable: false,
            priority: 0,
          }),
        );
        console.log(`\n[seo-prerender] ${allRoutes.length} routes prerendered → ${SITE_URL}/sitemap.xml`);
      },
    },
  };
}
