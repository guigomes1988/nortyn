import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage, Language } from '../i18n/LanguageContext';
import { BrazilFlag, UsaFlag, SpainFlag } from './Flags';

export default function LanguageBar() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  // Não exibe a barra dentro do painel administrativo
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const languages: { code: Language; label: string; fullLabel: string; Flag: React.FC<{ className?: string }> }[] = [
    { code: 'pt', label: 'PT-BR', fullLabel: 'Português (Brasil)', Flag: BrazilFlag },
    { code: 'en', label: 'EN', fullLabel: 'English (US)', Flag: UsaFlag },
    { code: 'es', label: 'ES', fullLabel: 'Español', Flag: SpainFlag },
  ];

  return (
    <aside
      aria-label="Seleção de idioma"
      className="fixed top-0 left-0 right-0 z-[60] h-10 bg-[#01031b]/85 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between text-xs select-none transition-all duration-300"
    >
      {/* Lado Esquerdo: Tagline discreta */}
      <div className="flex items-center gap-2 text-white/50 text-[11px] font-medium tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00a99d] animate-pulse" />
        <span className="hidden sm:inline">
          {t('topbar.tagline', 'Inteligência comercial para indústrias que buscam previsibilidade e escala')}
        </span>
        <span className="sm:hidden font-bold tracking-widest text-[#00a99d]">NORTYN</span>
      </div>

      {/* Lado Direito: Seletor de Idiomas com Pílulas e Bandeiras SVG Nítidas */}
      <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-full border border-white/10 backdrop-blur-sm shadow-inner">
        {languages.map(({ code, label, fullLabel, Flag }) => {
          const isActive = language === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              title={fullLabel}
              aria-pressed={isActive}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#00a99d]/30 to-[#2e3192]/40 text-white font-bold border border-[#00a99d]/70 shadow-[0_0_12px_rgba(0,169,157,0.4)] scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent font-medium'
              }`}
            >
              <Flag className="w-4 h-3 rounded-[2px]" />
              <span className="tracking-wider">{label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
