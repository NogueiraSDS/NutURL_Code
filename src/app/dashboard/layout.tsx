'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Link as LinkIcon, User, CreditCard, LogOut, Menu, X } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  const navItems = [
    { name: t('dashboard.overview') || 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: t('dashboard.myLinks') || 'Meus Links', href: '/dashboard/links', icon: LinkIcon },
    { name: 'Minha Página', href: '/dashboard/profile', icon: User },
    { name: 'Meu Plano', href: '/dashboard/plan', icon: CreditCard },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        width: '260px',
        backgroundColor: '#1e293b',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }} className="md:translate-x-0 md:static md:block">
        
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
              N
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>NutURL</span>
          </div>
          <button 
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname === '/dashboard' && item.href === '/dashboard' && pathname.endsWith('dashboard'));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 400
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <Icon size={20} color={isActive ? '#3b82f6' : 'currentColor'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            onClick={() => {
              logout();
              router.push('/');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              width: '100%',
              borderRadius: '8px',
              color: '#f87171',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={20} />
            {t('dashboard.logout') || 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* Mobile Header */}
        <header className="md:hidden" style={{ 
          padding: '1rem 1.5rem', 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: '#0f172a'
        }}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: '#f8fafc', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 'bold' }}>Dashboard</span>
        </header>

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media (min-width: 768px) {
          .md\\:translate-x-0 { transform: translateX(0) !important; }
          .md\\:static { position: static !important; }
          .md\\:block { display: flex !important; }
          .md\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
