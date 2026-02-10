/**
 * usePageMeta - Lightweight per-page meta tags (no react-helmet needed)
 * FASE 4.5: Dynamic SEO meta tags with i18n support
 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PageMetaOptions {
  titleKey: string;
  descriptionKey: string;
  ns?: string;
  path?: string;
}

function setMeta(property: string, content: string): void {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function usePageMeta({ titleKey, descriptionKey, ns = 'common', path }: PageMetaOptions): void {
  const { t, i18n } = useTranslation(ns);

  useEffect(() => {
    const title = t(titleKey);
    const description = t(descriptionKey);
    const lang = i18n.language;

    // Page title
    document.title = `${title} | INNATE.data`;

    // HTML lang attribute
    document.documentElement.lang = lang;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Open Graph tags
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:url', `https://alexseis.com${path || ''}`);
    setMeta('og:locale', lang === 'en' ? 'en_US' : 'es_ES');

    // Cleanup
    return () => {
      document.title = 'INNATE.data - Intelligence Born from Your Data';
    };
  }, [t, i18n.language, titleKey, descriptionKey, path]);
}
