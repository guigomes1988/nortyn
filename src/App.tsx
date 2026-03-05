import React, { useState } from 'react';
import { Rocket, LineChart, Target, Check, ArrowUpRight, Database, Eye, Send, Lightbulb, ClipboardList, Search, TrendingUp, Instagram, Facebook, Linkedin, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import BrandGlow from './components/BrandGlow';
import { siteConfig } from './config/siteConfig';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  },
  viewport: { once: true, margin: "-100px" }
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function App() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="font-sans text-[#1d1d30]">
      {/* Hero Section */}
      <div className="w-full overflow-hidden flex flex-col relative" style={{ backgroundColor: '#01031b' }}>
        {/* Noise Texture */}
        <div
          className="absolute inset-0 z-[2] opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        ></div>

        {/* Glow Background */}
        <BrandGlow />

        {/* Header */}
        <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
          <img src="/nortyn-bco.png" alt="Nortyn" className="h-[44px] w-auto relative z-50" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
            {siteConfig.navigation.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-[#00a99d] transition-colors">{item.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="#demonstracao" className="hidden md:flex bg-[#009a93] text-white px-6 py-2.5 rounded-lg font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-md">
              Agendar demonstração
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2 z-50 transition-colors hover:text-[#00a99d]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <motion.div
            initial={false}
            animate={isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-0 bg-[#01031b]/95 backdrop-blur-xl z-40 flex flex-col md:hidden ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            <div className="flex flex-col h-full px-8 pt-32 pb-12">
              {/* Menu Links */}
              <div className="flex flex-col gap-6">
                {siteConfig.navigation.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="text-3xl font-bold text-white/90 hover:text-[#00a99d] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <a
                  href="#demonstracao"
                  className="inline-block w-full bg-gradient-to-r from-[#00a99d] to-[#2e3192] text-white text-center px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agendar demonstração
                </a>
              </motion.div>

              {/* Footer Info in Menu */}
              <div className="mt-auto border-t border-white/10 pt-8">
                <p className="text-gray-400 text-sm mb-4">Redes Sociais e Contato</p>
                <div className="flex items-center gap-6 mb-6">
                  <a href={siteConfig.socialLinks.instagram} className="text-white/70 hover:text-[#00a99d]">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href={siteConfig.socialLinks.facebook} className="text-white/70 hover:text-[#00a99d]">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href={siteConfig.socialLinks.linkedin} className="text-white/70 hover:text-[#00a99d]">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
                <p className="text-white/60 text-sm">{siteConfig.contact.email}</p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Hero Content */}
        <motion.main
          {...fadeInUp}
          className="flex-1 flex flex-col items-center text-center px-6 pt-16 md:pt-24 pb-0 max-w-6xl mx-auto w-full relative z-10"
        >
          <span className="text-sm font-light tracking-[0.6em] uppercase mb-6 text-[#00a99d] opacity-90 ml-[0.6em]">
            {siteConfig.hero.badge}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-atkinson leading-[1.1] mb-6 text-white tracking-[-0.02em] max-w-4xl">
            {siteConfig.hero.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl">
            {siteConfig.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 z-10 w-full">
            <a href="#demonstracao" className="bg-gradient-to-r from-[#00a99d] to-[#2e3192] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-xl w-full sm:w-auto text-center">
              {siteConfig.hero.primaryCta}
            </a>
            <a href="#beneficios" className="border-2 border-white/20 text-white bg-transparent px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 w-full sm:w-auto text-center">
              {siteConfig.hero.secondaryCta}
            </a>
          </div>

          {/* Visual Diagram (Smartphone & Prints) */}
          <div className="relative w-full max-w-5xl mx-auto flex justify-center items-start mt-4 h-[320px] md:h-[420px]">

            {/* Left Card (Simulação Vendedor) */}
            <div className="hidden lg:flex absolute left-0 top-0 z-10 w-[280px] bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(46,49,146,0.2)] border border-white/10 p-6 flex-col transition-transform duration-300 hover:scale-105 hover:z-30">
              <h3 className="text-white font-bold text-lg mb-4">Foco em execução.</h3>
              {/* Fake UI: Task list / Goal bars */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00a99d]/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#00a99d]" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-[#00a99d] rounded-full"></div>
                    </div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full mt-2"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#312783]/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-[#312783]" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-[#312783] rounded-full"></div>
                    </div>
                    <div className="w-2/3 h-2 bg-gray-200 rounded-full mt-2"></div>
                  </div>
                </div>
                <div className="w-full h-16 bg-white/5 rounded-xl border border-white/5 mt-2 p-3 flex flex-col justify-center gap-2">
                  <div className="w-1/3 h-2 bg-white/10 rounded-full"></div>
                  <div className="w-full h-2 bg-white/10 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Center Smartphone */}
            <div className="relative z-20 w-[280px] md:w-[320px] aspect-[9/19] border-[8px] border-white/10 rounded-[2.5rem] bg-[#050505]/60 backdrop-blur-md shadow-[0_0_40px_rgba(0,169,157,0.2)] overflow-hidden group">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/10 backdrop-blur-sm rounded-full z-30"></div>

              {/* Screen Content (Dashboard UI) */}
              <div className="absolute inset-0 bg-[#050505]/40 pt-12 px-4 pb-4 flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>

                {/* Main KPI */}
                <div className="w-full bg-[#312783] rounded-2xl p-4 text-white shadow-lg">
                  <div className="w-16 h-3 bg-white/30 rounded-full mb-3"></div>
                  <div className="w-32 h-6 bg-white rounded-full mb-4"></div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-[#00a99d] rounded-full"></div>
                  </div>
                </div>

                {/* Grid KPIs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 shadow-sm">
                    <div className="w-8 h-8 bg-[#00a99d]/20 rounded-full mb-2"></div>
                    <div className="w-12 h-2 bg-white/10 rounded-full mb-2"></div>
                    <div className="w-20 h-4 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 shadow-sm">
                    <div className="w-8 h-8 bg-[#00a99d]/20 rounded-full mb-2"></div>
                    <div className="w-12 h-2 bg-white/10 rounded-full mb-2"></div>
                    <div className="w-20 h-4 bg-white/20 rounded-full"></div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="flex-1 bg-white/5 rounded-xl border border-white/5 shadow-sm p-3 flex items-end justify-between gap-1 mt-1">
                  {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                    <div key={i} className="w-full bg-gradient-to-t from-[#312783] to-[#a9dbe9] rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card (Simulação Gestor) */}
            <div className="hidden lg:flex absolute right-0 top-0 z-10 w-[280px] bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(0,169,157,0.2)] border border-white/10 p-6 flex-col transition-transform duration-300 hover:scale-105 hover:z-30">
              <h3 className="text-white font-bold text-lg mb-4">Para diretores e gerentes.</h3>
              {/* Fake UI: Consolidated Chart */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end h-24 gap-2 border-b border-gray-100 pb-2">
                  <div className="w-full bg-[#312783] rounded-t-md h-[40%]"></div>
                  <div className="w-full bg-[#00a99d] rounded-t-md h-[70%]"></div>
                  <div className="w-full bg-[#312783] rounded-t-md h-[50%]"></div>
                  <div className="w-full bg-[#00a99d] rounded-t-md h-[90%]"></div>
                  <div className="w-full bg-[#312783] rounded-t-md h-[60%]"></div>
                  <div className="w-full bg-[#00a99d] rounded-t-md h-[100%]"></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#312783] rounded-full"></div>
                    <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#00a99d] rounded-full"></div>
                    <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="w-full h-12 bg-white/5 rounded-xl border border-white/5 mt-2 flex items-center justify-between px-4">
                  <div className="w-16 h-3 bg-white/10 rounded-full"></div>
                  <div className="w-10 h-4 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </motion.main>
      </div>

      {/* Value Proposition Section */}
      <section id="beneficios" className="w-full bg-white py-24 md:py-40 lg:py-48 px-6 relative overflow-hidden">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#1d1d30 1px, transparent 1px), linear-gradient(90deg, #1d1d30 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        ></div>
        <motion.div {...fadeInUp} className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="mb-16 md:mb-24 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold font-atkinson text-[#1d1d30] leading-tight mb-6">
              Estruture sua engrenagem de vendas em tempo recorde.
            </h2>
            <p className="text-xl text-gray-600">
              Sem a complexidade dos CRMs tradicionais.
            </p>
          </div>

          {/* Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Item 1 */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex flex-col items-start text-left bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[#00a99d]/30"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00a99d]/10 to-[#312783]/5 flex items-center justify-center mb-8"
              >
                <Rocket className="w-7 h-7 text-[#00a99d]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xl font-bold text-[#1d1d30] mb-4">Implementação Ágil</h3>
              <p className="text-gray-500 leading-relaxed">
                Implemente a Nortyn em até duas semanas e comece a ver os resultados na sua operação quase imediatamente.
              </p>
            </motion.div>

            {/* Item 2 */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex flex-col items-start text-left bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[#00a99d]/30"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00a99d]/10 to-[#312783]/5 flex items-center justify-center mb-8"
              >
                <LineChart className="w-7 h-7 text-[#00a99d]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xl font-bold text-[#1d1d30] mb-4">Acompanhamento em Tempo Real</h3>
              <p className="text-gray-500 leading-relaxed">
                Tenha visão D-1 de vendas e saiba exatamente o que está acontecendo com o seu faturamento hoje.
              </p>
            </motion.div>

            {/* Item 3 */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex flex-col items-start text-left bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[#00a99d]/30"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00a99d]/10 to-[#312783]/5 flex items-center justify-center mb-8"
              >
                <Target className="w-7 h-7 text-[#00a99d]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-xl font-bold text-[#1d1d30] mb-4">Engajamento da Equipe</h3>
              <p className="text-gray-500 leading-relaxed">
                Garanta metas bem distribuídas e um acompanhamento real de cada representante comercial.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section className="w-full bg-gradient-to-br from-[#312783]/15 via-white to-[#00a99d]/15 py-24 md:py-40 lg:py-48 overflow-hidden">
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(calc(-50% - 1.5rem)); }
            }
            .animate-scroll {
              animation: scroll 40s linear infinite;
            }
          `}
        </style>

        <motion.div {...fadeInUp} className="max-w-7xl mx-auto px-6 mb-16">
          <span className="text-sm font-bold tracking-widest uppercase mb-4 block text-[#312783] opacity-90">
            DEPOIMENTOS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-atkinson text-[#1d1d30] leading-tight mb-6">
            Empresas que confiam na Nortyn
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            A Nortyn já é a plataforma de dezenas de empresas que buscam escalabilidade.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden flex">
          <div className="flex gap-6 animate-scroll hover:[animation-play-state:paused] w-max px-6 py-8">
            {/* --- FIRST SET --- */}
            <div className="bg-white rounded-[2.5rem] p-10 w-[420px] flex-shrink-0 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-[#00a99d]/20 transition-colors">“</div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-[#1d1d30]">Sulist</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Diretoria</p>
                  </div>
                </div>
                <p className="text-[#1d1d30] text-lg leading-relaxed mb-8">
                  "A Nortyn trouxe a previsibilidade que precisávamos em vendas. Conseguimos estruturar nossa equipe e alcançar as metas com clareza."
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-gray-500 text-sm font-medium">Diretor Comercial</p>
                <div className="w-8 h-4 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 w-[420px] flex-shrink-0 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-[#00a99d]/20 transition-colors">“</div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-[#1d1d30]">Datatec</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Gestão</p>
                  </div>
                </div>
                <p className="text-[#1d1d30] text-lg leading-relaxed mb-8">
                  "Com a Nortyn, ganhamos agilidade e controle. A equipe pode se concentrar no que realmente importa: vender mais."
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-gray-500 text-sm font-medium">Gerente de Vendas</p>
                <div className="w-8 h-4 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 w-[420px] flex-shrink-0 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-[#00a99d]/20 transition-colors">“</div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-[#1d1d30]">Topa Info</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Fundação</p>
                  </div>
                </div>
                <p className="text-[#1d1d30] text-lg leading-relaxed mb-8">
                  "A melhor decisão que tomamos para nossa operação. A visibilidade dos dados nos deu confiança para escalar."
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-gray-500 text-sm font-medium">CEO e Fundador</p>
                <div className="w-8 h-4 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 w-[420px] flex-shrink-0 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-[#00a99d]/20 transition-colors">“</div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-[#1d1d30]">Victória Logística</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Operação</p>
                  </div>
                </div>
                <p className="text-[#1d1d30] text-lg leading-relaxed mb-8">
                  "Nunca foi tão fácil acompanhar o desempenho de cada representante. A operação ficou muito mais rápida."
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-gray-500 text-sm font-medium">Coordenador Comercial</p>
                <div className="w-8 h-4 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>

            {/* --- SECOND SET --- */}
            <div className="bg-white rounded-[2.5rem] p-10 w-[420px] flex-shrink-0 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-[#00a99d]/20 transition-colors">“</div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-[#1d1d30]">Sulist</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Diretoria</p>
                  </div>
                </div>
                <p className="text-[#1d1d30] text-lg leading-relaxed mb-8">
                  "A Nortyn trouxe a previsibilidade que precisávamos em vendas. Conseguimos estruturar nossa equipe e alcançar as metas com clareza."
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-gray-500 text-sm font-medium">Diretor Comercial</p>
                <div className="w-8 h-4 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 w-[420px] flex-shrink-0 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-[#00a99d]/20 transition-colors">“</div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-[#1d1d30]">Datatec</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Gestão</p>
                  </div>
                </div>
                <p className="text-[#1d1d30] text-lg leading-relaxed mb-8">
                  "Com a Nortyn, ganhamos agilidade e controle. A equipe pode se concentrar no que realmente importa: vender mais."
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-gray-500 text-sm font-medium">Gerente de Vendas</p>
                <div className="w-8 h-4 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 w-[420px] flex-shrink-0 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-[#00a99d]/20 transition-colors">“</div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-[#1d1d30]">Topa Info</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Fundação</p>
                  </div>
                </div>
                <p className="text-[#1d1d30] text-lg leading-relaxed mb-8">
                  "A melhor decisão que tomamos para nossa operação. A visibilidade dos dados nos deu confiança para escalar."
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-gray-500 text-sm font-medium">CEO e Fundador</p>
                <div className="w-8 h-4 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 w-[420px] flex-shrink-0 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-[#00a99d]/20 transition-colors">“</div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-[#1d1d30]">Victória Logística</p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Operação</p>
                  </div>
                </div>
                <p className="text-[#1d1d30] text-lg leading-relaxed mb-8">
                  "Nunca foi tão fácil acompanhar o desempenho de cada representante. A operação ficou muito mais rápida."
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                <p className="text-gray-500 text-sm font-medium">Coordenador Comercial</p>
                <div className="w-8 h-4 bg-gray-100 rounded opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Super Section: Bento Grid (Dynamic Fintech Style) */}
      <section id="empresa" className="w-full bg-white py-24 md:py-40 lg:py-48">
        <motion.div {...fadeInUp} className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-atkinson text-[#1d1d30] leading-tight mb-6">
              Menos planilha. Melhor decisão. Melhores resultados.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              Trabalhando em conjunto com o seu ERP atual, sem integrações complexas. A Nortyn organiza seus dados e dá previsibilidade diária para sua equipe em uma única plataforma.
            </p>
          </div>

          {/* Bento Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >

            {/* Card 1 (Hero Vertical) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-1 lg:row-span-2 bg-[#312783] text-white rounded-3xl p-8 transition-transform shadow-sm flex flex-col min-h-[450px]"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Visão D-1 e Dashboards em Tempo Real</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Acompanhe o Real x Meta consolidado diariamente. A diretoria ganha relatórios estruturados para tomar decisões sem depender de planilhas.
                </p>
              </div>
              {/* Fake UI Bottom */}
              <div className="absolute bottom-0 left-0 w-full px-6 pt-12 bg-gradient-to-t from-[#312783] via-[#312783]/80 to-transparent">
                <div className="w-full h-56 bg-white/10 rounded-t-3xl border border-white/10 p-5 flex flex-col gap-4 backdrop-blur-md shadow-2xl translate-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[#00a99d] border-r-[#00a99d] mx-auto mb-2 rotate-45"></div>
                  <div className="w-full h-3 bg-white/20 rounded-full"></div>
                  <div className="w-3/4 h-3 bg-white/20 rounded-full"></div>
                  <div className="w-5/6 h-3 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 (Gigante Central) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-2 lg:row-span-2 bg-white text-[#1d1d30] rounded-3xl p-8 transition-transform shadow-sm flex flex-col justify-center min-h-[450px]"
            >
              <div className="relative z-10 max-w-sm">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Distribuição e Comunicação Automatizada</h3>
                <p className="text-gray-600 leading-relaxed">
                  Configure regras, pesos e restrições. A comunicação desce para a equipe eliminando falhas humanas.
                </p>
              </div>
              {/* Fake UI Right */}
              <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none opacity-30 md:opacity-100">
                <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-64 h-64 bg-[#a9dbe9]/30 rounded-full blur-3xl"></div>
                {/* Floating Cards */}
                <div className="absolute top-[15%] right-12 w-48 h-28 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-4 flex flex-col gap-3 rotate-[-6deg]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00a99d]/20"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2"></div>
                  <div className="w-2/3 h-2 bg-gray-100 rounded-full"></div>
                </div>
                <div className="absolute bottom-[20%] right-4 w-56 h-32 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-5 flex flex-col gap-4 rotate-[4deg]">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-[#312783]/10"></div>
                    <div className="w-20 h-5 rounded-full bg-green-100"></div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-1"></div>
                  <div className="w-4/5 h-2 bg-gray-100 rounded-full"></div>
                </div>
                {/* Dashed Connection Line */}
                <svg className="absolute top-1/2 right-24 w-40 h-40 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 100 100">
                  <path d="M10,20 Q50,90 90,20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
            </motion.div>

            {/* Card 3 (Quadrado Top Right) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-1 lg:row-span-1 bg-slate-50 text-[#1d1d30] rounded-3xl p-8 transition-transform shadow-sm flex flex-col min-h-[250px]"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Previsão Dia a Dia</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Acompanhamento estratificado por profissional.
                </p>
              </div>
              {/* Fake Chart Bottom */}
              <div className="absolute bottom-0 left-0 w-full h-28 flex items-end justify-between px-6 gap-2 opacity-70">
                <div className="w-full bg-[#a9dbe9] rounded-t-md h-[30%]"></div>
                <div className="w-full bg-[#a9dbe9] rounded-t-md h-[50%]"></div>
                <div className="w-full bg-[#a9dbe9] rounded-t-md h-[40%]"></div>
                <div className="w-full bg-[#a9dbe9] rounded-t-md h-[70%]"></div>
                <div className="w-full bg-[#a9dbe9] rounded-t-md h-[60%]"></div>
                <div className="w-full bg-[#a9dbe9] rounded-t-md h-[90%]"></div>
                <div className="w-full bg-[#00a99d] rounded-t-md h-[80%]"></div>
                <div className="w-full bg-[#00a99d] rounded-t-md h-[100%]"></div>
              </div>
            </motion.div>

            {/* Card 4 (Quadrado Bottom Right) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-1 lg:row-span-1 bg-white text-[#1d1d30] rounded-3xl p-8 transition-transform shadow-sm flex flex-col justify-center items-center text-center min-h-[250px]"
            >
              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#a9dbe9]/40 blur-3xl rounded-full"></div>

              <div className="relative z-10 flex flex-col items-center">
                <Lightbulb className="w-12 h-12 text-[#312783] mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-2">Inteligência Ativa</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Alertas para atuar no que importa e identificar gargalos.
                </p>
              </div>
            </motion.div>

            {/* Card 5 (Largo Bottom Left) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-2 lg:row-span-1 bg-white text-[#1d1d30] rounded-3xl p-8 transition-transform shadow-sm flex flex-col md:flex-row items-center min-h-[200px]"
            >
              <div className="relative z-10 md:w-1/2">
                <h3 className="text-2xl font-bold mb-2">Planos de Ação</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Crie cenários e direcione oportunidades exatas.
                </p>
              </div>
              {/* Gantt Chart Right */}
              <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center gap-5 px-8 opacity-80 pointer-events-none hidden md:flex">
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-[#00a99d] rounded-full"></div>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex justify-end">
                  <div className="w-1/2 h-full bg-[#312783] rounded-full"></div>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex justify-center">
                  <div className="w-3/4 h-full bg-[#a9dbe9] rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Card 6 (Largo Bottom Right) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-[#312783] to-[#4a3b9c] text-white rounded-3xl p-8 transition-transform shadow-sm flex flex-col md:flex-row items-center min-h-[200px]"
            >
              <div className="relative z-10 md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">Foco em Execução</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  A equipe abandona as planilhas e acompanha metas na palma da mão (Web/Mobile).
                </p>
              </div>
              {/* Giant Check Silhouette */}
              <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                <Check className="w-56 h-56 text-white" strokeWidth={1} />
              </div>
            </motion.div>

            {/* New Card 1 (Visão Executiva Clara) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-1 lg:row-span-1 bg-[#d4d3f4] rounded-3xl p-8 transition-transform shadow-sm flex flex-col min-h-[250px]"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-6 bg-white text-[#312783]">
                <LineChart className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#312783]">Visão Executiva Clara</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Indicadores e painéis objetivos desenhados especificamente para a diretoria e gerência acompanharem o pulso do negócio.
              </p>
            </motion.div>

            {/* New Card 2 (Segmentação Estratégica) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-2 lg:row-span-1 bg-white rounded-3xl p-8 transition-transform border border-gray-100 shadow-sm flex flex-col md:flex-row items-center min-h-[250px]"
            >
              <div className="relative z-10 md:w-1/2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-6 bg-[#f0fdfa] text-[#009a93]">
                  <Target className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#1d1d30]">Segmentação Estratégica</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Organize sua base com segmentação por prioridade e carteira, garantindo que o time foque nos clientes certos.
                </p>
              </div>
              {/* Fake UI Right */}
              <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center gap-3 px-8 opacity-80 pointer-events-none hidden md:flex">
                <div className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#312783]/20"></div>
                  <div className="flex-1">
                    <div className="w-1/2 h-2 bg-gray-300 rounded-full mb-2"></div>
                    <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00a99d]/20"></div>
                  <div className="flex-1">
                    <div className="w-2/3 h-2 bg-gray-300 rounded-full mb-2"></div>
                    <div className="w-1/2 h-2 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* New Card 3 (Ações Guiadas por Dados) */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative overflow-hidden lg:col-span-1 lg:row-span-1 bg-[#312783] rounded-3xl p-8 transition-transform shadow-sm flex flex-col min-h-[250px]"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-6 bg-white/10 text-white backdrop-blur-sm">
                <Lightbulb className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Ações Guiadas por Dados</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Receba recomendações de ação baseadas em dados reais, transformando informações dispersas em próximos passos claros.
              </p>
            </motion.div>

          </motion.div>

          {/* Footer Buttons */}
          <div className="mt-16 flex justify-center">
            <a href="#demonstracao" className="bg-gradient-to-r from-[#312783] to-[#009a93] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-md w-full sm:w-auto text-center">
              Solicitar demonstração
            </a>
          </div>
        </motion.div>
      </section>

      {/* Demonstration Form Section (Split Card) */}
      <section id="demonstracao" className="py-24 md:py-32 px-4 flex items-center justify-center bg-gradient-to-br from-[#312783] via-[#312783] to-[#009a93]/80">
        {/* Main Card Container */}
        <motion.div {...fadeInUp} className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40">

          {/* Left Column (Background Image) */}
          <div className="w-full lg:w-1/2 bg-[#312783] flex items-center justify-center overflow-hidden">
            <img
              src="/img-form.png"
              alt="Nortyn App"
              className="w-full h-full object-contain lg:object-cover"
            />
          </div>

          {/* Right Column (B2B Form) */}
          <div className="w-full lg:w-1/2 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold font-atkinson text-[#1d1d30] leading-tight mb-2">
              {siteConfig.form.title}
            </h2>
            <p className="text-gray-500 mb-10">
              {siteConfig.form.subtitle}
            </p>

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#f0fdfa] border border-[#009a93]/20 p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-[#009a93] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#009a93]/20">
                  <Check className="text-white w-8 h-8" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-[#1d1d30] mb-4">{siteConfig.form.successMessage.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {siteConfig.form.successMessage.content}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="col-span-full">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">Nome completo</label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    placeholder="Ex: João Silva"
                    className="bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#009a93] focus:border-transparent outline-none transition-all w-full"
                  />
                </div>

                {/* Corporate Email */}
                <div className="col-span-full">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail corporativo</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="joao@suaempresa.com.br"
                    className="bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#009a93] focus:border-transparent outline-none transition-all w-full"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1.5">Nome da Empresa</label>
                  <input
                    type="text"
                    id="company"
                    required
                    placeholder="Sua Empresa"
                    className="bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#009a93] focus:border-transparent outline-none transition-all w-full"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1.5">Cargo</label>
                  <input
                    type="text"
                    id="role"
                    required
                    placeholder="Ex: Diretor, Gerente"
                    className="bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#009a93] focus:border-transparent outline-none transition-all w-full"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="col-span-full w-full mt-4 bg-[#009a93] text-white font-semibold text-lg rounded-lg py-4 transition-all duration-300 hover:scale-[1.03] hover:bg-[#00807a]"
                >
                  {siteConfig.form.buttonText}
                </button>
              </form>
            )}

            {/* Trust Footer */}
            <p className="text-xs text-gray-400 text-center mt-6">
              Seus dados estão seguros conosco. Não enviamos spam.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Unified Section: Sobre Nós + CTA Final */}
      <section
        id="sobre-nos"
        className="w-full py-24 md:py-32 overflow-hidden bg-cover bg-center relative"
        style={{ backgroundImage: "url('/bg-final.png')" }}
      >
        {/* Overlay para legibilidade em toda a área */}
        <div className="absolute inset-0 bg-white/60 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Part 1: Quem é a Nortyn */}
          <motion.div {...fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
            {/* Left Column (Copy) */}
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-6 block">
                [ QUEM É A NORTYN ]
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-atkinson text-[#1d1d30] leading-tight mb-8">
                A Nortyn nasce da experiência prática em indústria.
              </h2>

              <p className="text-gray-600 text-lg mb-4">
                Nosso time de especialistas tem mais de 25 anos desenvolvendo soluções para áreas comerciais. Conhece o chão de fábrica, a pressão por meta e a realidade do representante em campo.
              </p>
              <p className="text-gray-600 text-lg mb-8">
                A Nortyn entrega organização, clareza e execução. Tecnologia aplicada à rotina real da indústria.
              </p>

              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3 text-gray-700 font-medium mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#009a93]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#009a93]" strokeWidth={3} />
                  </div>
                  Linguagem simples, números claros e decisão com base em fatos.
                </li>
                <li className="flex items-start gap-3 text-gray-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-[#009a93]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#009a93]" strokeWidth={3} />
                  </div>
                  Implantação rápida, com suporte próximo e foco no que muda a rotina do comercial.
                </li>
              </ul>
            </div>

            {/* Right Column (Image) */}
            <div className="relative w-full h-[400px] md:h-[450px] rounded-[2rem]">
              <img
                src="/img-equipe.png"
                alt="Time Nortyn"
                className="w-full h-full object-cover rounded-[2rem] shadow-xl"
              />
            </div>
          </motion.div>

          {/* Part 2: CTA Final Banner */}
          <motion.div {...fadeInUp} className="max-w-6xl mx-auto relative rounded-[2.5rem] shadow-2xl overflow-hidden" style={{ backgroundColor: '#01031b' }}>
            {/* Noise Texture */}
            <div
              className="absolute inset-0 z-[2] opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
              }}
            ></div>

            {/* Glow Background */}
            <BrandGlow />

            {/* Content */}
            <div className="relative z-10 px-6 py-16 md:py-20 text-center flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-bold font-atkinson text-white leading-tight mb-6 max-w-3xl">
                Automatize sua gestão comercial e controle suas metas com clareza.
              </h2>

              <p className="text-lg text-white/80 mb-10 max-w-2xl">
                Tenha visão D-1, metas bem distribuídas e plano de ação estruturado. Veja na demonstração como revolucionar a sua operação.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <a href="#demonstracao" className="bg-[#009a93] text-white rounded-lg px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-[#00807a] shadow-lg text-center">
                  Agendar demonstração personalizada
                </a>
                <a href="#beneficios" className="bg-transparent border-2 border-white text-white font-semibold text-lg rounded-lg px-8 py-4 transition-all duration-300 hover:scale-105 hover:bg-white/10 text-center">
                  Rever benefícios
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <footer className="w-full bg-[#312783] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Column 1 (Marca e Redes Sociais) */}
          <div className="md:col-span-2">
            <img src="/nortyn-bco.png" alt={siteConfig.name} className="h-[55px] w-auto mb-6 block" />
            <p className="text-white/80 text-lg mb-8 max-w-sm">
              {siteConfig.footer.tagline}
            </p>
            <div className="flex items-center gap-5">
              <a href={siteConfig.socialLinks.instagram} className="text-white hover:text-[#009a93] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href={siteConfig.socialLinks.facebook} className="text-white hover:text-[#009a93] transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href={siteConfig.socialLinks.linkedin} className="text-white hover:text-[#009a93] transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Menu</h3>
            <ul className="flex flex-col gap-4">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}><a href={item.href} className="text-white/70 hover:text-white transition-colors text-sm">{item.label}</a></li>
              ))}
              <li><a href="#demonstracao" className="text-white/70 hover:text-white transition-colors text-sm">Agendar Demonstração</a></li>
            </ul>
          </div>

          {/* Column 3 (Contato e Legal) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contato</h3>
            <ul className="flex flex-col gap-4">
              <li><a href={`mailto:${siteConfig.contact.email}`} className="text-white/70 hover:text-white transition-colors text-sm">{siteConfig.contact.email}</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Termos de Uso</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>

        {/* Faixa Inferior de Copyright */}
        <div className="w-full bg-[#009a93] py-4 px-4 text-center">
          <p className="text-sm text-white font-medium">
            {siteConfig.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
