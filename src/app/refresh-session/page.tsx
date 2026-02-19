'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function RefreshSessionPage() {
  const router = useRouter();
  const { data: session, update } = useSession();

  useEffect(() => {
    const refreshSession = async () => {
      // Força atualização da sessão
      await update();
      
      // Redireciona para admin após 1 segundo
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    };

    refreshSession();
  }, [update, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
      <p className="text-gray-600">Atualizando sua sessão...</p>
    </div>
  );
}
