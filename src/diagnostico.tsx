import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, Image as ImageIcon, MoreVertical, ArrowUpRight, FileSpreadsheet, EyeOff, Target, Brain, TrendingDown, Users, ChevronDown, Check, Info, Aperture, Circle, Square, Triangle, Hexagon, Octagon, Box, Linkedin, Instagram, Facebook, Youtube, Music, Mail, Phone, MapPin, ArrowUp, Activity, Zap, Globe } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import BrandGlow from './components/BrandGlow';
import BrandNetwork from './components/BrandNetwork';
import EditableElement from './components/EditableElement';

import { siteConfig } from './config/siteConfig';

export default function Diagnostico() {
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    revenue: '',
    sector: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [socialLinks, setSocialLinks] = useState<any[]>([
    { id: 1, platform: 'instagram', url: siteConfig.socialLinks.instagram, is_active: true },
    { id: 2, platform: 'facebook', url: siteConfig.socialLinks.facebook, is_active: true },
  ]);
  const [appSettings, setAppSettings] = useState<any>(null);

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch('/api/social-links');
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data);
        }
      } catch (error) {
        console.error('Erro ao carregar redes sociais:', error);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setAppSettings(data);
          
          // Inject Scripts
          if (data.head_scripts) {
            const head = document.head;
            const div = document.createElement('div');
            div.innerHTML = data.head_scripts;
            Array.from(div.children).forEach(child => {
              if (child.tagName === 'SCRIPT') {
                const s = document.createElement('script');
                Array.from(child.attributes).forEach(attr => s.setAttribute(attr.name, attr.value));
                s.innerHTML = child.innerHTML;
                head.appendChild(s);
              } else {
                head.appendChild(child.cloneNode(true));
              }
            });
          }
          if (data.body_scripts) {
            const body = document.body;
            const div = document.createElement('div');
            div.innerHTML = data.body_scripts;
            Array.from(div.children).forEach(child => {
              if (child.tagName === 'SCRIPT') {
                const s = document.createElement('script');
                Array.from(child.attributes).forEach(attr => s.setAttribute(attr.name, attr.value));
                s.innerHTML = child.innerHTML;
                body.appendChild(s);
              } else {
                body.appendChild(child.cloneNode(true));
              }
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    fetchSocialLinks();
    fetchSettings();
  }, []);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'tiktok': return <Music className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    let formatted = '';
    
    if (digits.length === 0) {
      formatted = '';
    } else if (digits.length <= 2) {
      formatted = `(${digits}`;
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }

    setPhone(formatted);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Por favor, preencha nome e e-mail.');
      return;
    }

    setStatus('loading');

    try {
      const webhookUrl = appSettings?.webhook_url || 'https://n8n.hvjtech.com.br/webhook-test/tfaa_iniciaConversa';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone,
          source: "Diagnóstico"
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', role: '', revenue: '', sector: '' });
        setPhone('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen text-nortyn-text font-sans antialiased relative overflow-x-hidden selection:bg-nortyn-secondary selection:text-white pt-16 md:pt-0">
      <div className={`transition-all duration-500`}>
        {/* Efeito: Fundo Global Fixo com Ambient Glow e Grid */}
        <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none bg-nortyn-bg">
          <BrandGlow />

          {/* Camada de Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}>
          </div>
        </div>

        {/* HEADER */}
        <header className="container mx-auto px-6 py-8 flex items-center justify-between relative z-20">
          {/* Esquerda: Logo & Tagline */}
          <div className="flex flex-col">
            <a href="/" className="flex items-center gap-2">
              <img src="/nortyn-bco.png" alt="Nortyn" className="h-10 md:h-12 w-auto" />
            </a>
          </div>

          {/* Centro: Navegação (Oculto no Mobile) */}
          <nav className="hidden lg:flex items-center gap-10">
            <a href="#sintomas" className="text-sm font-medium text-gray-300 hover:text-nortyn-secondary hover:drop-shadow-[0_0_8px_rgba(0,154,147,0.5)] transition-all duration-300">Sintomas</a>
            <a href="#diagnostico" className="text-sm font-medium text-gray-300 hover:text-nortyn-secondary hover:drop-shadow-[0_0_8px_rgba(0,154,147,0.5)] transition-all duration-300">Diagnóstico</a>
            <a href="#iniciar" className="text-sm font-medium text-gray-300 hover:text-nortyn-secondary hover:drop-shadow-[0_0_8px_rgba(0,154,147,0.5)] transition-all duration-300">Iniciar</a>
            <a href="#nortyn" className="text-sm font-medium text-gray-300 hover:text-nortyn-secondary hover:drop-shadow-[0_0_8px_rgba(0,154,147,0.5)] transition-all duration-300">Quem é a Nortyn</a>
          </nav>

          {/* Direita: CTA Secundário */}
          <div className="hidden md:block">
            <a href="#iniciar" className="inline-flex items-center justify-center px-6 py-2.5 border border-white/20 rounded-full text-sm font-medium text-white hover:bg-white/5 hover:border-nortyn-secondary/60 hover:text-nortyn-secondary transition-all duration-300">
              Quero avaliar minha gestão
            </a>
          </div>

          {/* Menu Mobile Toggle */}
          <button className="lg:hidden text-white p-2">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* SECTION 01: HERO */}
        <section className="container mx-auto px-6 pt-12 pb-24 lg:pt-20 lg:pb-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

            {/* Coluna Esquerda: Conteúdo */}
            <div className="flex flex-col items-start gap-8 max-w-2xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center">
                <EditableElement
                  contentKey="hero.eyebrow"
                  defaultContent="Diagnóstico de Maturidade Comercial"
                  as="span"
                  className="text-xs font-bold tracking-[0.3em] text-nortyn-secondary uppercase"
                />
              </div>

              {/* H1 Title */}
              <EditableElement
                contentKey="hero.title"
                defaultContent="Orienta decisões<br/>que importam<br/>na sua gestão comercial."
                as="h1"
                className="text-6xl lg:text-7xl xl:text-[5rem] font-atkinson font-light text-white tracking-tight leading-[1.1]"
              />

              {/* Subtitle */}
              <EditableElement
                contentKey="hero.subtitle"
                defaultContent="Menos planilha. Melhor decisão. Melhores resultados."
                as="p"
                className="text-lg lg:text-xl text-nortyn-muted leading-relaxed font-medium max-w-lg"
              />

              {/* CTA Principal */}
              <div className="pt-2">
                <a href="#iniciar" className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-nortyn-secondary text-white font-semibold text-lg hover:bg-[#00b3ab] transition-all duration-300 shadow-[0_0_20px_rgba(0,154,147,0.35)] hover:shadow-[0_0_35px_rgba(0,154,147,0.6)] hover:-translate-y-1">
                  Quero avaliar minha gestão
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>

            {/* Coluna Direita: Visual (Cérebro Animado) */}
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] flex flex-col items-center justify-center p-0 group overflow-visible">
              <BrandNetwork />
            </div>

          </div>
        </section>

        {/* SECTION 02: VALUE PROPOSITION */}
        <section className="container mx-auto px-6 pb-24 relative z-10">
          <div className="bg-white w-full rounded-[40px] py-24 px-6 md:py-40 md:px-12 relative overflow-hidden shadow-2xl">

            {/* Cabeçalho da Seção */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
              <EditableElement
                contentKey="value.header.title"
                defaultContent="Um raio-X claro da sua operação em poucos minutos."
                as="h2"
                className="text-slate-900 text-4xl md:text-5xl font-atkinson font-semibold tracking-tight leading-tight mb-6"
              />
              <EditableElement
                contentKey="value.header.subtitle"
                defaultContent="Descubra o nível de maturidade da sua área comercial, identifique onde é possível ganhar tempo, reduzir erros e estruturar planos de ação mais consistentes."
                as="p"
                className="text-gray-500 text-lg md:text-xl leading-relaxed"
              />
            </div>

            {/* Grid de Cards (Bento-Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16 items-center">

              {/* Card 1 */}
              <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-8 flex flex-col justify-between h-full min-h-[420px] transition-transform duration-300 hover:-translate-y-2">
                <div className="flex justify-between items-start">
                  <EditableElement
                    contentKey="value.card1.number"
                    defaultContent="01"
                    as="span"
                    className="text-4xl font-bold text-slate-800 tracking-tighter"
                  />
                </div>
                <div className="mt-8">
                  <EditableElement
                    contentKey="value.card1.title"
                    defaultContent="Visão clara sobre metas."
                    as="h3"
                    className="text-3xl font-bold text-slate-900 mb-6 leading-snug"
                  />
                  {/* Visual: Animated Target */}
                  <div className="bg-white rounded-2xl p-6 mt-6 flex flex-col items-center justify-center border border-gray-200 min-h-[160px] shadow-sm overflow-hidden">
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-nortyn-primary/20 scale-150"
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="relative z-10 w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-nortyn-primary border border-gray-100"
                      >
                        <Target className="w-8 h-8" />
                      </motion.div>
                    </div>
                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-6">
                      Foco em Resultados
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2 - DESTAQUE */}
              <div className="bg-nortyn-secondary rounded-[32px] p-8 flex flex-col justify-between h-full min-h-[420px] shadow-2xl shadow-nortyn-secondary/30 transform md:-translate-y-4 transition-transform duration-300 hover:-translate-y-6">
                <div className="flex justify-between items-start">
                  <EditableElement
                    contentKey="value.card2.number"
                    defaultContent="02"
                    as="span"
                    className="text-4xl font-bold text-white tracking-tighter"
                  />
                </div>
                <div className="mt-8">
                  <EditableElement
                    contentKey="value.card2.title"
                    defaultContent="Análise de previsibilidade."
                    as="h3"
                    className="text-3xl font-bold text-white mb-6 leading-snug"
                  />
                  {/* Visual: Animated Chart */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 mt-6 flex flex-col items-center justify-center border border-white/20 min-h-[160px] shadow-inner">
                    <div className="flex items-end gap-2.5 h-16 mb-4">
                      {[0.4, 0.7, 1, 0.8, 0.6].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h * 100}%` }}
                          animate={{ 
                            height: [`${h * 100}%`, `${(h * 0.85) * 100}%`, `${h * 100}%`],
                          }}
                          transition={{ 
                            height: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
                            initial: { duration: 0.8, delay: i * 0.1 }
                          }}
                          className="w-4 bg-nortyn-secondary rounded-t-sm"
                        />
                      ))}
                    </div>
                    <span className="text-nortyn-secondary font-bold text-[10px] uppercase tracking-[0.2em]">
                      Dados em Tempo Real
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-8 flex flex-col justify-between h-full min-h-[420px] transition-transform duration-300 hover:-translate-y-2">
                <div className="flex justify-between items-start">
                  <EditableElement
                    contentKey="value.card3.number"
                    defaultContent="03"
                    as="span"
                    className="text-4xl font-bold text-slate-800 tracking-tighter"
                  />
                </div>
                <div className="mt-8">
                  <EditableElement
                    contentKey="value.card3.title"
                    defaultContent="Melhoria na execução."
                    as="h3"
                    className="text-3xl font-bold text-slate-900 mb-6 leading-snug"
                  />
                  {/* Visual: Animated Execution */}
                  <div className="bg-white rounded-2xl p-6 mt-6 flex flex-col items-center justify-center border border-gray-200 min-h-[160px] shadow-sm">
                    <div className="relative">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, 0, -10, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-[#009a93] border border-gray-100 shadow-inner"
                      >
                        <Zap className="w-8 h-8 fill-current opacity-20 absolute" />
                        <motion.div
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        >
                          <Check className="w-8 h-8 relative z-10" strokeWidth={3} />
                        </motion.div>
                      </motion.div>
                    </div>
                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-6">
                      Execução de Alta Performance
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Rodapé da Seção */}
            <div className="mt-20 flex flex-col items-center text-center">
              <a href="#iniciar" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-nortyn-secondary text-white font-semibold text-lg hover:bg-[#00b3ab] transition-all duration-300 shadow-lg shadow-nortyn-secondary/20 hover:-translate-y-1">
                Ver o que você recebe
              </a>
            </div>

            {/* SECTION 03: PAIN POINTS (Embutido no bloco branco da Seção 2) */}
            <div className="mt-32 md:mt-40 w-full max-w-[1300px] mx-auto">
              <div className="bg-[#0B091E] rounded-[40px] p-8 lg:p-16 shadow-2xl">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                  {/* COLUNA ESQUERDA */}
                  <div className="lg:col-span-5">
                    <div id="sintomas" className="mb-8">
                      <EditableElement
                        contentKey="pain.title"
                        defaultContent="Sinais de que sua empresa pode parar de escalar"
                        as="h2"
                        className="text-4xl md:text-5xl font-black text-white leading-tight mb-6"
                      />
                      <EditableElement
                        contentKey="pain.subtitle"
                        defaultContent="Identifique os gargalos que estão impedindo seu crescimento hoje."
                        as="p"
                        className="text-white/40 text-lg max-w-xl font-medium"
                      />
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <a href="#iniciar" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-nortyn-secondary text-white font-semibold text-lg hover:bg-[#00b3ab] transition-all duration-300 shadow-lg shadow-nortyn-secondary/20 hover:-translate-y-1">
                        Iniciar diagnóstico
                      </a>
                    </div>
                  </div>

                  {/* COLUNA DIREITA */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 transition-all duration-300 hover:shadow-md">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-[#009a93] shadow-inner">
                        <FileSpreadsheet className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-center md:items-start">
                        <EditableElement contentKey="pain.card1.title" defaultContent="Horas excessivas com planilhas" as="h3" className="text-slate-900 font-bold text-lg" />
                        <EditableElement contentKey="pain.card1.desc" defaultContent="Consolidação manual, retrabalho e risco constante de erro." as="p" className="text-gray-500 text-sm mt-1 leading-relaxed" />
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 transition-all duration-300 hover:shadow-md">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-[#009a93] shadow-inner">
                        <EyeOff className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-center md:items-start">
                        <EditableElement contentKey="pain.card2.title" defaultContent="Falta de visão das vendas" as="h3" className="text-slate-900 font-bold text-lg" />
                        <EditableElement contentKey="pain.card2.desc" defaultContent="Você descobre o resultado tarde demais para agir." as="p" className="text-gray-500 text-sm mt-1 leading-relaxed" />
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 transition-all duration-300 hover:shadow-md">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-[#009a93] shadow-inner">
                        <Target className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-center md:items-start">
                        <EditableElement contentKey="pain.card3.title" defaultContent="Metas mal distribuídas" as="h3" className="text-slate-900 font-bold text-lg" />
                        <EditableElement contentKey="pain.card3.desc" defaultContent="Dificuldade para equilibrar metas por região ou representante." as="p" className="text-gray-500 text-sm mt-1 leading-relaxed" />
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 transition-all duration-300 hover:shadow-md">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-[#009a93] shadow-inner">
                        <Brain className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-center md:items-start">
                        <EditableElement contentKey="pain.card4.title" defaultContent="Decisão baseada em feeling" as="h3" className="text-slate-900 font-bold text-lg" />
                        <EditableElement contentKey="pain.card4.desc" defaultContent="Poucos indicadores claros para diretoria e gerência." as="p" className="text-gray-500 text-sm mt-1 leading-relaxed" />
                      </div>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 transition-all duration-300 hover:shadow-md">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-[#009a93] shadow-inner">
                        <TrendingDown className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-center md:items-start">
                        <EditableElement contentKey="pain.card5.title" defaultContent="Baixa previsibilidade" as="h3" className="text-slate-900 font-bold text-lg" />
                        <EditableElement contentKey="pain.card5.desc" defaultContent="Projeções frágeis e pouca segurança para planejar." as="p" className="text-gray-500 text-sm mt-1 leading-relaxed" />
                      </div>
                    </div>

                    {/* Card 6 */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 md:gap-6 transition-all duration-300 hover:shadow-md">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-[#009a93] shadow-inner">
                        <Users className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-center md:items-start">
                        <EditableElement contentKey="pain.card6.title" defaultContent="Equipe sem direcionamento claro" as="h3" className="text-slate-900 font-bold text-lg" />
                        <EditableElement contentKey="pain.card6.desc" defaultContent="Falta de acompanhamento prático e comunicação objetiva." as="p" className="text-gray-500 text-sm mt-1 leading-relaxed" />
                      </div>
                    </div>
                  </div>

                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 04: DISCOVERY BENEFITS */}
            <div id="diagnostico" className="mt-32 md:mt-40 w-full max-w-[1300px] mx-auto">
              <div className="bg-gray-50 border border-gray-100 rounded-[40px] p-8 lg:p-16 shadow-lg shadow-gray-200/50">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                  {/* COLUNA ESQUERDA */}
                  <div className="lg:col-span-5">
                    <EditableElement
                      contentKey="discovery.title"
                      defaultContent="O que você descobre com este diagnóstico"
                      as="h2"
                      className="text-slate-900 text-4xl md:text-5xl font-atkinson font-semibold tracking-tight leading-tight mb-6"
                    />
                    <EditableElement
                      contentKey="discovery.subtitle"
                      defaultContent="Um diagnóstico objetivo sobre sua gestão comercial."
                      as="p"
                      className="text-gray-500 text-lg md:text-xl leading-relaxed"
                    />
                  </div>

                  {/* COLUNA DIREITA */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      {[
                        "O nível de maturidade da sua área comercial",
                        "Pontos cegos na gestão de metas e carteira",
                        "Onde há retrabalho e perda de tempo",
                        "Como está sua previsibilidade de vendas",
                        "Quais ações práticas podem melhorar sua execução"
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009a93]/10 flex items-center justify-center text-[#009a93]">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                          <EditableElement
                            contentKey={`discovery.item${idx}`}
                            defaultContent={item}
                            as="span"
                            className="text-slate-700 text-lg font-medium mt-0.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* SECTION 06: ABOUT NORTYN (Moved up) */}
            <div id="nortyn" className="mt-32 md:mt-40 w-full max-w-[1300px] mx-auto relative z-10">
              <div className="bg-white border border-gray-100 rounded-[40px] p-8 lg:p-16 shadow-xl shadow-gray-200/50">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Left Column: Text Content */}
                <div className="flex flex-col items-start">
                  <EditableElement
                    contentKey="about.title"
                    defaultContent="Quem é a Nortyn"
                    as="h2"
                    className="text-slate-900 text-4xl md:text-5xl font-atkinson font-semibold tracking-tight leading-tight mb-6"
                  />
                  <EditableElement
                    contentKey="about.subtitle"
                    defaultContent="A Nortyn nasceu da prática em indústria."
                    as="h3"
                    className="text-nortyn-primary text-xl md:text-2xl font-medium mb-8"
                  />
                  <EditableElement
                    contentKey="about.p1"
                    defaultContent="Nossa equipe soma mais de 25 anos desenvolvendo soluções para áreas comerciais de pequenas e médias indústrias. Conhece a rotina do representante, a cobrança da diretoria e a realidade do chão de fábrica."
                    as="p"
                    className="text-gray-500 text-lg leading-relaxed mb-6"
                  />
                  <EditableElement
                    contentKey="about.p2"
                    defaultContent="A Nortyn organiza dados, apresenta rapidamente as vendas e ajuda a transformar metas em plano de ação. Casos práticos mostram redução de retrabalho, melhoria na previsibilidade e maior aderência do time às metas."
                    as="p"
                    className="text-gray-500 text-lg leading-relaxed mb-10"
                  />

                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <a href="#iniciar" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-nortyn-secondary text-white font-bold text-lg hover:bg-[#00b3ab] transition-colors shadow-lg shadow-nortyn-secondary/20">
                      Quero avaliar minha gestão
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Right Column: Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                  {/* Coluna 1 do Bento */}
                  <div className="flex flex-col gap-4 md:gap-6">
                    {/* Image 1: Static Team Image */}
                    <div className="rounded-[32px] overflow-hidden relative aspect-[4/5] bg-slate-900 border border-white/10 group">
                      <img 
                        src="/img-equipe.png" 
                        alt="Nossa Equipe" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                          <div>
                            <EditableElement contentKey="about.founder.name" defaultContent="Águirra Tech" as="p" className="text-slate-900 font-medium text-sm" />
                            <EditableElement contentKey="about.founder.role" defaultContent="Nossa origem" as="p" className="text-gray-500 text-xs" />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <ArrowUpRight className="w-4 h-4 text-slate-900" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Text Card 1 */}
                    <div className="rounded-[32px] bg-nortyn-primary border border-[#261e66] p-8 shadow-lg">
                      <EditableElement
                        contentKey="about.quote1"
                        defaultContent='"Clareza para diretor, gerência e time de campo trabalharem na mesma direção."'
                        as="p"
                        className="text-white text-lg font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Coluna 2 do Bento */}
                  <div className="flex flex-col gap-4 md:gap-6 sm:pt-12">
                    {/* Text Card 2 */}
                    <div className="rounded-[32px] bg-[#009a93] border border-[#008a84] p-8 shadow-lg">
                      <EditableElement
                        contentKey="about.quote2"
                        defaultContent='"Tecnologia é meio. Resultado é prioridade. A comunicação é direta, simples e respeita a realidade da indústria."'
                        as="p"
                        className="text-white text-lg font-medium leading-relaxed"
                      />
                    </div>

                    {/* Card 2: Brand Color + Animated Icon */}
                    <div className="rounded-[32px] overflow-hidden relative aspect-square bg-[#009a93] border border-white/10 flex items-center justify-center group">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 flex flex-col items-center gap-4"
                      >
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
                          <Users className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-white/80 font-bold text-[10px] uppercase tracking-[0.2em]">
                          Time de Especialistas
                        </span>
                      </motion.div>
                      
                      {/* Decorative Circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: LEAD CAPTURE (Moved down) */}
        <section id="iniciar" className="container mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="w-full max-w-[1300px] mx-auto">
            <div className="mb-8 md:mb-12 text-center w-full mx-auto">
              <EditableElement
                contentKey="lead.title"
                defaultContent="Preencha para iniciar o diagnóstico"
                as="h2"
                className="text-white text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6"
              />
              <EditableElement
                contentKey="lead.subtitle"
                defaultContent="Leva poucos minutos."
                as="p"
                className="text-gray-400 text-lg md:text-xl leading-relaxed"
              />
            </div>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-md border border-[#009a93]/30 p-10 md:p-16 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-2xl"
              >
                <div className="w-20 h-20 bg-[#009a93] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#009a93]/30">
                  <Check className="text-white w-10 h-10" strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Diagnóstico Solicitado com Sucesso!</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  Obrigado pelo seu interesse. Nosso time de especialistas já recebeu suas informações e iniciará a análise da sua gestão comercial. Entraremos em contato em breve pelo e-mail ou WhatsApp fornecido.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/30 transition-all cursor-pointer"
                >
                  Enviar outro diagnóstico
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                <input type="hidden" name="source" value="Diagnóstico" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* Nome completo */}
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Nome completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo"
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009a93]/50 focus:border-[#009a93] transition-all"
                    />
                  </div>

                  {/* E-mail corporativo */}
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">E-mail corporativo</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009a93]/50 focus:border-[#009a93] transition-all"
                    />
                  </div>

                  {/* Telefone ou WhatsApp */}
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Telefone ou WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={handlePhone}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009a93]/50 focus:border-[#009a93] transition-all"
                    />
                  </div>

                  {/* Empresa */}
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Nome da Empresa</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Empresa LTDA"
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#009a93]/50 focus:border-[#009a93] transition-all"
                    />
                  </div>

                  {/* Cargo */}
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Cargo</label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#009a93]/50 focus:border-[#009a93] transition-all"
                      >
                        <option value="" disabled className="text-slate-900">Selecione</option>
                        <option value="diretor" className="text-slate-900">Diretor(a)</option>
                        <option value="gerente" className="text-slate-900">Gerente</option>
                        <option value="coordenador" className="text-slate-900">Coordenador(a)</option>
                        <option value="analista" className="text-slate-900">Analista</option>
                        <option value="outro" className="text-slate-900">Outro</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Segmento de atuação */}
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Segmento de atuação</label>
                    <div className="relative">
                      <select
                        name="sector"
                        value={formData.sector}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#009a93]/50 focus:border-[#009a93] transition-all"
                      >
                        <option value="" disabled className="text-slate-900">Selecione</option>
                        <option value="industria" className="text-slate-900">Indústria</option>
                        <option value="varejo" className="text-slate-900">Varejo</option>
                        <option value="servicos" className="text-slate-900">Serviços</option>
                        <option value="tecnologia" className="text-slate-900">Tecnologia</option>
                        <option value="outro" className="text-slate-900">Outro</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Tamanho da equipe de vendas */}
                  <div className="col-span-1 border-t border-white/5 pt-6 sm:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-semibold text-gray-300 mb-4">Tamanho da equipe de vendas</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "0 - 2 vendedores",
                        "3 - 5 vendedores",
                        "6 - 10 vendedores",
                        "11 - 20 vendedores",
                        "20 - 30 vendedores",
                        "Acima de 30 vendedores"
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, revenue: option }))}
                          className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${formData.revenue === option
                            ? "bg-[#009a93] border-[#009a93] text-white shadow-lg shadow-[#009a93]/30"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full md:w-auto px-10 py-4 font-atkinson rounded-full bg-[#009a93] text-white font-bold text-lg hover:bg-[#00b3ab] transition-colors shadow-lg shadow-[#009a93]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Enviando...' : 'Receber meu diagnóstico'}
                  </button>

                  {status === 'error' && (
                    <p className="mt-4 text-red-400 font-medium">
                      Erro ao enviar. Tente novamente ou use o WhatsApp.
                    </p>
                  )}

                  <p className="mt-6 text-xs text-gray-400 text-center max-w-md leading-relaxed">
                    Seus dados são utilizados apenas para envio do diagnóstico e contato da Nortyn. Eles não são compartilhados com 3ºs públicos.
                  </p>
                </div>
              </form>
            )}
          </div>
        </section>



        {/* FOOTER */}
        <footer className="container mx-auto px-4 md:px-6 pb-12 relative z-10">
          <div className="bg-[#0B091E] rounded-[40px] p-12 md:p-16 border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              {/* Column 1: Brand & Social */}
              <div className="flex flex-col items-center gap-6 max-w-sm">
                <div className="flex items-center gap-3">
                  <img src="/nortyn-bco.png" alt="Nortyn" className="h-10 md:h-12 w-auto" />
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Inteligência de mercado para escalar decisões comerciais com precisão e estratégia.
                </p>
                <div className="flex items-center gap-4">
                  {socialLinks.filter(link => link.is_active).map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-nortyn-secondary hover:border-nortyn-secondary/50 hover:bg-nortyn-secondary/10 transition-all"
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-xs">
                © {new Date().getFullYear()} Nortyn. Todos os direitos reservados.
              </p>
              <p className="text-white/20 text-[10px] uppercase tracking-widest">
                Desenvolvido por <a href="https://www.gaidendesign.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-nortyn-secondary transition-colors">Gaiden Design</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
