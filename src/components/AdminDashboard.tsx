import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { 
  Loader2, LogOut, User as UserIcon, Lock, CheckCircle2, 
  ChevronRight, ExternalLink, Settings, Home, FileText, MessageSquare, Plus, Trash2, Edit2, X,
  Image as ImageIcon, Code, Users as UsersIcon, Globe, Link as LinkIcon, Upload,
  Eye, EyeOff
} from 'lucide-react';
import BrandGlow from './BrandGlow';

type Tab = 'testimonials' | 'gallery' | 'settings' | 'users';

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

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  display_order: number;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, token, logout, fetchUser } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('testimonials');
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

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Settings State (Webhook, Scripts)
  const [appSettings, setAppSettings] = useState<Record<string, string>>({
    webhook_url: '',
    head_scripts: '',
    body_scripts: ''
  });
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Users State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (activeTab === 'testimonials') {
      fetchTestimonials();
      fetchAppSettings();
    }
    if (activeTab === 'gallery') fetchGallery();
    if (activeTab === 'settings') {
      fetchAppSettings();
    }
    if (activeTab === 'users') fetchAdminUsers();
  }, [activeTab]);

  const fetchTestimonials = async () => {
    setIsTestimonialsLoading(true);
    try {
      const response = await fetch('/api/testimonials');
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
        ? `/api/testimonials/${editingTestimonial.id}`
        : '/api/testimonials';
      
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
      const response = await fetch(`/api/testimonials/${id}`, {
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

  const fetchGallery = async () => {
    setIsGalleryLoading(true);
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setGalleryImages(data);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setIsGalleryLoading(false);
    }
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('alt', 'Slideshow Image');

    try {
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (response.ok) {
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('gallery-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        fetchGallery();
        setMessage({ text: 'Imagem carregada com sucesso!', type: 'success' });
      } else {
        setMessage({ text: 'Erro ao carregar imagem.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao conectar com o servidor.', type: 'error' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteGalleryImage = async (id: number) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchGallery();
        setMessage({ text: 'Imagem removida.', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao remover imagem.', type: 'error' });
    }
  };

  const fetchAppSettings = async () => {
    setIsSettingsLoading(true);
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setAppSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsSettingsLoading(false);
    }
  };

  const handleSaveAppSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings: appSettings })
      });
      if (response.ok) {
        setMessage({ text: 'Configurações salvas com sucesso!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao salvar configurações.', type: 'error' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleToggleTestimonials = async (show: boolean) => {
    const val = show ? 'true' : 'false';
    setAppSettings(prev => ({ ...prev, show_testimonials: val }));
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings: { show_testimonials: val } })
      });
      if (response.ok) {
        setMessage({ 
          text: show ? 'Seção de depoimentos ativada no site!' : 'Seção de depoimentos ocultada no site!', 
          type: 'success' 
        });
      } else {
        setMessage({ text: 'Erro ao atualizar visibilidade da seção.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao conectar com o servidor.', type: 'error' });
    }
  };

  const fetchAdminUsers = async () => {
    setIsUsersLoading(true);
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        setNewUser({ name: '', email: '', password: '' });
        fetchAdminUsers();
        setMessage({ text: 'Novo administrador criado!', type: 'success' });
      } else {
        const data = await response.json();
        setMessage({ text: data.error || 'Erro ao criar usuário', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao conectar com o servidor.', type: 'error' });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (id === user?.id) {
      setMessage({ text: 'Você não pode excluir seu próprio usuário.', type: 'error' });
      return;
    }
    if (!window.confirm('Tem certeza que deseja excluir este administrador?')) return;
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchAdminUsers();
        setMessage({ text: 'Administrador removido.', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao remover usuário.', type: 'error' });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/auth/user', {
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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/testimonials/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setEditingTestimonial({ ...editingTestimonial, avatar_url: data.url });
        setMessage({ text: 'Avatar carregado!', type: 'success' });
      } else {
        setMessage({ text: 'Erro ao carregar avatar.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro na conexão.', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060515] text-white flex font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <BrandGlow />
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-[#0B091E]/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
        <div className="p-8 border-b border-white/5 flex items-center justify-center">
          <img src="/nortyn-bco.png" alt="Nortyn Logo" className="h-10 w-auto" />
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'testimonials' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Depoimentos</span>
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'gallery' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Galeria</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <UsersIcon className="w-5 h-5" />
            <span className="font-medium">Usuários</span>
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
              {activeTab === 'testimonials' ? 'Depoimentos' : activeTab === 'gallery' ? 'Galeria Slideshow' : activeTab === 'users' ? 'Gestão de Usuários' : 'Configurações'}
            </h1>
            <p className="text-sm text-gray-400">
              {activeTab === 'testimonials' ? 'Gerencie os depoimentos dos clientes.' : activeTab === 'gallery' ? 'Adicione imagens para o carrossel da página.' : activeTab === 'users' ? 'Administre os usuários do painel.' : 'Gerencie configurações, perfil e integrações.'}
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

          {activeTab === 'testimonials' && (
            <div className="flex flex-col gap-6">
              {/* Toggle Section Visibility */}
              <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-6 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${appSettings.show_testimonials !== 'false' ? 'bg-nortyn-secondary/10 text-nortyn-secondary' : 'bg-gray-800 text-gray-400'}`}>
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 flex-wrap">
                      Exibir Seção no Site
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${appSettings.show_testimonials !== 'false' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                        {appSettings.show_testimonials !== 'false' ? 'Visível' : 'Oculto'}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-400">
                      Ligue ou desligue a exibição do bloco "Empresas que confiam na Nortyn" no site.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleTestimonials(appSettings.show_testimonials === 'false')}
                  className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    appSettings.show_testimonials !== 'false' ? 'bg-nortyn-secondary' : 'bg-gray-700'
                  }`}
                  aria-pressed={appSettings.show_testimonials !== 'false'}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      appSettings.show_testimonials !== 'false' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {isTestimonialsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-nortyn-secondary opacity-50" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-6 transition-all hover:border-nortyn-secondary/30">
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
                      <p className="text-sm text-gray-300 italic leading-relaxed line-clamp-4">"{t.content}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <form onSubmit={handleAddGalleryImage} className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-nortyn-secondary" />
                      Upload de Imagens
                    </h3>
                    <p className="text-sm text-gray-400">
                      Selecione imagens de alta qualidade para o slideshow da página inicial. Formatos aceitos: JPG, PNG, WebP. (Máx 5MB)
                    </p>
                  </div>
                  
                  <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                    <div className="relative group">
                      <input 
                        type="file" 
                        id="gallery-upload"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept="image/*"
                        required
                      />
                      <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-dashed transition-all ${selectedFile ? 'border-nortyn-secondary bg-nortyn-secondary/5 text-nortyn-secondary' : 'border-white/10 bg-white/5 text-gray-400 group-hover:border-white/20 group-hover:text-white'}`}>
                        <Upload className="w-5 h-5" />
                        <span className="font-medium max-w-[150px] truncate">
                          {selectedFile ? selectedFile.name : 'Selecionar Arquivo'}
                        </span>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={!selectedFile || isUploadingImage}
                      className="bg-nortyn-secondary hover:bg-[#00b3ab] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isUploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Carregar Imagem'}
                    </button>
                  </div>
                </div>
              </form>

              {isGalleryLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-nortyn-secondary opacity-50" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative aspect-video rounded-2xl overflow-hidden group border border-white/10">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all transform translate-y-4 group-hover:translate-y-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8">
              <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-nortyn-secondary" />
                  Novo Administrador
                </h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Nome"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-nortyn-secondary transition-all"
                    required
                  />
                  <input 
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Email"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-nortyn-secondary transition-all"
                    required
                  />
                  <input 
                    type="password" 
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Senha"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-nortyn-secondary transition-all"
                    required
                  />
                  <div className="md:col-span-3 flex justify-end">
                    <button type="submit" disabled={isCreatingUser} className="bg-nortyn-secondary hover:bg-[#00b3ab] text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50">
                      {isCreatingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Usuário'}
                    </button>
                  </div>
                </form>
              </div>

              {isUsersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-nortyn-secondary opacity-50" />
                </div>
              ) : (
                <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        <th className="px-6 py-4">Nome</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Criado em</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {adminUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold">{u.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{u.email}</td>
                          <td className="px-6 py-4 text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                              disabled={u.id === user?.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {isSettingsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-nortyn-secondary opacity-50" />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Profile Settings */}
                  <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                      <UserIcon className="w-6 h-6 text-nortyn-secondary" />
                      <h2 className="text-xl font-bold">Meu Perfil</h2>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Nome Completo</label>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-nortyn-secondary transition-all" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">E-mail</label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-nortyn-secondary transition-all" required />
                        </div>
                      </div>
                      <div className="space-y-2 max-w-sm">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">
                          Nova Senha <span className="text-gray-600 font-normal lowercase">(Vazio para manter)</span>
                        </label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-nortyn-secondary transition-all pr-12 text-white" 
                            placeholder="******" 
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-nortyn-secondary transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isUpdating} className="bg-nortyn-secondary hover:bg-[#00b3ab] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
                          {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Atualizar Perfil'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Integrations (Webhook) */}
                  <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                      <Globe className="w-6 h-6 text-nortyn-secondary" />
                      <h2 className="text-xl font-bold">Integrações (Webhooks)</h2>
                    </div>
                    <form onSubmit={handleSaveAppSettings} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Webhook URL (Formulários)</label>
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            value={appSettings.webhook_url} 
                            onChange={(e) => setAppSettings({...appSettings, webhook_url: e.target.value})} 
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-nortyn-secondary transition-all font-mono text-sm" 
                            placeholder="https://..." 
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isSavingSettings} className="bg-nortyn-secondary hover:bg-[#00b3ab] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
                          {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Configurações'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* External Scripts */}
                  <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                      <Code className="w-6 h-6 text-nortyn-secondary" />
                      <h2 className="text-xl font-bold">Códigos Externos (Analytics/Pixel)</h2>
                    </div>
                    <form onSubmit={handleSaveAppSettings} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Scripts no Head (Analytics, Fonts, meta tags)</label>
                        <textarea 
                          value={appSettings.head_scripts} 
                          onChange={(e) => setAppSettings({...appSettings, head_scripts: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-nortyn-secondary transition-all font-mono text-xs h-32" 
                          placeholder="<script>...</script>" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Scripts no Body (Pixel, Widgets)</label>
                        <textarea 
                          value={appSettings.body_scripts} 
                          onChange={(e) => setAppSettings({...appSettings, body_scripts: e.target.value})} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-nortyn-secondary transition-all font-mono text-xs h-32" 
                          placeholder="<script>...</script>" 
                        />
                      </div>
                      <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isSavingSettings} className="bg-nortyn-secondary hover:bg-[#00b3ab] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
                          {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Códigos'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Avatar do Cliente</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {editingTestimonial.avatar_url ? (
                      <img src={editingTestimonial.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="relative flex-1">
                    <input 
                      type="file" 
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium transition-all ${isUploadingAvatar ? 'opacity-50' : 'hover:bg-white/10'}`}>
                      {isUploadingAvatar ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 text-nortyn-secondary" />
                      )}
                      {editingTestimonial.avatar_url ? 'Alterar Foto' : 'Selecionar Foto'}
                    </div>
                  </div>
                </div>
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
