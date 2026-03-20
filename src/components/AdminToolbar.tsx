import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { Save, X, LogOut, Settings, Eye, Edit3, Loader2 } from 'lucide-react';

export default function AdminToolbar() {
  const { isAuthenticated, isVisualEditing, setIsVisualEditing, saveChanges, isSaving, hasChanges } = useAdmin();
  const navigate = useNavigate();

  // Toolbar should only show when visual editing is active and user is authenticated
  if (!isAuthenticated || !isVisualEditing) {
    return null; // The floating button is no longer needed, they must access this from the dashboard
  }

  const exitEditing = () => {
    if (hasChanges && !window.confirm('Existem alterações não salvas. Deseja realmente sair?')) return;
    setIsVisualEditing(false);
    navigate('/admin');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-slate-900/90 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-6 shadow-2xl animate-in slide-in-from-top duration-500">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-nortyn-secondary/20 border border-nortyn-secondary/30">
            <div className="w-2 h-2 rounded-full bg-nortyn-secondary animate-pulse" />
            <span className="text-xs font-bold text-nortyn-secondary uppercase tracking-widest">Modo Edição Ativo</span>
          </div>
          <p className="text-gray-400 text-sm hidden md:block">Edite os textos clicando diretamente neles.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsVisualEditing(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </button>

          <button 
            onClick={saveChanges}
            disabled={!hasChanges || isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
              hasChanges 
                ? 'bg-nortyn-secondary text-white shadow-lg shadow-nortyn-secondary/30 hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar Alterações
          </button>

          <div className="w-px h-6 bg-white/10 mx-2" />

          <button 
            onClick={exitEditing}
            className="flex items-center gap-2 p-2 px-4 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Voltar ao Dashboard"
          >
            <LogOut className="w-4 h-4" />
            Sair do Modo de Edição
          </button>
        </div>
      </div>
    </div>
  );
}
