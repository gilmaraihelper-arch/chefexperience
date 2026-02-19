'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChefHat, User, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function EscolherTipoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSelect = (tipo: 'cliente' | 'profissional') => {
    setLoading(true);
    // Redirecionar para o cadastro existente
    router.push(`/cadastro/${tipo}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl shadow-amber-900/5">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Complete seu cadastro
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {session?.user?.name || 'visitante'}! Escolha como deseja usar o ChefExperience
            </p>
          </div>

          {/* Opções */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Cliente */}
            <button
              onClick={() => handleSelect('cliente')}
              disabled={loading}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Sou Cliente
              </h3>
              <p className="text-sm text-gray-600">
                Quero encontrar profissionais para meus eventos
              </p>
              <div className="mt-4 flex items-center text-amber-600 text-sm font-medium">
                Cadastrar como cliente
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Profissional */}
            <button
              onClick={() => handleSelect('profissional')}
              disabled={loading}
              className="group p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Sou Profissional
              </h3>
              <p className="text-sm text-gray-600">
                Quero oferecer meus serviços gastronômicos
              </p>
              <div className="mt-4 flex items-center text-amber-600 text-sm font-medium">
                Cadastrar como profissional
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {loading && (
            <div className="mt-6 text-center text-gray-600">
              Redirecionando...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}