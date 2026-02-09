/**
 * Schema markup utilities for language-aware JSON-LD
 * FASE 4.5: i18n-aware structured data
 */
import i18n from '@/i18n';

/**
 * Get current language for schema markup
 */
export function getSchemaLang(): string {
  return i18n.language === 'en' ? 'en' : 'es';
}

/**
 * Return text conditional on current language
 * @param esText Spanish text (default)
 * @param enText English text
 */
export function localizedSchema(esText: string, enText: string): string {
  return i18n.language === 'en' ? enText : esText;
}
