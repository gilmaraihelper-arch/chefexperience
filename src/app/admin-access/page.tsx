'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminDirectAccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Inicializando...');

  useEffect(() => {
    const setupAdmin = async () => {
      try {
        setStatus('Verificando acesso...');
        
        // Verifica se já tem sessão
        const sessionRes = await fetch('/api/debug/session');
        const sessionData = await sessionRes.json();
        
        if (sessionData.session?.user?.type === 'ADMIN') {
          setStatus('Você já é admin! Redirecionando...');
          setTimeout(() => router.push('/admin'), 1000);
          return;
        }

        // Se não tem sessão, tenta gerar token
        setStatus('Gerando token de acesso...');
        
        const tokenRes = await fetch('/api/auth/setup-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'gilmar.aihelper@gmail.com' })
        });
        
        const tokenData = await tokenRes.json();
        
        if (tokenData.success) {
          // Salva o token no localStorage
          localStorage.setItem('admin-token', tokenData.token);
          localStorage.setItem('user', JSON.stringify(tokenData.user));
          
          setStatus('Token salvo! Redirecionando para admin...');
          setTimeout(() => router.push('/admin'), 1000);
        } else {
          setStatus('Erro: ' + (tokenData.error || 'Desconhecido'));
        }
      } catch (error) {
        setStatus('Erro: ' + (error as Error).message);
      }
    };

    setupAdmin();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
      <p className="text-gray-600 text-center">{status}</p>
      
      <div className="mt-8 p-4 bg-white rounded-lg shadow max-w-md">
        <p className="text-sm text-gray-500 mb-2">Se não funcionar automaticamente:</p>
        <a 
          href="/admin" 
          className="block w-full text-center bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 px-4 rounded hover:from-amber-600 hover:to-orange-700"
        >
          Tentar Acessar Admin Direto
        </a>
      </div>
    </div>
  );
}
