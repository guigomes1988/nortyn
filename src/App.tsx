/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rocket, LineChart, Target, Check, ArrowUpRight, Database, Eye, Send, Lightbulb, ClipboardList, Search, TrendingUp, Instagram, Facebook, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

export default function App() {
  return (
    <div className="font-sans text-[#1d1d30]">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-[#bdb7dc] to-[#d0ebf6] overflow-hidden flex flex-col relative">
        {/* Background Circles */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-white rounded-full opacity-40 blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-white rounded-full opacity-40 blur-[150px] pointer-events-none"></div>

        {/* Header */}
        <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
          <div className="text-2xl font-bold font-atkinson text-[#1d1d30] tracking-tight">Nortyn</div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1d1d30]">
            <a href="#" className="hover:text-[#00a99d] transition-colors">Empresa</a>
            <a href="#" className="hover:text-[#00a99d] transition-colors">Benefícios</a>
            <a href="#" className="hover:text-[#00a99d] transition-colors">Sobre nós</a>
          </nav>
          
          <button className="bg-[#009a93] text-white px-6 py-2.5 rounded-lg font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-md">
            Agendar demonstração
          </button>
        </header>

        {/* Hero Content */}
        <motion.main 
          {...fadeInUp}
          className="flex-1 flex flex-col items-center text-center px-6 pt-16 md:pt-24 pb-0 max-w-6xl mx-auto w-full relative z-10"
        >
          <span className="text-sm font-light tracking-[0.6em] uppercase mb-6 text-[#312783] opacity-90 ml-[0.6em]">
            GESTÃO COMERCIAL INTELIGENTE
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-atkinson leading-[1.1] mb-6 text-[#1d1d30] tracking-[-0.02em] max-w-4xl">
            Oriente suas decisões comerciais com dados claros e controle total das metas.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl">
            Transforme os dados do seu ERP ou das suas planilhas em painéis de decisão para indústrias que precisam agir com previsibilidade.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 z-10 w-full">
            <button className="bg-gradient-to-r from-[#312783] to-[#009a93] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-xl w-full sm:w-auto">
              Agendar demonstração personalizada
            </button>
            <button className="border-2 border-gray-900 text-gray-900 bg-transparent px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-gray-200 hover:scale-105 w-full sm:w-auto">
              Ver Benefícios
            </button>
          </div>

          {/* Visual Diagram (Smartphone & Prints) */}
          <div className="relative w-full max-w-5xl mx-auto flex justify-center items-start mt-4 h-[320px] md:h-[420px]">
            
            {/* Left Card (Simulação Vendedor) */}
            <div className="hidden lg:flex absolute left-0 top-0 z-10 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex-col transition-transform duration-300 hover:scale-105 hover:z-30">
              <h3 className="text-[#1d1d30] font-bold text-lg mb-4">Foco em execução.</h3>
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
                <div className="w-full h-16 bg-slate-50 rounded-xl border border-gray-100 mt-2 p-3 flex flex-col justify-center gap-2">
                  <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Center Smartphone */}
            <div className="relative z-20 w-[280px] md:w-[320px] aspect-[9/19] border-[8px] border-gray-900 rounded-[2.5rem] bg-white shadow-2xl overflow-hidden group">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full z-30"></div>
              
              {/* Screen Content (Dashboard UI) */}
              <div className="absolute inset-0 bg-slate-50 pt-12 px-4 pb-4 flex flex-col gap-4">
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
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 bg-[#a9dbe9]/30 rounded-full mb-2"></div>
                    <div className="w-12 h-2 bg-gray-200 rounded-full mb-2"></div>
                    <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 bg-[#00a99d]/20 rounded-full mb-2"></div>
                    <div className="w-12 h-2 bg-gray-200 rounded-full mb-2"></div>
                    <div className="w-20 h-4 bg-gray-800 rounded-full"></div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-end justify-between gap-1 mt-1">
                  {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                    <div key={i} className="w-full bg-gradient-to-t from-[#312783] to-[#a9dbe9] rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card (Simulação Gestor) */}
            <div className="hidden lg:flex absolute right-0 top-0 z-10 w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex-col transition-transform duration-300 hover:scale-105 hover:z-30">
              <h3 className="text-[#1d1d30] font-bold text-lg mb-4">Para diretores e gerentes.</h3>
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
                <div className="w-full h-12 bg-slate-50 rounded-xl border border-gray-100 mt-2 flex items-center justify-between px-4">
                  <div className="w-16 h-3 bg-gray-300 rounded-full"></div>
                  <div className="w-10 h-4 bg-[#1d1d30] rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </motion.main>
      </div>

      {/* Value Proposition Section */}
      <section className="w-full bg-white py-24 md:py-40 lg:py-48 px-6">
        <motion.div {...fadeInUp} className="max-w-7xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {/* Item 1 */}
            <div className="flex flex-col items-start text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#00a99d]/10 flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-[#312783]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#1d1d30] mb-4">Implementação Ágil</h3>
              <p className="text-gray-500 leading-relaxed">
                Implemente a Nortyn em até duas semanas e comece a ver os resultados na sua operação quase imediatamente.
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col items-start text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#00a99d]/10 flex items-center justify-center mb-6">
                <LineChart className="w-8 h-8 text-[#312783]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#1d1d30] mb-4">Acompanhamento em Tempo Real</h3>
              <p className="text-gray-500 leading-relaxed">
                Tenha visão D-1 de vendas e saiba exatamente o que está acontecendo com o seu faturamento hoje.
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col items-start text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#00a99d]/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[#312783]" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#1d1d30] mb-4">Engajamento da Equipe</h3>
              <p className="text-gray-500 leading-relaxed">
                Garanta metas bem distribuídas e um acompanhamento real de cada representante comercial.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section className="w-full bg-slate-50 py-24 md:py-40 lg:py-48 overflow-hidden">
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
            <div className="bg-white rounded-3xl p-8 w-[400px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(169,219,233,0.5)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-6"></div>
                <p className="text-[#1d1d30] text-lg italic mb-8">
                  "A Nortyn trouxe a previsibilidade que precisávamos em vendas. Conseguimos estruturar nossa equipe e alcançar as metas com clareza."
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1d1d30]">Sulist</p>
                <p className="text-gray-500 text-sm">Diretor Comercial</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 w-[400px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(169,219,233,0.5)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-6"></div>
                <p className="text-[#1d1d30] text-lg italic mb-8">
                  "Com a Nortyn, ganhamos agilidade e controle. A equipe pode se concentrar no que realmente importa: vender mais."
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1d1d30]">Datatec</p>
                <p className="text-gray-500 text-sm">Gerente de Vendas</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 w-[400px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(169,219,233,0.5)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-6"></div>
                <p className="text-[#1d1d30] text-lg italic mb-8">
                  "A melhor decisão que tomamos para nossa operação. A visibilidade dos dados nos deu confiança para escalar."
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1d1d30]">Topa Info</p>
                <p className="text-gray-500 text-sm">CEO e Fundador</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 w-[400px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(169,219,233,0.5)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-6"></div>
                <p className="text-[#1d1d30] text-lg italic mb-8">
                  "Nunca foi tão fácil acompanhar o desempenho de cada representante. A operação ficou muito mais rápida."
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1d1d30]">Victória Logística</p>
                <p className="text-gray-500 text-sm">Coordenador Comercial</p>
              </div>
            </div>

            {/* --- SECOND SET (Duplicated for infinite loop) --- */}
            <div className="bg-white rounded-3xl p-8 w-[400px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(169,219,233,0.5)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-6"></div>
                <p className="text-[#1d1d30] text-lg italic mb-8">
                  "A Nortyn trouxe a previsibilidade que precisávamos em vendas. Conseguimos estruturar nossa equipe e alcançar as metas com clareza."
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1d1d30]">Sulist</p>
                <p className="text-gray-500 text-sm">Diretor Comercial</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 w-[400px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(169,219,233,0.5)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-6"></div>
                <p className="text-[#1d1d30] text-lg italic mb-8">
                  "Com a Nortyn, ganhamos agilidade e controle. A equipe pode se concentrar no que realmente importa: vender mais."
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1d1d30]">Datatec</p>
                <p className="text-gray-500 text-sm">Gerente de Vendas</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 w-[400px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(169,219,233,0.5)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-6"></div>
                <p className="text-[#1d1d30] text-lg italic mb-8">
                  "A melhor decisão que tomamos para nossa operação. A visibilidade dos dados nos deu confiança para escalar."
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1d1d30]">Topa Info</p>
                <p className="text-gray-500 text-sm">CEO e Fundador</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 w-[400px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(169,219,233,0.5)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-200 mb-6"></div>
                <p className="text-[#1d1d30] text-lg italic mb-8">
                  "Nunca foi tão fácil acompanhar o desempenho de cada representante. A operação ficou muito mais rápida."
                </p>
              </div>
              <div>
                <p className="font-bold text-[#1d1d30]">Victória Logística</p>
                <p className="text-gray-500 text-sm">Coordenador Comercial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Super Section: Bento Grid (Dynamic Fintech Style) */}
      <section className="w-full bg-white py-24 md:py-40 lg:py-48">
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Card 1 (Hero Vertical) */}
            <div className="relative overflow-hidden lg:col-span-1 lg:row-span-2 bg-[#312783] text-white rounded-3xl p-8 transition-transform hover:-translate-y-1 shadow-sm flex flex-col min-h-[450px]">
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
            </div>

            {/* Card 2 (Gigante Central) */}
            <div className="relative overflow-hidden lg:col-span-2 lg:row-span-2 bg-white text-[#1d1d30] rounded-3xl p-8 transition-transform hover:-translate-y-1 shadow-sm flex flex-col justify-center min-h-[450px]">
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
            </div>

            {/* Card 3 (Quadrado Top Right) */}
            <div className="relative overflow-hidden lg:col-span-1 lg:row-span-1 bg-slate-50 text-[#1d1d30] rounded-3xl p-8 transition-transform hover:-translate-y-1 shadow-sm flex flex-col min-h-[250px]">
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
            </div>

            {/* Card 4 (Quadrado Bottom Right) */}
            <div className="relative overflow-hidden lg:col-span-1 lg:row-span-1 bg-white text-[#1d1d30] rounded-3xl p-8 transition-transform hover:-translate-y-1 shadow-sm flex flex-col justify-center items-center text-center min-h-[250px]">
              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#a9dbe9]/40 blur-3xl rounded-full"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <Lightbulb className="w-12 h-12 text-[#312783] mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-2">Inteligência Ativa</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Alertas para atuar no que importa e identificar gargalos.
                </p>
              </div>
            </div>

            {/* Card 5 (Largo Bottom Left) */}
            <div className="relative overflow-hidden lg:col-span-2 lg:row-span-1 bg-white text-[#1d1d30] rounded-3xl p-8 transition-transform hover:-translate-y-1 shadow-sm flex flex-col md:flex-row items-center min-h-[200px]">
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
            </div>

            {/* Card 6 (Largo Bottom Right) */}
            <div className="relative overflow-hidden lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-[#312783] to-[#4a3b9c] text-white rounded-3xl p-8 transition-transform hover:-translate-y-1 shadow-sm flex flex-col md:flex-row items-center min-h-[200px]">
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
            </div>

            {/* New Card 1 (Visão Executiva Clara) */}
            <div className="relative overflow-hidden lg:col-span-1 lg:row-span-1 bg-[#d4d3f4] rounded-3xl p-8 transition-transform hover:-translate-y-1 shadow-sm flex flex-col min-h-[250px]">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-6 bg-white text-[#312783]">
                <LineChart className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#312783]">Visão Executiva Clara</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Indicadores e painéis objetivos desenhados especificamente para a diretoria e gerência acompanharem o pulso do negócio.
              </p>
            </div>

            {/* New Card 2 (Segmentação Estratégica) */}
            <div className="relative overflow-hidden lg:col-span-2 lg:row-span-1 bg-white rounded-3xl p-8 transition-transform hover:-translate-y-1 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center min-h-[250px]">
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
            </div>

            {/* New Card 3 (Ações Guiadas por Dados) */}
            <div className="relative overflow-hidden lg:col-span-1 lg:row-span-1 bg-[#312783] rounded-3xl p-8 transition-transform hover:-translate-y-1 shadow-sm flex flex-col min-h-[250px]">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mb-6 bg-white/10 text-white backdrop-blur-sm">
                <Lightbulb className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Ações Guiadas por Dados</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Receba recomendações de ação baseadas em dados reais, transformando informações dispersas em próximos passos claros.
              </p>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="bg-gradient-to-r from-[#312783] to-[#009a93] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-md w-full sm:w-auto">
              Solicitar demonstração
            </button>
            <button className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 w-full sm:w-auto">
              Ver em passos
            </button>
          </div>
        </motion.div>
      </section>

      {/* Demonstration Form Section (Split Card) */}
      <section className="py-24 md:py-32 px-4 flex items-center justify-center bg-gradient-to-br from-[#312783] via-[#312783] to-[#009a93]/80">
        {/* Main Card Container */}
        <motion.div {...fadeInUp} className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row rounded-[2rem] overflow-hidden shadow-2xl shadow-black/40">
          
          {/* Left Column (Gradient Block) */}
          <div className="w-full lg:w-1/2 min-h-[250px] lg:min-h-full bg-gradient-to-br from-[#009a93] to-[#312783]"></div>
          
          {/* Right Column (B2B Form) */}
          <div className="w-full lg:w-1/2 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold font-atkinson text-[#1d1d30] leading-tight mb-2">
              Agende sua demonstração
            </h2>
            <p className="text-gray-500 mb-10">
              Descubra como a Nortyn pode dar previsibilidade total para as metas da sua equipe.
            </p>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="col-span-full">
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">Nome completo</label>
                <input 
                  type="text" 
                  id="fullName" 
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
                  placeholder="Ex: Diretor, Gerente" 
                  className="bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#009a93] focus:border-transparent outline-none transition-all w-full"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="button"
                className="col-span-full w-full mt-4 bg-[#009a93] text-white font-semibold text-lg rounded-lg py-4 transition-all duration-300 hover:scale-[1.03] hover:bg-[#00807a]"
              >
                Solicitar demonstração
              </button>
            </form>

            {/* Trust Footer */}
            <p className="text-xs text-gray-400 text-center mt-6">
              Seus dados estão seguros conosco. Não enviamos spam.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Quem é a Nortyn Section (Editorial Style) */}
      <section className="w-full bg-white py-24 md:py-32 overflow-hidden">
        <motion.div {...fadeInUp} className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Copy & Oversized Typography) */}
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
          <div className="relative w-full h-full min-h-[500px] rounded-[2rem]">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
              alt="Profissional corporativo" 
              className="w-full h-full object-cover rounded-[2rem] shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>

        </motion.div>
      </section>

      {/* Pre-Footer CTA Section (Floating Banner) */}
      <section className="w-full bg-white py-24 px-4">
        {/* Banner Container */}
        <motion.div {...fadeInUp} className="max-w-6xl mx-auto relative rounded-[2.5rem] shadow-2xl overflow-hidden bg-gradient-to-br from-[#312783] to-[#009a93]">
          
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
              {/* Primary Button */}
              <button className="bg-[#009a93] text-white rounded-lg px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-[#00807a] shadow-lg">
                Agendar demonstração personalizada
              </button>
              
              {/* Secondary Button */}
              <button className="bg-transparent border-2 border-white text-white font-semibold text-lg rounded-lg px-8 py-4 transition-all duration-300 hover:scale-105 hover:bg-white/10">
                Rever benefícios
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#312783] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Column 1 (Marca e Redes Sociais) */}
          <div className="md:col-span-2">
            <span className="text-3xl font-bold text-white mb-6 block font-atkinson">Nortyn</span>
            <p className="text-white/80 text-lg mb-8 max-w-sm">
              Orienta decisões que importam.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-white hover:text-[#009a93] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-[#009a93] transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-[#009a93] transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Column 2 (Navegação) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Menu</h3>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Empresa</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Benefícios</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Sobre nós</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Agendar Demonstração</a></li>
            </ul>
          </div>

          {/* Column 3 (Contato e Legal) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contato</h3>
            <ul className="flex flex-col gap-4">
              <li><a href="mailto:contato@nortyn.com.br" className="text-white/70 hover:text-white transition-colors text-sm">contato@nortyn.com.br</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Termos de Uso</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors text-sm">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>

        {/* Faixa Inferior de Copyright */}
        <div className="w-full bg-[#009a93] py-4 px-4 text-center">
          <p className="text-sm text-white font-medium">
            © 2026 Nortyn. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
