import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { Loader2 } from 'lucide-react';
import BrandGlow from './BrandGlow';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`O servidor retornou um erro inesperado (Status: ${response.status}). Possível falha interna na Vercel.`);
      }

      if (response.ok) {
        login(data.token, data.user);
        navigate('/admin');
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nortyn-bg relative overflow-hidden font-sans">
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <BrandGlow />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>

      <div className="z-10 bg-[#0B091E] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8 flex flex-col items-center relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-nortyn-secondary/20 rounded-full blur-[40px] pointer-events-none -z-10"></div>
          <img src="/nortyn-logo.png" alt="Nortyn" className="h-10 md:h-12 w-auto mb-8 relative z-10" />
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">Painel Admin</h2>
          <p className="text-nortyn-muted text-sm px-4">Entre com suas credenciais para gerenciar a plataforma</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-3 text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nortyn-secondary/50 focus:border-nortyn-secondary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nortyn-secondary/50 focus:border-nortyn-secondary transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-nortyn-secondary hover:bg-[#00b3ab] text-white font-bold py-3 px-4 rounded-xl mt-4 transition-all flex items-center justify-center gap-2 shadow-lg shadow-nortyn-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-nortyn-muted hover:text-white transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <span className="rotate-180">➜</span> Voltar ao site
          </button>
        </div>
      </div>
    </div>
  );
}
