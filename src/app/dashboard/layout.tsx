'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Link as LinkIcon, User, CreditCard, LogOut, Menu, X, ChevronDown, Settings } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.user-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

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
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        
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
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* Top Header */}
        <header style={{ 
          padding: '1rem 2rem', 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: '#f8fafc', cursor: 'pointer', padding: 0 }}
            >
              <Menu size={24} />
            </button>
            <span className="md:hidden" style={{ fontWeight: 'bold' }}>Dashboard</span>
          </div>

          <div className="user-dropdown-container" style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                padding: '0.5rem 1rem', 
                borderRadius: '30px',
                color: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold',
                overflow: 'hidden'
              }}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (user?.displayName || user?.email || 'U')[0].toUpperCase()
                )}
              </div>
              <span className="hidden sm:block" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {user?.displayName || user?.email?.split('@')[0]}
              </span>
              <ChevronDown size={16} color="#94a3b8" />
            </button>

            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                right: 0,
                width: '220px',
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                padding: '0.5rem',
                zIndex: 100
              }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>{user?.displayName || 'Usuário'}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                </div>
                
                <button 
                  onClick={() => { setIsDropdownOpen(false); router.push('/dashboard/profile'); }}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#e2e8f0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Settings size={18} />
                  Meu Perfil
                </button>

                <button 
                  onClick={() => { setIsDropdownOpen(false); logout(); router.push('/'); }}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: '0.25rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        /* Sidebar Base Styles */
        .dashboard-sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 50;
          width: 260px;
          background-color: #1e293b;
          border-right: 1px solid rgba(255,255,255,0.05);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .dashboard-sidebar.open {
          transform: translateX(0);
        }

        /* Desktop specific */
        @media (min-width: 768px) {
          .dashboard-sidebar {
            position: static;
            transform: translateX(0);
            flex-shrink: 0;
          }
          
          .md\\:hidden { display: none !important; }
          .hidden.sm\\:block { display: block !important; }
        }

        @media (max-width: 767px) {
          .hidden.sm\\:block { display: none !important; }
        }
      `}</style>
    </div>
  );
}
