'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ChefHat, 
  User, 
  Briefcase, 
  ArrowRight, 
  Star,
  Calendar,
  Search,
  Award,
  Utensils,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function EscolherTipoPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Salvar token da URL (vindo do OAuth)
  useEffect(() => {
    // Verificar token na URL usando window.location
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        // Remover token da URL
        window.history.replaceState({}, '', '/completar-cadastro/escolher-tipo');
      }
    }
  }, []);

  const handleSelect = (tipo: 'cliente' | 'profissional') => {
    setLoading(tipo);
    router.push(`/cadastro/${tipo}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex flex-col">
      {/* Header com logo */}
      <header className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              ChefExperience
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Welcome Section */}
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
              <Star className="w-3 h-3 mr-1 fill-amber-500" />
              Bem-vindo{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Como você quer usar o{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                ChefExperience
              </span>
              ?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha o perfil que melhor se adequa às suas necessidades e comece sua jornada gastronômica
            </p>
          </div>

          {/* Cards de opções */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cliente */}
            <Card 
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 border-2 ${
                hovered === 'cliente' 
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02]' 
                  : 'border-gray-200 hover:border-blue-300 shadow-lg'
              } ${loading === 'cliente' ? 'opacity-70' : ''}`}
              onClick={() => !loading && handleSelect('cliente')}
              onMouseEnter={() => setHovered('cliente')}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-bl-full opacity-50" />
              
              <CardContent className="p-8 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    <Heart className="w-3 h-3 mr-1 fill-blue-500" />
                    Para você
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Sou Cliente
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Encontre os melhores chefs, buffets e profissionais gastronômicos para seus eventos especiais. Casamentos, aniversários, corporativos e muito mais.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Search className="w-3 h-3 text-blue-600" />
                    </div>
                    <span>Busque profissionais próximos</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-blue-600" />
                    </div>
                    <span>Orçamentos gratuitos</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Award className="w-3 h-3 text-blue-600" />
                    </div>
                    <span>Avaliações verificadas</span>
                  </div>
                </div>

                <Button 
                  className={`w-full transition-all ${
                    hovered === 'cliente'
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={!!loading}
                >
                  {loading === 'cliente' ? (
                    'Redirecionando...'
                  ) : (
                    <>
                      Quero contratar profissionais
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Profissional */}
            <Card 
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 border-2 ${
                hovered === 'profissional' 
                  ? 'border-amber-500 shadow-2xl shadow-amber-500/20 scale-[1.02]' 
                  : 'border-gray-200 hover:border-amber-300 shadow-lg'
              } ${loading === 'profissional' ? 'opacity-70' : ''}`}
              onClick={() => !loading && handleSelect('profissional')}
              onMouseEnter={() => setHovered('profissional')}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-50 rounded-bl-full opacity-50" />
              
              <CardContent className="p-8 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                    <Utensils className="w-3 h-3 mr-1" />
                    Para chefs
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Sou Profissional
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Ofereça seus serviços gastronômicos e alcance milhares de clientes. Buffets, chefs, cozinheiros e fornecedores de eventos.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-amber-600" />
                    </div>
                    <span>Receba solicitações de orçamento</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <Star className="w-3 h-3 text-amber-600" />
                    </div>
                    <span>Construa sua reputação</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <Award className="w-3 h-3 text-amber-600" />
                    </div>
                    <span>Aumente sua renda</span>
                  </div>
                </div>

                <Button 
                  className={`w-full transition-all ${
                    hovered === 'profissional'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={!!loading}
                >
                  {loading === 'profissional' ? (
                    'Redirecionando...'
                  ) : (
                    <>
                      Quero oferecer meus serviços
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{' '}
              <a href="/login" className="text-amber-600 hover:underline font-medium">
                Faça login
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}