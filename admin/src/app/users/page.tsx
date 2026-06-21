'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserProfile {
  username: string;
  title: string | null;
  theme: string | null;
}

interface UserRecord {
  id: string;
  firebaseUid: string;
  stripeCustomerId: string | null;
  email: string | null;
  tier: string;
  createdAt: string;
  profile: UserProfile | null;
  shortenedLinksCount: number;
  bioLinksCount: number;
  totalLinksCount: number;
}

export default function AdminUsersList() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Track editing state per user
  const [selectedTiers, setSelectedTiers] = useState<Record<string, string>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users);
          // Initialize selectedTiers state with database values
          const initialTiers: Record<string, string> = {};
          data.users.forEach((u: UserRecord) => {
            initialTiers[u.id] = u.tier;
          });
          setSelectedTiers(initialTiers);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout().then(() => router.push('/login'));
  };

  const handleTierChange = (userId: string, newTier: string) => {
    setSelectedTiers((prev) => ({
      ...prev,
      [userId]: newTier
    }));
  };

  const handleSaveTier = async (userId: string) => {
    const newTier = selectedTiers[userId];
    if (!newTier) return;

    try {
      setSavingUserId(userId);
      setSuccessMessage('');

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier })
      });

      if (!res.ok) throw new Error('Falha ao atualizar plano');

      setSuccessMessage('Plano do usuário atualizado com sucesso!');
      
      // Update local state value
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, tier: newTier } : u))
      );

      // Clear toast after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar plano do usuário.');
    } finally {
      setSavingUserId(null);
    }
  };

  // Filter users based on query
  const filteredUsers = users.filter((u) => {
    const emailMatch = (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                       u.firebaseUid.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (u.stripeCustomerId && u.stripeCustomerId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Check profile details (firebaseUid is usually a placeholder if profile email exists, but here let's search username)
    const usernameMatch = u.profile && u.profile.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    return emailMatch || usernameMatch;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xl font-black text-blue-500">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>nuturl</span>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-400">Admin</span>
            </div>
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              <button 
                onClick={() => router.push('/')} 
                className="rounded-lg px-3 py-1.5 text-slate-400 hover:text-slate-200 transition"
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/users')} 
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-slate-200"
              >
                Usuários
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-slate-500">Logado como: <strong className="text-slate-300 font-semibold">{user?.email}</strong></span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
        {/* Mobile Navigation links */}
        <div className="flex md:hidden gap-2 mb-6">
          <button onClick={() => router.push('/')} className="flex-1 rounded-lg border border-slate-800 py-2 text-center text-xs font-bold text-slate-400">Dashboard</button>
          <button onClick={() => router.push('/users')} className="flex-1 rounded-lg bg-slate-900 py-2 text-center text-xs font-bold text-slate-200">Usuários</button>
        </div>

        {/* Title & Description */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-100">Controle de Usuários</h1>
            <p className="text-sm text-slate-400 mt-1">Gerencie permissões, consulte perfis e edite planos (tiers) de assinatura manualmente.</p>
          </div>

          {/* Search bar */}
          <div className="w-full md:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por e-mail ou username..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Success toast message */}
        {successMessage && (
          <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-emerald-500 text-slate-950 font-bold px-5 py-3 shadow-2xl animate-bounce">
            {successMessage}
          </div>
        )}

        {/* Users list card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Usuário / ID</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Data de Cadastro</th>
                  <th className="px-6 py-4">Links Gerados</th>
                  <th className="px-6 py-4">Página de Bio</th>
                  <th className="px-6 py-4">Plano Atual</th>
                  <th className="px-6 py-4 text-right">Alterar Plano</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((usr) => {
                    const isSaving = savingUserId === usr.id;
                    const hasChanged = selectedTiers[usr.id] !== usr.tier;

                    return (
                      <tr key={usr.id} className="hover:bg-slate-900/20 transition-colors">
                        {/* Usuário / ID */}
                        <td className="px-6 py-4 font-medium">
                          <span className="truncate block max-w-[150px] font-mono text-xs text-slate-400" title={usr.firebaseUid}>
                            UID: {usr.firebaseUid}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[150px]" title={usr.id}>
                            ID: {usr.id}
                          </span>
                        </td>

                        {/* E-mail */}
                        <td className="px-6 py-4">
                          {usr.email ? (
                            <span className="text-sm text-slate-200 block truncate max-w-[200px]" title={usr.email}>
                              {usr.email}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 italic block">
                              Não informado
                            </span>
                          )}
                          {usr.stripeCustomerId && (
                            <span className="text-[10px] text-slate-600 block mt-0.5">
                              Stripe: {usr.stripeCustomerId}
                            </span>
                          )}
                        </td>

                        {/* Data de Cadastro */}
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {formatDate(usr.createdAt)}
                        </td>

                        {/* Links Gerados */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col text-xs text-slate-300">
                            <span className="font-semibold text-blue-400" title="Total de links gerados">
                              Total: {usr.totalLinksCount || 0}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                              Encurtados: {usr.shortenedLinksCount || 0}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Perfil/Bio: {usr.bioLinksCount || 0}
                            </span>
                          </div>
                        </td>

                        {/* Profile Slug link */}
                        <td className="px-6 py-4">
                          {usr.profile ? (
                            <div className="flex flex-col">
                              <a 
                                href={`https://wnut.me/@${usr.profile.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline font-semibold text-xs"
                              >
                                @{usr.profile.username}
                              </a>
                              <span className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">
                                {usr.profile.title || 'Sem título'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-600 italic text-xs">Sem página</span>
                          )}
                        </td>

                        {/* Current Plan Badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                            usr.tier === 'premium' 
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                              : usr.tier === 'pro'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {usr.tier}
                          </span>
                        </td>

                        {/* Change Tier Selector & Action */}
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <select
                              value={selectedTiers[usr.id] || usr.tier}
                              onChange={(e) => handleTierChange(usr.id, e.target.value)}
                              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                            >
                              <option value="free">Free</option>
                              <option value="pro">Pro</option>
                              <option value="premium">Premium</option>
                            </select>
                            <button
                              onClick={() => handleSaveTier(usr.id)}
                              disabled={isSaving || !hasChanged}
                              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                                hasChanged 
                                  ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95' 
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {isSaving ? 'Salvando...' : 'Salvar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
