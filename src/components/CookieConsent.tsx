import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'nortyn_cookie_consent_v1';

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
  functional: true,
  timestamp: '',
};

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Verifica se já existe consentimento salvo
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
        setIsOpen(false);
      } else {
        // Exibe com um leve delay agradável após o carregamento da página
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  // Escuta evento customizado para reabrir as configurações de cookies a partir do rodapé
  useEffect(() => {
    const handleOpenSettings = () => {
      setShowPreferences(true);
      setIsOpen(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const updated = {
      ...prefs,
      necessary: true, // Sempre obrigatório
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Não foi possível salvar consentimento no localStorage:', e);
    }
    setPreferences(updated);
    setIsOpen(false);
    setShowPreferences(false);

    // Dispara evento para scripts e analytics poderem se ajustar conforme consentimento
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: updated }));
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: '',
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: '',
    });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  const toggleCategory = (category: keyof Omit<CookiePreferences, 'necessary' | 'timestamp'>) => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-4 z-[9999] max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg"
        role="dialog"
        aria-labelledby="cookie-consent-title"
      >
        <div className="bg-[#0f0c29]/95 backdrop-blur-xl border border-white/15 text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 md:p-6 overflow-hidden relative">
          {/* Brilho decorativo sutil no topo */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#009a93]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#312783]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Cabeçalho */}
          <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#312783] to-[#009a93] flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 id="cookie-consent-title" className="text-sm font-semibold text-white tracking-wide">
                  Privacidade & Cookies
                </h3>
                <span className="text-[11px] text-[#009a93] font-medium">LGPD em conformidade</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Fechar banner temporariamente"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modo 1: Visualização Resumida */}
          {!showPreferences ? (
            <div className="space-y-4 relative z-10">
              <p className="text-xs text-white/80 leading-relaxed">
                Utilizamos cookies e tecnologias similares para melhorar a sua experiência, personalizar conteúdos e analisar o tráfego do nosso site. Você pode aceitar todos, recusar os não essenciais ou personalizar suas escolhas.
              </p>

              <div className="flex items-center justify-between text-xs text-white/60 pt-1">
                <Link
                  to="/politica-de-privacidade"
                  className="hover:text-[#009a93] underline underline-offset-2 transition-colors"
                >
                  Política de Privacidade
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors hover:underline cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#009a93]" />
                  <span>Configurar cookies</span>
                </button>
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="col-span-1 px-3 py-2 text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-all duration-200 text-center cursor-pointer"
                >
                  Recusar
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="col-span-1 sm:hidden px-3 py-2 text-xs font-medium text-white/90 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-all duration-200 text-center cursor-pointer"
                >
                  Opções
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="col-span-2 sm:col-span-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#312783] to-[#009a93] hover:opacity-95 shadow-md shadow-[#009a93]/20 rounded-xl transition-all duration-200 text-center cursor-pointer hover:scale-[1.02]"
                >
                  Aceitar todos
                </button>
              </div>
            </div>
          ) : (
            /* Modo 2: Visualização de Configurações Detalhadas */
            <div className="space-y-3.5 relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <p className="text-xs font-medium text-white/90">
                  Gerencie suas preferências de privacidade
                </p>
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="text-xs text-[#009a93] hover:underline"
                >
                  Voltar
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                {/* 1. Necessários */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#009a93]" />
                      <span className="text-xs font-semibold text-white">Estritamente Necessários</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Sempre Ativos
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1 leading-normal">
                    Essenciais para a segurança, navegação básica e disponibilidade do site. Não podem ser desativados.
                  </p>
                </div>

                {/* 2. Desempenho e Analíticos */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Cookies Analíticos</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => toggleCategory('analytics')}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#009a93]"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1 leading-normal">
                    Permitem medir acessos, páginas mais visitadas e fontes de tráfego para aprimorar o desempenho.
                  </p>
                </div>

                {/* 3. Marketing e Publicidade */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Cookies de Marketing</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => toggleCategory('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#009a93]"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1 leading-normal">
                    Utilizados para oferecer anúncios relevantes de acordo com seus interesses comerciais.
                  </p>
                </div>

                {/* 4. Funcionais */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Cookies Funcionais</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => toggleCategory('functional')}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#009a93]"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1 leading-normal">
                    Lembram suas configurações e preferências para uma navegação personalizada e fluida.
                  </p>
                </div>
              </div>

              {/* Botões do Modo de Configurações */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="px-3 py-2 text-xs font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Rejeitar todos
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all cursor-pointer"
                  >
                    Salvar opções
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#312783] to-[#009a93] hover:opacity-95 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Aceitar todos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
