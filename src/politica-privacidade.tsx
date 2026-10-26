import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Sliders, Mail, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandGlow from './components/BrandGlow';
import { siteConfig } from './config/siteConfig';

export default function PoliticaPrivacidade() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openCookieModal = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  const finalidadesBasesLegais = [
    {
      finalidade: "Criar e gerenciar sua conta e prestar o serviço",
      dados: "Cadastro, logs de uso",
      baseLegal: "Execução de contrato"
    },
    {
      finalidade: "Cobrança, emissão de notas fiscais e obrigações fiscais",
      dados: "Dados de faturamento",
      baseLegal: "Execução de contrato e cumprimento de obrigação legal"
    },
    {
      finalidade: "Guardar registros de acesso à internet",
      dados: "IP, data e hora de acesso",
      baseLegal: "Cumprimento de obrigação legal (Marco Civil da Internet)"
    },
    {
      finalidade: "Segurança, prevenção a fraudes e auditoria",
      dados: "Logs, IP, dispositivo",
      baseLegal: "Legítimo interesse"
    },
    {
      finalidade: "Suporte e atendimento",
      dados: "Dados de contato, histórico",
      baseLegal: "Execução de contrato e legítimo interesse"
    },
    {
      finalidade: "Responder contatos e demonstrações comerciais",
      dados: "Dados do formulário",
      baseLegal: "Procedimentos preliminares ao contrato e legítimo interesse"
    },
    {
      finalidade: "Melhorar a Plataforma (estatísticas de uso)",
      dados: "Dados de uso e navegação",
      baseLegal: "Legítimo interesse"
    },
    {
      finalidade: "Comunicações de marketing e newsletter",
      dados: "Nome, e-mail",
      baseLegal: "Consentimento (você pode revogar a qualquer momento)"
    },
    {
      finalidade: "Cookies analíticos e de marketing",
      dados: "Dados de navegação",
      baseLegal: "Consentimento"
    },
    {
      finalidade: "Defesa em processos judiciais ou administrativos",
      dados: "Dados necessários ao caso",
      baseLegal: "Exercício regular de direitos"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B091E] text-white font-sans selection:bg-[#009a93] selection:text-white relative overflow-hidden">
      {/* Luzes decorativas */}
      <BrandGlow />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-r from-[#312783]/25 via-[#009a93]/20 to-transparent blur-[140px] pointer-events-none" />

      {/* Header Superior */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B091E]/85 border-b border-white/10 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/nortyn-bco.png" 
              alt="Nortyn" 
              className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#009a93]" />
              <span>Voltar ao início</span>
            </Link>

            <Link
              to="/#demonstracao"
              className="hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-[#312783] to-[#009a93] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-95 shadow-md shadow-[#009a93]/20 transition-all duration-300 hover:scale-[1.02]"
            >
              Agendar demonstração
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        
        {/* Cabeçalho do Documento */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#009a93] text-xs font-semibold tracking-wide uppercase mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>LGPD • Lei nº 13.709/2018</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Política de Privacidade
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/60">
            <span>21 de outubro de 2026</span>
            <span className="hidden sm:inline">•</span>
            <a 
              href="mailto:contato@aguirratech.com.br" 
              className="text-[#009a93] hover:underline"
            >
              contato@aguirratech.com.br
            </a>
            <span className="hidden sm:inline">•</span>
            <span>Última atualização: 21/10/2026</span>
            <span className="hidden sm:inline">•</span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium text-xs">
              Versão: 1.0
            </span>
          </div>
        </div>

        {/* Card do Conteúdo */}
        <div className="bg-[#100d2b]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-12 text-white/80 leading-relaxed text-sm sm:text-base">
          
          {/* 1. Introdução e Compromisso com a Privacidade */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Introdução e Compromisso com a Privacidade
              </h2>
            </div>
            
            <p>
              A <strong>T.F. de Arruda e Aguirre</strong> (CNPJ nº <strong>26.522.019/0001-91</strong>, com sede em <strong>Rua Conceição 233, Cj. 916, Campinas, SP</strong>), doravante chamada <strong>ÁguirraTech</strong>, responsável pela plataforma <strong>Nortyn</strong> (&quot;Plataforma&quot;) e pelos sites <strong>aguirratech.com.br</strong> e <strong>nortyn.com.br</strong> (em conjunto ou individualmente, &quot;Site&quot;), respeita a sua privacidade e protege os dados pessoais que passam por nossos serviços.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <p className="font-semibold text-white">Esta Política explica, de forma clara:</p>
              <ul className="space-y-1.5 pl-1">
                {[
                  "quais dados coletamos e por quê;",
                  "com quem compartilhamos;",
                  "como protegemos;",
                  "como você pode exercer seus direitos."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p>
              Ela está de acordo com a <strong>Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018)</strong> e se aplica a visitantes do Site, usuários da Plataforma e clientes contratantes.
            </p>
          </section>

          {/* 2. Definições Importantes */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Definições Importantes
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1">
              {[
                { term: "Dado Pessoal", desc: "informação que identifica ou pode identificar uma pessoa (nome, e-mail, CPF, IP etc.)." },
                { term: "Titular", desc: "a pessoa a quem os dados se referem. Pode ser você." },
                { term: "Tratamento", desc: "qualquer operação com dados pessoais: coletar, armazenar, consultar, compartilhar, excluir etc." },
                { term: "Controlador", desc: "quem decide como e para que os dados são tratados." },
                { term: "Operador", desc: "quem trata dados em nome do Controlador, seguindo as instruções dele." },
                { term: "Encarregado (DPO)", desc: "pessoa indicada para ser o canal de comunicação entre a empresa, os titulares e a Autoridade Nacional de Proteção de Dados (ANPD). Agentes de tratamento de pequeno porte podem ser dispensados dessa indicação, mas devem manter um canal de contato com os titulares." },
                { term: "Cliente", desc: "empresa ou pessoa que contrata a Plataforma." },
                { term: "Usuário", desc: "pessoa que acessa a Plataforma, como funcionário ou representante do Cliente." },
              ].map((def, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white block sm:inline">{def.term}: </strong>
                    <span className="text-white/70">{def.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Quais Dados Coletamos e Como */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Quais Dados Coletamos e Como
              </h2>
            </div>

            {/* 3.1 Visitantes do Site */}
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-[#009a93]">3.1</span> Visitantes do Site
              </h3>
              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Dados de navegação: </strong>
                    <span className="text-white/70">endereço IP, tipo de navegador e dispositivo, páginas visitadas, tempo de acesso e origem do acesso. São coletados automaticamente, por cookies e tecnologias semelhantes.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Formulários de contato e solicitação de demonstração: </strong>
                    <span className="text-white/70">nome, e-mail, telefone, empresa, cargo e a mensagem que você enviar.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Newsletter e materiais: </strong>
                    <span className="text-white/70">nome e e-mail.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 3.2 Usuários e Clientes da Plataforma */}
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-[#009a93]">3.2</span> Usuários e Clientes da Plataforma
              </h3>
              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Cadastro: </strong>
                    <span className="text-white/70">nome, e-mail, telefone, cargo, CPF/CNPJ, razão social e dados de acesso. A senha é armazenada de forma criptografada (hash).</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Faturamento e cobrança: </strong>
                    <span className="text-white/70">dados cadastrais da empresa, endereço de cobrança e histórico de pagamentos. Não armazenamos dados completos de cartão. Eles são tratados diretamente pelo meio de pagamento.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Logs de acesso e uso: </strong>
                    <span className="text-white/70">endereço IP, data e hora, dispositivo, navegador e ações realizadas na Plataforma. Servem para segurança, auditoria e cumprimento de obrigação legal.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Suporte: </strong>
                    <span className="text-white/70">o conteúdo das solicitações que você nos envia e o histórico de atendimento.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 3.3 Dados Inseridos pelos Clientes na Plataforma */}
            <div className="space-y-3 bg-white/5 border border-[#009a93]/30 rounded-2xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-[#009a93]">3.3</span> Dados Inseridos pelos Clientes na Plataforma
              </h3>
              <p className="text-white/70">
                Ao usar a Plataforma, o Cliente pode inserir informações como cadastros de clientes finais, representantes comerciais, pedidos, valores, pesos e históricos de compra, que podem incluir dados pessoais de terceiros.
              </p>
              
              <div className="pt-2">
                <p className="text-white font-semibold mb-2">Nosso papel nesse caso:</p>
                <ul className="space-y-2 pl-1">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-white">O Cliente é o Controlador desses dados: </strong>
                      <span className="text-white/70">ele decide quais dados inserir e para que usá-los.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-white">A ÁguirraTech atua como Operadora: </strong>
                      <span className="text-white/70">trata esses dados apenas para prestar o serviço contratado e conforme as instruções do Cliente, em contrato.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                    <span className="text-white/70">Não usamos esses dados para marketing próprio, nem os vendemos ou compartilhamos para fins distintos do serviço.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                    <span className="text-white/70">Se você é titular de dados inseridos por um Cliente nosso (por exemplo, é cliente ou representante dele), direcione seu pedido ao Cliente. Nós o ajudaremos a atendê-lo.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Finalidades e Bases Legais do Tratamento (Tabela formatada) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Finalidades e Bases Legais do Tratamento
              </h2>
            </div>

            <p className="text-white/70">
              A tabela abaixo apresenta os tipos de dados tratados, sua respectiva finalidade e o enquadramento nas bases legais da LGPD (art. 7º):
            </p>

            <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-lg">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#312783]/50 border-b border-white/10 text-white font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Finalidade</th>
                    <th className="py-3.5 px-4 sm:px-6">Dados</th>
                    <th className="py-3.5 px-4 sm:px-6">Base legal (LGPD, art. 7º)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {finalidadesBasesLegais.map((item, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="py-3 px-4 sm:px-6 font-medium text-white/90 align-top">
                        {item.finalidade}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-white/70 align-top">
                        {item.dados}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-[#009a93] font-medium align-top">
                        {item.baseLegal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs sm:text-sm text-white/60 italic pt-1">
              Quando usamos o legítimo interesse, avaliamos o impacto sobre você e adotamos medidas para proteger seus direitos.
            </p>
          </section>

          {/* 5. Uso de Cookies e Tecnologias de Rastreamento */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Uso de Cookies e Tecnologias de Rastreamento
              </h2>
            </div>

            <p>
              Cookies são pequenos arquivos gravados no seu dispositivo quando você acessa o Site ou a Plataforma.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block text-sm mb-1">Essenciais:</strong>
                <p className="text-xs sm:text-sm text-white/70">
                  Necessários para o funcionamento e a segurança (login, sessão, preferências). Não podem ser desativados na Plataforma.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block text-sm mb-1">Analíticos:</strong>
                <p className="text-xs sm:text-sm text-white/70">
                  Mostram como o Site e a Plataforma são usados, para melhorarmos o serviço. Exigem seu consentimento.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <strong className="text-white block text-sm mb-1">Marketing:</strong>
                <p className="text-xs sm:text-sm text-white/70">
                  Medem a eficácia de campanhas e personalizam comunicações. Exigem seu consentimento.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="font-semibold text-white">Como gerenciar:</p>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <span>Pelo banner de cookies do Site, onde você aceita, recusa ou personaliza as categorias.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <span>Pelas configurações do seu navegador, apagando ou bloqueando cookies. Isso pode afetar o funcionamento de algumas funções.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <span>Você pode alterar sua escolha a qualquer momento através do painel de preferências de cookies.</span>
                </li>
              </ul>
            </div>

            {/* Painel Interativo de Cookies */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#312783]/40 via-[#009a93]/20 to-transparent border border-[#009a93]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Preferências de Cookies do Navegador</p>
                <p className="text-xs text-white/70">Abra o painel interativo para aceitar, recusar ou customizar as categorias de cookies da Nortyn.</p>
              </div>
              <button
                type="button"
                onClick={openCookieModal}
                className="inline-flex items-center gap-2 bg-[#009a93] hover:bg-[#009a93]/90 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer hover:scale-105 flex-shrink-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Gerenciar Cookies</span>
              </button>
            </div>
          </section>

          {/* 6. Compartilhamento de Dados com Terceiros */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Compartilhamento de Dados com Terceiros
              </h2>
            </div>

            <p>
              <strong>Não vendemos dados pessoais.</strong> Compartilhamos dados apenas quando necessário, com fornecedores que seguem padrões de segurança e proteção de dados:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <strong className="text-white block text-sm">Infraestrutura em nuvem:</strong>
                <p className="text-xs sm:text-sm text-white/70">
                  <strong>Armata.cloud</strong>: oferece infraestrutura física (equipamentos e conectividade à Internet), sem acesso aos dados coletados.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <strong className="text-white block text-sm">Meios de pagamento:</strong>
                <p className="text-xs sm:text-sm text-white/70">
                  <strong>PayPal</strong>: para processar cobranças com total segurança e criptografia.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <strong className="text-white block text-sm">Ferramentas de analytics:</strong>
                <p className="text-xs sm:text-sm text-white/70">
                  <strong>Google Analytics</strong>: para estatísticas de uso agregadas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <strong className="text-white block text-sm">Autoridades públicas:</strong>
                <p className="text-xs sm:text-sm text-white/70">
                  Apenas quando houver obrigação legal ou ordem judicial.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/60">
              Esses terceiros só podem usar os dados para as finalidades contratadas.
            </p>
          </section>

          {/* 7. Transferência Internacional de Dados */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Transferência Internacional de Dados
              </h2>
            </div>

            <p>
              Alguns de nossos fornecedores, como provedores de nuvem e ferramentas de analytics, podem armazenar ou processar dados em servidores fora do Brasil, em países como Estados Unidos.
            </p>
            <p>
              Nesses casos, adotamos as garantias previstas na LGPD (art. 33), como cláusulas contratuais padrão aprovadas pela ANPD, ou outro mecanismo legal aplicável, além de medidas técnicas como criptografia e controle de acesso.
            </p>
            <p className="text-white/70">
              Você pode pedir mais informações sobre essas transferências pelo canal de contato do item 10.
            </p>
          </section>

          {/* 8. Segurança e Armazenamento dos Dados */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Segurança e Armazenamento dos Dados
              </h2>
            </div>

            {/* 8.1 Medidas adotadas */}
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-[#009a93]">8.1</span> Medidas adotadas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm">
                {[
                  "Criptografia em trânsito (HTTPS/TLS) e, quando aplicável, em repouso.",
                  "Controle de acesso baseado em perfis, com o mínimo necessário para cada função.",
                  "Senhas armazenadas com hash, nunca em texto aberto.",
                  "Backups periódicos e plano de recuperação.",
                  "Registro (logs) e monitoramento de acessos e eventos de segurança.",
                  "Separação lógica dos dados de cada Cliente.",
                  "Treinamento e termos de confidencialidade para colaboradores.",
                  "Revisões periódicas de segurança e de fornecedores."
                ].map((medida, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#009a93] mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">{medida}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/60 italic pt-2">
                Nenhum sistema é 100% imune a falhas. Em caso de incidente que possa gerar risco ou dano relevante, comunicaremos os titulares afetados e a ANPD, conforme a LGPD.
              </p>
            </div>

            {/* 8.2 Tempo de retenção */}
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-[#009a93]">8.2</span> Tempo de retenção
              </h3>
              <ul className="space-y-2 pl-1 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Dados de cadastro e da conta: </strong>
                    <span className="text-white/70">enquanto o contrato estiver ativo.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Dados fiscais e de faturamento: </strong>
                    <span className="text-white/70">pelo prazo exigido em lei (em geral, 5 anos).</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Logs de acesso a aplicações: </strong>
                    <span className="text-white/70">por no mínimo 6 meses, conforme o Marco Civil da Internet.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Dados de contato comercial (sem contrato): </strong>
                    <span className="text-white/70">1 ano ou até você pedir a exclusão.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Dados inseridos pelos Clientes: </strong>
                    <span className="text-white/70">durante o contrato. Após o encerramento, ficam disponíveis para exportação por 90 dias e depois são excluídos ou anonimizados, salvo obrigação legal de retenção.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009a93] mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Backups: </strong>
                    <span className="text-white/70">são sobrescritos ou eliminados em ciclo de até 7 dias.</span>
                  </div>
                </li>
              </ul>
              <p className="text-xs text-white/60 pt-1">
                Findo o prazo, os dados são excluídos ou anonimizados.
              </p>
            </div>
          </section>

          {/* 9. Direitos dos Titulares */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                9
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Direitos dos Titulares
              </h2>
            </div>

            <p>
              Pela <strong>LGPD (art. 18)</strong>, você pode solicitar a qualquer momento:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm">
              {[
                "Confirmação de que tratamos seus dados;",
                "Acesso aos seus dados;",
                "Correção de dados incompletos, inexatos ou desatualizados;",
                "Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade;",
                "Portabilidade dos dados;",
                "Eliminação dos dados tratados com base no consentimento;",
                "Informação sobre com quem compartilhamos seus dados;",
                "Informação sobre a possibilidade de não consentir e suas consequências;",
                "Revogação do consentimento, sem prejuízo do tratamento já realizado;",
                "Oposição a tratamento feito sem consentimento, em caso de descumprimento da lei;",
                "Revisão de decisões tomadas exclusivamente de forma automatizada, quando houver."
              ].map((direito, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#009a93] flex-shrink-0" />
                  <span className="text-white/90">{direito}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#312783]/30 border border-[#312783] rounded-2xl p-5 space-y-2 mt-4">
              <p className="font-semibold text-white">Como exercer seus direitos:</p>
              <p className="text-xs sm:text-sm text-white/80">
                Envie sua solicitação pelo canal de contato do item 10. Poderemos pedir informações para confirmar sua identidade, para proteger você. Responderemos em até <strong>15 dias</strong>.
              </p>
              <p className="text-xs text-white/70 pt-1">
                <strong>Atenção:</strong> se seus dados foram inseridos por um Cliente nosso (item 3.3), o pedido deve ser dirigido a ele, que é o Controlador. Se você nos procurar, encaminharemos ou orientaremos.
              </p>
              <p className="text-xs text-white/60 pt-1">
                Você também pode reclamar à ANPD (<a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-[#009a93] underline hover:text-white">www.gov.br/anpd</a>).
              </p>
            </div>
          </section>

          {/* 10. Canal de Contato sobre Privacidade */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                10
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Canal de Contato sobre Privacidade
              </h2>
            </div>

            <p>
              Para exercer seus direitos ou tirar dúvidas sobre esta Política, fale com a <strong>ÁguirraTech</strong> pelo canal abaixo. Por ser agente de tratamento de pequeno porte, a ÁguirraTech está dispensada de indicar um Encarregado (DPO), conforme a regulamentação da ANPD, e mantém este canal de comunicação com os titulares.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Mail className="w-4 h-4 text-[#009a93]" />
                  <span>E-mail de Contato</span>
                </div>
                <a 
                  href="mailto:contato@aguirratech.com.br"
                  className="text-sm font-semibold text-[#009a93] hover:underline block"
                >
                  contato@aguirratech.com.br
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <MapPin className="w-4 h-4 text-[#009a93]" />
                  <span>Endereço</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80">
                  Rua Conceição 233, Cj. 916, Campinas, SP
                </p>
              </div>
            </div>
          </section>

          {/* 11. Alterações nesta Política */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#312783]/60 border border-[#312783] text-[#009a93] flex items-center justify-center font-bold text-sm">
                11
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Alterações nesta Política
              </h2>
            </div>

            <p>
              Podemos atualizar esta Política para refletir mudanças legais, técnicas ou em nossos serviços. A versão vigente estará sempre disponível no Site e na Plataforma, com a data da última atualização no topo.
            </p>
            <p className="text-white/70">
              Em mudanças relevantes, avisaremos por e-mail ou aviso na Plataforma. Se a alteração exigir novo consentimento, ele será solicitado novamente.
            </p>
          </section>

        </div>
      </main>

      {/* Rodapé Nortyn */}
      <footer className="w-full bg-[#312783] text-white mt-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-14 flex flex-col items-center text-center">
          <Link to="/" className="inline-block mb-6">
            <img src="/nortyn-bco.png" alt="Nortyn" className="h-[50px] w-auto" />
          </Link>
          <p className="text-white/80 text-base mb-6 max-w-sm">
            {siteConfig.footer.tagline}
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/75 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Página Inicial
            </Link>
            <Link to="/diagnostico" className="hover:text-white transition-colors">
              Diagnóstico Comercial
            </Link>
            <button 
              type="button"
              onClick={openCookieModal}
              className="hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
            >
              Configurações de Cookies
            </button>
          </div>
        </div>

        {/* Faixa de Copyright */}
        <div className="w-full bg-[#009a93] py-4 px-4 text-center">
          <p className="text-sm text-white font-medium">
            {siteConfig.footer.copyright} | Desenvolvido por <a href="https://www.gaidendesign.com.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80 transition-colors">Gaiden Design</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
