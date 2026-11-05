import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import rawTranslations from '../translations.md?raw';
import { parseMarkdownTranslations, Language, TranslationsMap } from './parser';

export type { Language };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  translations: TranslationsMap;
  getWhatsAppUrl: (phone?: string, messageKey?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'nortyn_language';

const VALID_LANGUAGES: Language[] = ['pt', 'en', 'es'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && VALID_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch (e) {
      // LocalStorage pode estar desabilitado em modo anônimo estrito
    }
    return 'pt';
  });

  // Parser com suporte a HMR via import do arquivo .md?raw
  const translations = useMemo(() => {
    return parseMarkdownTranslations(rawTranslations);
  }, [rawTranslations]);

  // Atualiza preferência no localStorage e <html lang="...">
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {
      // ignore
    }

    const htmlLang = language === 'pt' ? 'pt-BR' : language;
    document.documentElement.lang = htmlLang;
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (VALID_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
    }
  };

  /**
   * Função de tradução com fallback seguro
   */
  const t = (key: string, fallback?: string): string => {
    const entry = translations[key];
    if (entry && entry[language] && entry[language].trim() !== '') {
      return entry[language];
    }
    if (entry && entry['pt'] && entry['pt'].trim() !== '') {
      return entry['pt'];
    }
    return fallback !== undefined ? fallback : key;
  };

  /**
   * Constrói link de WhatsApp com mensagem traduzida no idioma ativo
   */
  const getWhatsAppUrl = (phone = '', messageKey = 'whatsapp.demoMessage'): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = t(messageKey);
    const encoded = encodeURIComponent(message);
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${encoded}`;
    }
    return `https://api.whatsapp.com/send?text=${encoded}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, getWhatsAppUrl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de um LanguageProvider');
  }
  return context;
}
