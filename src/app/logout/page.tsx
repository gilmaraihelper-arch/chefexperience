'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function ForceLogoutPage() {
  useEffect(() => {
    // Força logout de tudo
    localStorage.clear();
    sessionStorage.clear();
    
    // Faz logout do NextAuth
    signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Saindo... Aguarde</p>
    </div>
  );
}
