import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { VerificationPage } from './pages/VerificationPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'generate' | 'verify' | 'admin'>('generate');
  const [verifyId, setVerifyId] = useState<string>('');

  // Synchronize with browser URL path
  const syncRouteWithLocation = () => {
    const path = window.location.pathname;

    if (path.startsWith('/verify')) {
      const parts = path.split('/').filter(Boolean);
      const idFromUrl = parts[1] || '';
      setCurrentTab('verify');
      setVerifyId(idFromUrl.toUpperCase());
    } else if (path === '/admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('generate');
    }
  };

  useEffect(() => {
    syncRouteWithLocation();

    const handlePopState = () => {
      syncRouteWithLocation();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (tab: 'generate' | 'verify' | 'admin', targetId?: string) => {
    setCurrentTab(tab);

    if (tab === 'verify') {
      const id = targetId || verifyId || '';
      setVerifyId(id);
      const newPath = id ? `/verify/${encodeURIComponent(id)}` : '/verify';
      window.history.pushState({}, '', newPath);
    } else if (tab === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-amber-400 selection:text-blue-950">
      <Header
        activeTab={currentTab}
        setActiveTab={(tab) => navigateTo(tab)}
      />

      <div className="flex-1">
        {currentTab === 'generate' && (
          <LandingPage
            onNavigateToVerify={(id) => navigateTo('verify', id)}
            onNavigateToAdmin={() => navigateTo('admin')}
          />
        )}

        {currentTab === 'verify' && (
          <VerificationPage
            initialCertId={verifyId}
            onNavigateHome={() => navigateTo('generate')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            onNavigateHome={() => navigateTo('generate')}
            onNavigateToVerify={(id) => navigateTo('verify', id)}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
