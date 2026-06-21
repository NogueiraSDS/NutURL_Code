'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const ADMIN_EMAIL = 'erivandons@gmail.com';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  // Allow unrestricted access to the login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!user) {
    return null; // Redirecting in useEffect
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900/50 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-500 mb-2">Acesso Negado</h1>
          <p className="text-sm text-slate-400 mb-6">
            O email <span className="font-semibold text-slate-200">{user.email}</span> não possui privilégios de administrador neste painel.
          </p>
          <button
            onClick={() => {
              logout().then(() => router.push('/login'));
            }}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
          >
            Fazer Logout
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
