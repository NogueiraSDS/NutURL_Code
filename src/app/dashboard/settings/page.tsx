'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Settings, Lock, Mail, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading, updateUserPassword, linkGoogleAccount, deleteAuthUser, logout } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  
  const [linkLoading, setLinkLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    setPassLoading(true);
    try {
      await updateUserPassword(password);
      alert('Senha atualizada com sucesso!');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        alert('Para sua segurança, por favor faça login novamente antes de alterar a senha.');
      } else {
        alert('Erro ao atualizar senha. Pode ser necessário re-autenticar primeiro.');
      }
    } finally {
      setPassLoading(false);
    }
  };

  const handleLinkGoogle = async () => {
    setLinkLoading(true);
    try {
      await linkGoogleAccount();
      alert('Conta vinculada ao Google com sucesso!');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/credential-already-in-use') {
        alert('Esta conta do Google já está sendo usada por outro usuário.');
      } else {
        alert('Erro ao vincular conta. Você já pode estar vinculado ao Google.');
      }
    } finally {
      setLinkLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('ATENÇÃO: Você tem certeza que deseja inativar sua conta? Você não poderá acessar seus links a menos que entre em contato com o suporte.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      // 1. Marca inativo no DB
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid, isActive: false })
      });
      if (!res.ok) throw new Error('Falha ao desativar registro.');

      // 2. Tenta deletar a autenticação
      await deleteAuthUser();
      
      alert('Sua conta foi inativada. Redirecionando...');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        alert('Para excluir a conta permanentemente, faça login novamente e tente de novo.');
        await logout();
        router.push('/login');
      } else {
        alert('Erro ao inativar conta: ' + err.message);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading || !user) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>Carregando...</div>;

  const isGoogleLinked = user.providerData.some(p => p.providerId === 'google.com');

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Settings size={32} />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>Configurações da Conta</h1>
          <p style={{ color: '#94a3b8' }}>Gerencie sua segurança e preferências.</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Senha */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} /> Alterar Senha
          </h2>
          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Nova Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Confirmar Nova Senha</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
              />
            </div>
            <button type="submit" className="btn" disabled={passLoading} style={{ opacity: passLoading ? 0.7 : 1 }}>
              {passLoading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>
        </div>

        {/* Contas Vinculadas */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={20} /> Contas Vinculadas
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            Vincule sua conta ao Google para fazer login rapidamente sem precisar de senha.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={handleLinkGoogle} 
              disabled={isGoogleLinked || linkLoading}
              className="btn"
              style={{ 
                background: isGoogleLinked ? 'rgba(255,255,255,0.05)' : 'white', 
                color: isGoogleLinked ? '#94a3b8' : 'black',
                border: isGoogleLinked ? '1px solid rgba(255,255,255,0.1)' : 'none',
                opacity: linkLoading ? 0.7 : 1
              }}
            >
              {isGoogleLinked ? '✓ Conta Google Vinculada' : 'Vincular conta do Google'}
            </button>
          </div>
        </div>

        {/* Zona de Perigo */}
        <div className="glass" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
            <AlertTriangle size={20} /> Zona de Perigo
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            Ao inativar sua conta, seus links pararão de funcionar imediatamente e seu acesso será revogado. Esta ação não apaga seus dados do banco, mas você precisará do suporte para reativar.
          </p>
          
          <button 
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#f87171', 
              border: '1px solid rgba(239, 68, 68, 0.5)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              opacity: deleteLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <ShieldAlert size={18} />
            {deleteLoading ? 'Inativando...' : 'Inativar Minha Conta'}
          </button>
        </div>

      </div>
    </div>
  );
}
