import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { 
  Loader2, LogOut, Layout, User as UserIcon, Lock, CheckCircle2, 
  ChevronRight, ExternalLink, Settings, Home, FileText, MessageSquare, Plus, Trash2, Edit2, X
} from 'lucide-react';
import BrandGlow from './BrandGlow';

type Tab = 'pages' | 'testimonials' | 'settings';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  is_active: boolean;
}

interface Testimonial {
  id: number;
  client_name: string;
  company_role: string;
  content: string;
  avatar_url: string;
}

export default function AdminDashboard() {
  const { user, token, logout, setIsVisualEditing, fetchUser } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('pages');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isSocialsLoading, setIsSocialsLoading] = useState(false);
  const [isSavingSocials, setIsSavingSocials] = useState(false);

  useEffect(() => {
    if (activeTab === 'testimonials') {
      fetchTestimonials();
    }
    if (activeTab === 'settings') {
      fetchSocialLinks();
    }
  }, [activeTab]);

  const fetchTestimonials = async () => {
    setIsTestimonialsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setIsTestimonialsLoading(false);
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    setIsSavingTestimonial(true);

    try {
      const url = editingTestimonial.id 
        ? `http://localhost:3001/api/testimonials/${editingTestimonial.id}`
        : 'http://localhost:3001/api/testimonials';
      
      const method = editingTestimonial.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingTestimonial)
      });

      if (response.ok) {
        setEditingTestimonial(null);
        fetchTestimonials();
        setMessage({ text: 'Depoimento salvo com sucesso!', type: 'success' });
      } else {
        setMessage({ text: 'Erro ao salvar depoimento.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao conectar com o servidor.', type: 'error' });
    } finally {
      setIsSavingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este depoimento?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchTestimonials();
        setMessage({ text: 'Depoimento excluído.', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao excluir depoimento.', type: 'error' });
    }
  };

  const fetchSocialLinks = async () => {
    setIsSocialsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/social-links');
      if (response.ok) {
        const data = await response.json();
        setSocialLinks(data);
      }
    } catch (err) {
      console.error('Error fetching social links:', err);
    } finally {
      setIsSocialsLoading(false);
    }
  };

  const handleUpdateSocialLink = async (id: number, url: string, is_active: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/api/social-links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url, is_active })
      });

      if (response.ok) {
        setSocialLinks(prev => prev.map(link => link.id === id ? { ...link, url, is_active } : link));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating social link:', err);
      return false;
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:3001/api/auth/user', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
        setPassword('');
        await fetchUser();
      } else {
        const data = await response.json();
        setMessage({ text: data.error || 'Erro ao atualizar perfil', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao conectar com o servidor.', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const startVisualEditing = (path: string) => {
    setIsVisualEditing(true);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#060515] text-white flex font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <BrandGlow />
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-[#0B091E]/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-nortyn-secondary rounded-lg flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Painel Admin</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'pages' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Páginas</span>
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'testimonials' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Depoimentos</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nortyn-secondary to-[#312783] flex items-center justify-center text-[10px] font-bold">
              {user?.name?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate">{user?.name}</span>
              <span className="text-[10px] text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#060515]/60 backdrop-blur-md z-30">
          <div>
            <h1 className="text-2xl font-bold">
              {activeTab === 'pages' ? 'Gerenciamento de Páginas' : activeTab === 'testimonials' ? 'Depoimentos dos Clientes' : 'Configurações Gerais'}
            </h1>
            <p className="text-sm text-gray-400">
              {activeTab === 'pages' ? 'Selecione uma página para editar o conteúdo visualmente.' : activeTab === 'testimonials' ? 'Gerencie os depoimentos que aparecem na página institucional.' : 'Gerencie seu perfil e links de redes sociais.'}
            </p>
          </div>
          {activeTab === 'testimonials' && (
            <button 
              onClick={() => setEditingTestimonial({})}
              className="bg-nortyn-secondary hover:bg-[#00b3ab] text-white px-4 py-2 rounded-xl transition-all shadow-lg flex items-center gap-2 text-sm font-bold"
            >
              <Plus className="w-4 h-4" />
              Novo Depoimento
            </button>
          )}
        </header>

        <div className="p-8">
          {message.text && (
            <div className={`rounded-xl p-4 flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              <p className="text-sm font-medium">{message.text}</p>
              <button onClick={() => setMessage({ text: '', type: '' })} className="ml-auto opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nortyn LP Card */}
              <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl overflow-hidden group hover:border-nortyn-secondary/50 transition-all shadow-xl backdrop-blur-sm">
                <div className="h-40 bg-gradient-to-br from-[#312783] to-[#01031b] relative overflow-hidden flex items-center justify-center">
                  <img src="/nortyn-bco.png" className="h-10 opacity-30 group-hover:opacity-60 transition-opacity" alt="Nortyn" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">Institucional Nortyn</h3>
                    <span className="text-[10px] bg-nortyn-secondary/20 text-nortyn-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Página Inicial</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 flex items-center gap-1">
                    <Home className="w-3 h-3" /> /
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => startVisualEditing('/')}
                      className="flex-1 bg-nortyn-secondary hover:bg-[#00b3ab] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-nortyn-secondary/20 flex items-center justify-center gap-2"
                    >
                      <Layout className="w-4 h-4" />
                      Edição Visual
                    </button>
                    <a href="/" target="_blank" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white" title="Ver site">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Diagnostico Card */}
              <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl overflow-hidden group hover:border-nortyn-secondary/50 transition-all shadow-xl backdrop-blur-sm">
                <div className="h-40 bg-gradient-to-br from-[#00a99d]/40 to-[#01031b] relative overflow-hidden flex items-center justify-center">
                  <img src="/nortyn-bco.png" className="h-10 opacity-30 group-hover:opacity-60 transition-opacity" alt="Nortyn" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">Diagnóstico de Vendas</h3>
                    <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">LP Secundária</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> /diagnostico
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => startVisualEditing('/diagnostico')}
                      className="flex-1 bg-nortyn-secondary hover:bg-[#00b3ab] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-nortyn-secondary/20 flex items-center justify-center gap-2"
                    >
                      <Layout className="w-4 h-4" />
                      Edição Visual
                    </button>
                    <a href="/diagnostico" target="_blank" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white" title="Ver site">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="flex flex-col gap-6">
              {isTestimonialsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-nortyn-secondary opacity-50" />
                </div>
              ) : testimonials.length === 0 ? (
                <div className="bg-[#0B091E]/60 border border-dashed border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Nenhum depoimento encontrado</h3>
                  <p className="text-gray-400 mb-6">Comece adicionando o primeiro depoimento para sua página institucional.</p>
                  <button 
                    onClick={() => setEditingTestimonial({})}
                    className="bg-nortyn-secondary hover:bg-[#00b3ab] text-white px-6 py-3 rounded-xl transition-all font-bold"
                  >
                    Adicionar Agora
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-6 transition-all hover:border-nortyn-secondary/30 group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={t.avatar_url} alt={t.client_name} className="w-12 h-12 rounded-full border border-white/10" />
                          <div>
                            <h4 className="font-bold">{t.client_name}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{t.company_role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingTestimonial(t)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteTestimonial(t.id)} className="p-2 bg-red-400/5 hover:bg-red-400/10 rounded-lg text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 italic leading-relaxed line-clamp-4 font-serif">"{t.content}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Profile Settings */}
              <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                  <UserIcon className="w-6 h-6 text-nortyn-secondary" />
                  <h2 className="text-xl font-bold">Configurações de Perfil</h2>
                </div>

                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Nome Completo</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nortyn-secondary/50 focus:border-nortyn-secondary transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">E-mail de acesso</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nortyn-secondary/50 focus:border-nortyn-secondary transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-500" />
                      Alterar Senha <span className="text-gray-600 font-normal lowercase">(Deixe vazio para manter atual)</span>
                    </label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nortyn-secondary/50 focus:border-nortyn-secondary transition-all max-w-sm"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      disabled={isUpdating}
                      className="bg-nortyn-secondary hover:bg-[#00b3ab] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-nortyn-secondary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Perfil'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Social Media Settings */}
              <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl transition-all">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                  <ExternalLink className="w-6 h-6 text-nortyn-secondary" />
                  <h2 className="text-xl font-bold">Redes Sociais do Rodapé</h2>
                </div>

                {isSocialsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-nortyn-secondary opacity-50" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {socialLinks.map((link) => (
                      <div key={link.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-nortyn-secondary/20 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center uppercase font-bold text-[10px] ${link.is_active ? 'bg-nortyn-secondary text-white' : 'bg-gray-800 text-gray-500'}`}>
                            {link.platform.substring(0, 2)}
                          </div>
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-1">{link.platform}</label>
                            <input 
                              type="text" 
                              value={link.url}
                              onChange={(e) => {
                                const newUrl = e.target.value;
                                setSocialLinks(prev => prev.map(l => l.id === link.id ? { ...l, url: newUrl } : l));
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-nortyn-secondary transition-all"
                              placeholder={`URL do ${link.platform}`}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={async () => {
                              const success = await handleUpdateSocialLink(link.id, link.url, !link.is_active);
                              if (success) {
                                setMessage({ text: `Rede social ${!link.is_active ? 'ativada' : 'desativada'}!`, type: 'success' });
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${link.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}
                          >
                            {link.is_active ? 'Ativo' : 'Inativo'}
                          </button>
                          
                          <button 
                            onClick={async () => {
                              const success = await handleUpdateSocialLink(link.id, link.url, link.is_active);
                              if (success) {
                                setMessage({ text: 'Link atualizado com sucesso!', type: 'success' });
                              }
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-all"
                            title="Salvar link"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Depoimento */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#060515]/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#0B091E] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingTestimonial.id ? 'Editar Depoimento' : 'Novo Depoimento'}</h3>
              <button 
                onClick={() => setEditingTestimonial(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-all opacity-50 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Nome do Cliente</label>
                  <input 
                    type="text" 
                    value={editingTestimonial.client_name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, client_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-nortyn-secondary transition-all"
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Cargo / Empresa</label>
                  <input 
                    type="text" 
                    value={editingTestimonial.company_role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company_role: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-nortyn-secondary transition-all"
                    placeholder="Ex: CEO na Topa Info"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">URL do Avatar</label>
                <input 
                  type="text" 
                  value={editingTestimonial.avatar_url || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-nortyn-secondary transition-all"
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Depoimento</label>
                <textarea 
                  value={editingTestimonial.content || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-nortyn-secondary transition-all h-32 resize-none"
                  placeholder="Escreva o texto do depoimento aqui..."
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingTestimonial(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingTestimonial}
                  className="flex-[2] bg-nortyn-secondary hover:bg-[#00b3ab] text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSavingTestimonial ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Depoimento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
