'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: any | null;
  userType: string | null;
}

export function useAuth() {
  const { data: session, status: sessionStatus } = useSession();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    token: null,
    user: null,
    userType: null,
  });

  const initializeAuth = useCallback(async () => {
    // Se tem sessão NextAuth, usar ela
    if (sessionStatus === 'authenticated' && session?.user) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        token: null, // NextAuth gerencia o token
        user: session.user,
        userType: (session.user as any)?.type || null,
      });
      return;
    }

    // Se não tem sessão, verificar localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          token,
          user,
          userType: user?.type || null,
        });
        return;
      } catch (e) {
        console.error('Erro ao parsear usuário:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Sem auth
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      user: null,
      userType: null,
    });
  }, [session, sessionStatus]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      user: null,
      userType: null,
    });
    window.location.href = '/logout';
  }, []);

  const refreshToken = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return null;

    try {
      const res = await fetch('/api/auth/token', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          setAuthState(prev => ({ ...prev, token: data.token }));
          return data.token;
        }
      }
    } catch (e) {
      console.error('Erro ao refresh token:', e);
    }
    return null;
  }, []);

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authState.token) {
      headers['Authorization'] = `Bearer ${authState.token}`;
    }
    
    return headers;
  }, [authState.token]);

  return {
    ...authState,
    logout,
    refreshToken,
    getAuthHeaders,
    isClient: typeof window !== 'undefined',
  };
}

export default useAuth;
