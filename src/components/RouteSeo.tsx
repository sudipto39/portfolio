import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta, seoTags } from '../data/seo';

/**
 * Keeps <title> and the data-seo tagged <meta>/<link> elements in index.html
 * in sync with the current route (the build step prerenders the same values).
 */
export function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(pathname);
    document.title = meta.title;
    for (const [key, { attr, value }] of Object.entries(seoTags(meta))) {
      document.head.querySelector(`[data-seo="${key}"]`)?.setAttribute(attr, value);
    }
  }, [pathname]);

  return null;
}
