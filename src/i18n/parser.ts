export type Language = 'pt' | 'en' | 'es';

export type TranslationsMap = Record<string, Record<Language, string>>;

/**
 * Parser leve para o arquivo translations.md
 * Formato suportado:
 * 
 * ### [secao.chave]
 * pt: Texto em português
 * en: Text in English
 * es: Texto en español
 */
export function parseMarkdownTranslations(rawMarkdown: string): TranslationsMap {
  const translations: TranslationsMap = {};
  if (!rawMarkdown) return translations;

  const lines = rawMarkdown.split(/\r?\n/);
  let currentKey: string | null = null;
  let currentLang: Language | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Identifica cabeçalho de chave: ### [secao.chave] ou ## [chave]
    const headerMatch = trimmed.match(/^#{1,4}\s*\[([^\]]+)\]/);
    if (headerMatch) {
      currentKey = headerMatch[1].trim();
      currentLang = null;
      if (!translations[currentKey]) {
        translations[currentKey] = { pt: '', en: '', es: '' };
      }
      continue;
    }

    if (!currentKey) continue;

    // Identifica linha de idioma: pt:, en:, es:
    const langMatch = rawLine.match(/^\s*(pt|en|es)\s*:\s*(.*)$/i);
    if (langMatch) {
      currentLang = langMatch[1].toLowerCase() as Language;
      translations[currentKey][currentLang] = langMatch[2].trim();
      continue;
    }

    // Suporte a continuação de texto em múltiplas linhas
    if (currentLang && trimmed !== '' && !trimmed.startsWith('#')) {
      const existing = translations[currentKey][currentLang];
      translations[currentKey][currentLang] = existing 
        ? `${existing}\n${trimmed}` 
        : trimmed;
    }
  }

  return translations;
}
