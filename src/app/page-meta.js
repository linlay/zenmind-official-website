import { useEffect } from 'react';
import { languages, siteUrl } from '../content';
import { pathFor } from '../shared/routing';

export function usePageMeta(lang, key) {
  useEffect(() => {
    const data = languages[lang];
    const suffix = key === 'home' ? '' : ` | ${data.nav[key]}`;
    document.documentElement.lang = data.code;
    document.title = `${data.seo.title}${suffix}`;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', data.seo.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', document.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', data.seo.description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', key === 'home' ? data.seo.url : `${siteUrl}${pathFor(lang, key)}`);
    }
  }, [key, lang]);
}
