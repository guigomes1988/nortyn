import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { 
  Loader2, LogOut, User as UserIcon, Lock, CheckCircle2, 
  ChevronRight, ChevronLeft, GripVertical, ExternalLink, Settings, Home, FileText, MessageSquare, Plus, Trash2, Edit2, X,
  Image as ImageIcon, Code, Users as UsersIcon, Globe, Link as LinkIcon, Upload,
  Eye, EyeOff, Instagram, Facebook, Linkedin, Youtube, Music, Save, Share2,
  Download, Search, Building2, Phone, Mail, FileSpreadsheet, Send, Target, Calendar
} from 'lucide-react';
import BrandGlow from './BrandGlow';

type Tab = 'leads' | 'testimonials' | 'gallery' | 'socials' | 'settings' | 'users';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  revenue: string;
  sector: string;
  origem: string;
  created_at: string;
}

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

// Otimiza e comprime imagem no navegador antes do upload para evitar limites de payload e deixar o carregamento rápido
async function optimizeImageForUpload(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type.includes('svg')) {
    return file;
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            file.type === 'image/png' ? 'image/png' : 'image/jpeg',
            quality
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
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
  const [newSocial, setNewSocial] = useState({ platform: '', url: '', is_active: true });
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [savingSocialId, setSavingSocialId] = useState<number | null>(null);

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState<number | null>(null);
  const hasDraggedRef = useRef(false);

  // Navegação por teclado no Lightbox da Galeria (ESC fecha, setas navegam)
  useEffect(() => {
    if (previewImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setPreviewImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        setPreviewImageIndex(prev => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImageIndex, galleryImages.length]);

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

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [leadOriginFilter, setLeadOriginFilter] = useState<'all' | 'institucional' | 'diagnostico'>('all');

  // Carrega contagem de leads ao carregar o dashboard
  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (activeTab === 'leads') fetchLeads();
    if (activeTab === 'testimonials') {
      fetchTestimonials();
      fetchAppSettings();
    }
    if (activeTab === 'gallery') fetchGallery();
    if (activeTab === 'socials') fetchSocialLinks();
    if (activeTab === 'settings') {
      fetchAppSettings();
    }
    if (activeTab === 'users') fetchAdminUsers();
  }, [activeTab]);

  const fetchLeads = async () => {
    setIsLeadsLoading(true);
    try {
      const response = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLeadsLoading(false);
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este lead do histórico local?')) return;
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
        setMessage({ text: 'Lead removido.', type: 'success' });
      } else {
        setMessage({ text: 'Erro ao remover lead.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro ao conectar com o servidor.', type: 'error' });
    }
  };

  const filteredLeads = leads.filter(lead => {
    const term = leadSearchTerm.toLowerCase();
    const matchesSearch = 
      (lead.name || '').toLowerCase().includes(term) ||
      (lead.email || '').toLowerCase().includes(term) ||
      (lead.company || '').toLowerCase().includes(term) ||
      (lead.phone || '').toLowerCase().includes(term) ||
      (lead.role || '').toLowerCase().includes(term) ||
      (lead.sector || '').toLowerCase().includes(term);
    
    const matchesOrigin = 
      leadOriginFilter === 'all' || 
      (leadOriginFilter === 'institucional' && (lead.origem === 'institucional' || lead.origem === 'site' || !lead.origem)) ||
      (leadOriginFilter === 'diagnostico' && lead.origem === 'diagnostico');

    return matchesSearch && matchesOrigin;
  });

  const exportLeadsToCSV = () => {
    if (filteredLeads.length === 0) {
      alert('Nenhum lead para exportar.');
      return;
    }
    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Empresa', 'Cargo', 'Setor', 'Equipe de Vendas', 'Origem', 'Data/Hora'];
    const rows = filteredLeads.map(l => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.role || '').replace(/"/g, '""')}"`,
      `"${(l.sector || '').replace(/"/g, '""')}"`,
      `"${(l.revenue || '').replace(/"/g, '""')}"`,
      `"${l.origem === 'diagnostico' ? 'Diagnóstico' : 'Demonstração'}"`,
      `"${new Date(l.created_at).toLocaleString('pt-BR')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-nortyn-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchSocialLinks = async () => {
    setIsSocialsLoading(true);
    try {
      const response = await fetch('/api/social-links');
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

  const handleToggleSocial = async (link: SocialLink) => {
    try {
      const updatedStatus = !link.is_active;
      setSocialLinks(prev => prev.map(s => s.id === link.id ? { ...s, is_active: updatedStatus } : s));

      const response = await fetch(`/api/social-links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: link.url, is_active: updatedStatus })
      });

      if (!response.ok) {
        setSocialLinks(prev => prev.map(s => s.id === link.id ? { ...s, is_active: link.is_active } : s));
        setMessage({ text: 'Erro ao atualizar rede social.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro de conexão.', type: 'error' });
    }
  };

  const handleSaveSocialUrl = async (link: SocialLink) => {
    setSavingSocialId(link.id);
    try {
      const response = await fetch(`/api/social-links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: link.url, is_active: link.is_active })
      });

      if (response.ok) {
        setMessage({ text: 'Link atualizado com sucesso!', type: 'success' });
      } else {
        setMessage({ text: 'Erro ao salvar link.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro de conexão.', type: 'error' });
    } finally {
      setSavingSocialId(null);
    }
  };

  const handleCreateSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.platform || !newSocial.url) return;

    try {
      const response = await fetch('/api/social-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSocial)
      });

      if (response.ok) {
        const created = await response.json();
        setSocialLinks(prev => [...prev, created]);
        setNewSocial({ platform: '', url: '', is_active: true });
        setIsAddingSocial(false);
        setMessage({ text: 'Rede social adicionada com sucesso!', type: 'success' });
      } else {
        setMessage({ text: 'Erro ao adicionar rede social.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro de conexão.', type: 'error' });
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover esta rede social?')) return;

    try {
      const response = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSocialLinks(prev => prev.filter(s => s.id !== id));
        setMessage({ text: 'Rede social removida!', type: 'success' });
      } else {
        setMessage({ text: 'Erro ao remover rede social.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Erro de conexão.', type: 'error' });
    }
  };

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
    try {
      // Otimiza no cliente para garantir envio rápido e evitar exceder limites de payload da Vercel
      const optimizedBlob = await optimizeImageForUpload(selectedFile);
      const formData = new FormData();
      formData.append('image', optimizedBlob, selectedFile.name);
      formData.append('alt', selectedFile.name.replace(/\.[^/.]+$/, ''));

      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSelectedFile(null);
        const fileInput = document.getElementById('gallery-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        await fetchGallery();
        setMessage({ text: 'Imagem carregada com sucesso!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Erro ao carregar imagem.', type: 'error' });
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setMessage({ text: err?.message || 'Erro ao conectar com o servidor.', type: 'error' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const saveGalleryOrder = async (orderedImages: GalleryImage[]) => {
    setIsReordering(true);
    try {
      const payload = orderedImages.map((img, idx) => ({
        id: img.id,
        display_order: idx + 1,
      }));

      const response = await fetch('/api/gallery/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order: payload })
      });

      if (response.ok) {
        setMessage({ text: 'Ordem das imagens atualizada com sucesso!', type: 'success' });
      } else {
        const err = await response.json().catch(() => ({}));
        setMessage({ text: err.error || 'Erro ao salvar a ordem das imagens.', type: 'error' });
        fetchGallery();
      }
    } catch (error) {
      setMessage({ text: 'Erro ao conectar com o servidor para salvar ordenação.', type: 'error' });
      fetchGallery();
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    hasDraggedRef.current = true;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 150);
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...galleryImages];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setGalleryImages(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);

    await saveGalleryOrder(updated);
  };

  const handleMoveImage = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    const updated = [...galleryImages];
    const [item] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, item);

    setGalleryImages(updated);
    await saveGalleryOrder(updated);
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
            onClick={() => setActiveTab('leads')}
            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'leads' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <UsersIcon className="w-5 h-5" />
              <span className="font-medium">Leads</span>
            </div>
            {leads.length > 0 && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'leads' ? 'bg-white/20 text-white' : 'bg-nortyn-secondary/20 text-nortyn-secondary'}`}>
                {leads.length}
              </span>
            )}
          </button>
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
            onClick={() => setActiveTab('socials')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'socials' ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Redes Sociais</span>
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
              {activeTab === 'leads' ? 'Leads Recebidos' : activeTab === 'testimonials' ? 'Depoimentos' : activeTab === 'gallery' ? 'Galeria Slideshow' : activeTab === 'socials' ? 'Redes Sociais' : activeTab === 'users' ? 'Gestão de Usuários' : 'Configurações'}
            </h1>
            <p className="text-sm text-gray-400">
              {activeTab === 'leads' ? 'Acompanhe todos os leads capturados nos formulários do site.' : activeTab === 'testimonials' ? 'Gerencie os depoimentos dos clientes.' : activeTab === 'gallery' ? 'Adicione imagens para o carrossel da página.' : activeTab === 'socials' ? 'Ative/desative redes sociais e edite os links das páginas Nortyn e Diagnóstico.' : activeTab === 'users' ? 'Administre os usuários do painel.' : 'Gerencie configurações, perfil e integrações.'}
            </p>
          </div>
          {activeTab === 'leads' && (
            <button 
              onClick={exportLeadsToCSV}
              disabled={filteredLeads.length === 0}
              className="bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl transition-all border border-white/10 flex items-center gap-2 text-sm font-semibold shadow-lg"
            >
              <Download className="w-4 h-4 text-nortyn-secondary" />
              Exportar CSV
            </button>
          )}
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

          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Cards de Métricas / Resumo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0B091E]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total de Leads</span>
                    <UsersIcon className="w-5 h-5 text-nortyn-secondary" />
                  </div>
                  <div className="text-3xl font-bold text-white">{leads.length}</div>
                  <p className="text-xs text-gray-400 mt-1">Registros salvos no site</p>
                </div>

                <div className="bg-[#0B091E]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Demonstração</span>
                    <Send className="w-5 h-5 text-[#009a93]" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {leads.filter(l => l.origem !== 'diagnostico').length}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Formulário institucional</p>
                </div>

                <div className="bg-[#0B091E]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Diagnóstico</span>
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {leads.filter(l => l.origem === 'diagnostico').length}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Formulário de diagnóstico</p>
                </div>

                <div className="bg-[#0B091E]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-gray-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Último Lead</span>
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {leads[0] ? leads[0].name : 'Nenhum lead ainda'}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {leads[0] ? new Date(leads[0].created_at).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
              </div>

              {/* Barra de Filtros e Busca */}
              <div className="bg-[#0B091E]/60 border border-white/10 rounded-2xl p-4 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, e-mail, empresa, telefone ou cargo..."
                    value={leadSearchTerm}
                    onChange={(e) => setLeadSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:border-nortyn-secondary transition-all"
                  />
                  {leadSearchTerm && (
                    <button 
                      onClick={() => setLeadSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setLeadOriginFilter('all')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      leadOriginFilter === 'all'
                        ? 'bg-nortyn-secondary text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Todos ({leads.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadOriginFilter('institucional')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      leadOriginFilter === 'institucional'
                        ? 'bg-nortyn-secondary text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Demonstração ({leads.filter(l => l.origem !== 'diagnostico').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadOriginFilter('diagnostico')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      leadOriginFilter === 'diagnostico'
                        ? 'bg-nortyn-secondary text-white shadow-md'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Diagnóstico ({leads.filter(l => l.origem === 'diagnostico').length})
                  </button>
                </div>
              </div>

              {/* Tabela de Leads */}
              {isLeadsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-nortyn-secondary opacity-50" />
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm">
                  <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-white mb-1">Nenhum lead encontrado</h4>
                  <p className="text-sm text-gray-400 max-w-md mx-auto">
                    {leadSearchTerm || leadOriginFilter !== 'all' 
                      ? 'Nenhum lead corresponde aos filtros pesquisados. Tente alterar a busca.' 
                      : 'Os dados preenchidos nos formulários de demonstração e diagnóstico aparecerão listados aqui.'}
                  </p>
                </div>
              ) : (
                <div className="bg-[#0B091E]/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          <th className="px-6 py-4">Contato / Lead</th>
                          <th className="px-6 py-4">Empresa & Cargo</th>
                          <th className="px-6 py-4">Detalhes</th>
                          <th className="px-6 py-4">Origem</th>
                          <th className="px-6 py-4">Data do Envio</th>
                          <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredLeads.map((lead) => {
                          const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                          const isDiagnostico = lead.origem === 'diagnostico';

                          return (
                            <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors">
                              {/* Contato */}
                              <td className="px-6 py-4">
                                <div className="font-bold text-white text-sm">{lead.name || 'Sem nome'}</div>
                                <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                                  <Mail className="w-3 h-3 text-gray-500" />
                                  <a href={`mailto:${lead.email}`} className="hover:text-nortyn-secondary transition-colors truncate max-w-[200px]">
                                    {lead.email}
                                  </a>
                                </div>
                                {lead.phone && (
                                  <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                                    <Phone className="w-3 h-3 text-gray-500" />
                                    <span className="font-mono">{lead.phone}</span>
                                    <a
                                      href={`https://wa.me/55${cleanPhone}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-400 hover:text-emerald-300 p-0.5 hover:bg-emerald-500/10 rounded transition-all ml-1 font-semibold"
                                      title="Abrir no WhatsApp"
                                    >
                                      WhatsApp
                                    </a>
                                  </div>
                                )}
                              </td>

                              {/* Empresa & Cargo */}
                              <td className="px-6 py-4">
                                <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-nortyn-secondary" />
                                  <span>{lead.company || '-'}</span>
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {lead.role || 'Cargo não informado'}
                                </div>
                              </td>

                              {/* Detalhes (Setor e Equipe) */}
                              <td className="px-6 py-4">
                                {lead.sector && (
                                  <div className="text-xs text-gray-300">
                                    <span className="text-gray-500">Setor: </span>
                                    {lead.sector}
                                  </div>
                                )}
                                {lead.revenue && (
                                  <div className="text-xs text-gray-400 mt-0.5">
                                    <span className="text-gray-500">Equipe: </span>
                                    {lead.revenue}
                                  </div>
                                )}
                                {!lead.sector && !lead.revenue && (
                                  <span className="text-xs text-gray-500">-</span>
                                )}
                              </td>

                              {/* Origem */}
                              <td className="px-6 py-4">
                                {isDiagnostico ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                    <Target className="w-3 h-3" />
                                    Diagnóstico
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#009a93]/15 text-[#009a93] border border-[#009a93]/30">
                                    <Send className="w-3 h-3" />
                                    Demonstração
                                  </span>
                                )}
                              </td>

                              {/* Data */}
                              <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                                <div>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">
                                  {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </td>

                              {/* Ações */}
                              <td className="px-6 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                  title="Excluir este lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Ordem de Exibição no Slideshow</span>
                    <span className="text-xs font-normal text-gray-400">({galleryImages.length} imagens)</span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Arraste e solte os cards para reorganizar a sequência de exibição na página inicial, ou utilize os botões direcionais.
                  </p>
                </div>
                {isReordering && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-nortyn-secondary bg-nortyn-secondary/10 px-3.5 py-1.5 rounded-full border border-nortyn-secondary/30 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Salvando ordem...</span>
                  </div>
                )}
              </div>

              {isGalleryLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-nortyn-secondary opacity-50" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {galleryImages.map((img, idx) => {
                    const isDraggingThis = draggedIndex === idx;
                    const isDragOverThis = dragOverIndex === idx && draggedIndex !== idx;

                    return (
                      <div 
                        key={img.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragEnd={handleDragEnd}
                        onClick={() => {
                          if (!hasDraggedRef.current) {
                            setPreviewImageIndex(idx);
                          }
                        }}
                        className={`relative aspect-video rounded-2xl overflow-hidden group border transition-all duration-200 select-none cursor-grab active:cursor-grabbing ${
                          isDraggingThis 
                            ? 'opacity-30 scale-95 border-dashed border-nortyn-secondary' 
                            : isDragOverThis
                            ? 'scale-105 border-nortyn-secondary ring-4 ring-nortyn-secondary/30 shadow-2xl z-10'
                            : 'border-white/10 hover:border-nortyn-secondary/40 hover:shadow-lg'
                        }`}
                      >
                        <img 
                          src={img.url} 
                          alt={img.alt || `Slide ${idx + 1}`} 
                          className="w-full h-full object-cover pointer-events-none transition-transform group-hover:scale-105" 
                        />
                        
                        {/* Badges superiores: Número da Ordem e Handle de Arraste */}
                        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                          <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-bold text-white border border-white/15 shadow-md">
                            #{idx + 1}
                          </span>
                          <div className="p-1 rounded-md bg-black/75 backdrop-blur-md text-white/70 group-hover:text-nortyn-secondary group-hover:bg-black/90 transition-all border border-white/10 shadow-md">
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Barra de Ações (Aparece ao passar o mouse) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 z-10 pointer-events-none">
                          {/* Botão Central: Ampliar Lightbox */}
                          <div className="flex justify-center pt-5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImageIndex(idx);
                              }}
                              className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nortyn-secondary hover:bg-[#00b3ab] text-white text-xs font-bold shadow-lg transition-all hover:scale-105"
                              title="Clique para ampliar em tela cheia"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ampliar</span>
                            </button>
                          </div>

                          {/* Ações Inferiores: Ordenar com Setas e Excluir */}
                          <div className="flex items-center justify-between pointer-events-auto">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveImage(idx, 'left');
                                }}
                                disabled={idx === 0 || isReordering}
                                title="Mover para a esquerda"
                                className="p-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-white transition-all"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveImage(idx, 'right');
                                }}
                                disabled={idx === galleryImages.length - 1 || isReordering}
                                title="Mover para a direita"
                                className="p-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none rounded-lg text-white transition-all"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGalleryImage(img.id);
                              }}
                              title="Remover imagem"
                              className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-white transition-all shadow-md"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="space-y-8">
              {/* Header & Add Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0B091E]/60 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-nortyn-secondary" />
                    Gerenciar Redes Sociais
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Ative ou desative as redes sociais e edite as URLs correspondentes. Todos os links serão abertos em nova guia (<code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-nortyn-secondary">target="_blank"</code>) nos rodapés e menus das páginas Nortyn e Diagnóstico.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingSocial(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nortyn-secondary hover:bg-nortyn-secondary/80 text-white font-medium transition-all shadow-lg shadow-nortyn-secondary/20 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Nova Rede Social
                </button>
              </div>

              {/* Modal for adding new social */}
              {isAddingSocial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                  <div className="bg-[#0B091E] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-bold">Adicionar Nova Rede Social</h4>
                      <button onClick={() => setIsAddingSocial(false)} className="text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateSocialLink} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Plataforma</label>
                        <input
                          type="text"
                          placeholder="Ex: instagram, facebook, whatsapp, linkedin..."
                          value={newSocial.platform}
                          onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-nortyn-secondary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">URL / Link</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={newSocial.url}
                          onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-nortyn-secondary"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium">Habilitar no Site</span>
                        <button
                          type="button"
                          onClick={() => setNewSocial({ ...newSocial, is_active: !newSocial.is_active })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newSocial.is_active ? 'bg-nortyn-secondary' : 'bg-gray-700'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newSocial.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsAddingSocial(false)}
                          className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-nortyn-secondary text-white font-medium text-sm hover:bg-nortyn-secondary/80"
                        >
                          Adicionar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* List of Social Links */}
              {isSocialsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-nortyn-secondary" />
                </div>
              ) : socialLinks.length === 0 ? (
                <div className="text-center py-12 bg-[#0B091E]/60 border border-white/10 rounded-3xl">
                  <p className="text-gray-400">Nenhuma rede social cadastrada.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {socialLinks.map((link) => (
                    <div
                      key={link.id}
                      className="bg-[#0B091E]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 w-full md:w-48 shrink-0">
                        <div className={`p-3 rounded-xl ${link.is_active ? 'bg-nortyn-secondary/20 text-nortyn-secondary' : 'bg-white/5 text-gray-500'}`}>
                          {getSocialIcon(link.platform)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white capitalize">{link.platform}</h4>
                          <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${link.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {link.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>

                      {/* URL Input */}
                      <div className="flex-1 w-full flex items-center gap-2">
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSocialLinks(prev => prev.map(s => s.id === link.id ? { ...s, url: val } : s));
                          }}
                          placeholder="https://..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-nortyn-secondary"
                        />
                        <button
                          onClick={() => handleSaveSocialUrl(link)}
                          disabled={savingSocialId === link.id}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all shrink-0"
                          title="Salvar URL"
                        >
                          {savingSocialId === link.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          <span className="hidden sm:inline">Salvar</span>
                        </button>
                      </div>

                      {/* Actions: Toggle & Delete */}
                      <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 hidden sm:inline">
                            {link.is_active ? 'Habilitado' : 'Desabilitado'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleSocial(link)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${link.is_active ? 'bg-nortyn-secondary' : 'bg-gray-700'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${link.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteSocialLink(link.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
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
      {/* Lightbox da Galeria */}
      {previewImageIndex !== null && galleryImages[previewImageIndex] && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
          onClick={() => setPreviewImageIndex(null)}
        >
          <div 
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra superior de informações e fechar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold border border-white/15">
                  Foto {previewImageIndex + 1} de {galleryImages.length}
                </span>
                <span className="text-sm text-gray-300 font-medium truncate max-w-xs md:max-w-md">
                  {galleryImages[previewImageIndex].alt || 'Slideshow Image'}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewImageIndex(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 shadow-lg"
                title="Fechar (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Imagem ampliada */}
            <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0B091E]/90 shadow-2xl">
              <img 
                src={galleryImages[previewImageIndex].url} 
                alt={galleryImages[previewImageIndex].alt || `Slide ${previewImageIndex + 1}`}
                className="max-w-full max-h-[75vh] w-auto h-auto object-contain select-none"
              />

              {/* Botão Anterior */}
              {previewImageIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setPreviewImageIndex(previewImageIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 shadow-xl transition-all hover:scale-110"
                  title="Foto anterior (Seta esquerda)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Botão Próximo */}
              {previewImageIndex < galleryImages.length - 1 && (
                <button
                  type="button"
                  onClick={() => setPreviewImageIndex(previewImageIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 shadow-xl transition-all hover:scale-110"
                  title="Próxima foto (Seta direita)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Rodapé com atalhos e ação de exclusão rápida */}
            <div className="w-full flex items-center justify-between pt-3 text-xs text-gray-400">
              <span className="hidden sm:inline">Use as setas do teclado (← / →) para navegar e ESC para fechar</span>
              <button
                type="button"
                onClick={() => {
                  const idToDelete = galleryImages[previewImageIndex].id;
                  handleDeleteGalleryImage(idToDelete);
                  setPreviewImageIndex(null);
                }}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-all font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir esta foto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
