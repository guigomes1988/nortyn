import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isVisualEditing: boolean;
  setIsVisualEditing: (value: boolean) => void;
  siteContent: Record<string, string>;
  updateContent: (key: string, value: string) => void;
  saveChanges: () => Promise<void>;
  isSaving: boolean;
  hasChanges: boolean;
  fetchUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  
  const [isVisualEditing, setIsVisualEditing] = useState(false);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [initialContent, setInitialContent] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
    fetchContent();
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsVisualEditing(false);
  };

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setSiteContent(data);
        setInitialContent(data);
      }
    } catch (error) {
      console.error('Error fetching site content:', error);
    }
  };

  const updateContent = (key: string, value: string) => {
    setSiteContent(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/content/upsert', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: siteContent })
      });
      if (response.ok) {
        setInitialContent({ ...siteContent });
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Erro ao salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(siteContent) !== JSON.stringify(initialContent);

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated,
      isLoading,
      user,
      token,
      login,
      logout,
      isVisualEditing, 
      setIsVisualEditing, 
      siteContent, 
      updateContent, 
      saveChanges, 
      isSaving,
      hasChanges,
      fetchUser
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
