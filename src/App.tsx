import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Diagnostico from './diagnostico';
import Demonstracao from './demonstracao';
import PoliticaPrivacidade from './politica-privacidade';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { AdminProvider, useAdmin } from './components/AdminContext';
import AdminToolbar from './components/AdminToolbar';
import CookieConsent from './components/CookieConsent';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdmin();
  
  if (isLoading) {
    return <div className="min-h-screen bg-nortyn-bg flex items-center justify-center text-nortyn-secondary">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AdminProvider>
        <AdminToolbar />
        <Routes>
          <Route path="/" element={<Demonstracao />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            } 
          />
        </Routes>
        <CookieConsent />
      </AdminProvider>
    </Router>
  );
}
