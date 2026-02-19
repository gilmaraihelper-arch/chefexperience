'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  Calendar, 
  DollarSign, 
  Star, 
  Heart, 
  Plus,
  Users,
  CheckCircle2,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meusEventos = [
  {
    id: 1,
    nome: 'Casamento Ana e Pedro',
    tipo: 'Casamento',
    data: '2026-03-15',
    pessoas: 150,
    status: 'propostas',
    propostas: 5,
    imagem: '/evento-casamento.jpg',
  },
  {
    id: 2,
    nome: 'Aniversário 30 anos',
    tipo: 'Aniversário',
    data: '2026-02-20',
    pessoas: 50,
    status: 'contratado',
    profissional: 'Chef Ricardo Mendes',
    valor: 8500,
    imagem: '/buffet-evento.jpg',
  },
  {
    id: 3,
    nome: 'Confraternização Empresa XYZ',
    tipo: 'Corporativo',
    data: '2025-12-20',
    pessoas: 80,
    status: 'concluido',
    profissional: 'Buffê Gourmet Silva',
    valor: 12000,
    avaliado: false,
    imagem: '/buffet-evento.jpg',
  },
  {
    id: 4,
    nome: 'Festa de Aniversário Maria',
    tipo: 'Aniversário',
    data: '2025-11-15',
    pessoas: 40,
    status: 'concluido',
    profissional: 'Chef Maria Oliveira',
    valor: 4500,
    avaliado: true,
    imagem: '/evento-casamento.jpg',
  },
];

const propostasRecebidas = [
  {
    id: 1,
    evento: 'Casamento Ana e Pedro',
    profissional: 'Buffê Gourmet Silva',
    avatar: 'BS',
    valor: 18500,
    rating: 4.8,
    avaliacoes: 127,
    dataEnvio: '2026-01-28',
  },
  {
    id: 2,
    evento: 'Casamento Ana e Pedro',
    profissional: 'Chef Maria Oliveira',
    avatar: 'MO',
    valor: 16200,
    rating: 4.9,
    avaliacoes: 89,
    dataEnvio: '2026-01-27',
  },
  {
    id: 3,
    evento: 'Casamento Ana e Pedro',
    profissional: 'Catering Premium',
    avatar: 'CP',
    valor: 22000,
    rating: 4.7,
    avaliacoes: 203,
    dataEnvio: '2026-01-26',
  },
];

const profissionaisFavoritos = [
  {
    id: 1,
    nome: 'Chef Ricardo Mendes',
    especialidade: 'Coz Francesa & Italiana',
    rating: 4.9,
    avaliacoes: 127,
    foto: '/chef-profissional.jpg',
  },
  {
    id: 2,
    nome: 'Buffê Gourmet Silva',
    especialidade: 'Buffet & Eventos',
    rating: 4.8,
    avaliacoes: 203,
    foto: '/buffet-evento.jpg',
  },
];

export default function DashboardClientePage() {
  const router = useRouter();
  const [abaAtiva, setAbaAtiva] = useState('eventos');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/criar-evento')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                AS
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/logout')}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Olá, Ana! 👋</h1>
          <p className="text-gray-600">Bem-vinda ao seu dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Meus Eventos</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Calendar className="w-8 h-8 text-white/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Propostas</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <DollarSign className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Favoritos</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Contratados</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">P/ Avaliar</p>
                  <p className="text-2xl font-bold text-green-600">1</p>
                </div>
                <Star className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
          <TabsList className="mb-6">
            <TabsTrigger value="eventos">Meus Eventos</TabsTrigger>
            <TabsTrigger value="propostas">Propostas (5)</TabsTrigger>
            <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
            <TabsTrigger value="contratados">Contratados</TabsTrigger>
          </TabsList>

          <TabsContent value="eventos" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Meus Eventos</h2>
              <Button 
                size="sm"
                onClick={() => router.push('/criar-evento')}
                className="bg-gradient-to-r from-amber-500 to-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Evento
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {meusEventos.map((evento) => (
                <Card key={evento.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gray-100 relative">
                    <img src={evento.imagem} alt={evento.nome} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-white/90">
                      {evento.status === 'propostas' ? 'Aguardando' : 'Contratado'}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">{evento.nome}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {evento.pessoas} pessoas
                      </span>
                    </div>
                    {evento.status === 'propostas' ? (
                      <div className="mt-4 flex items-center justify-between">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          {evento.propostas} propostas recebidas
                        </Badge>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-amber-500 to-orange-600"
                          onClick={() => router.push('/evento/123/propostas')}
                        >
                          Ver Propostas
                        </Button>
                      </div>
                    ) : evento.status === 'concluido' ? (
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600 block">{evento.profissional}</span>
                          <span className="font-semibold text-amber-600">
                            R$ {evento.valor?.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        {evento.avaliado ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Avaliado
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-green-500 to-emerald-600"
                            onClick={() => router.push('/avaliar')}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Avaliar
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600 block">{evento.profissional}</span>
                          <span className="font-semibold text-amber-600">
                            R$ {evento.valor?.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Contratado</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="propostas" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Propostas Recebidas</h2>
            <div className="space-y-3">
              {propostasRecebidas.map((proposta) => (
                <Card key={proposta.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                        {proposta.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{proposta.profissional}</h3>
                            <p className="text-sm text-gray-500">{proposta.evento}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-medium">{proposta.rating}</span>
                              <span className="text-sm text-gray-400">({proposta.avaliacoes} avaliações)</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-amber-600">
                              R$ {proposta.valor.toLocaleString('pt-BR')}
                            </p>
                            <p className="text-xs text-gray-400">Enviada em {new Date(proposta.dataEnvio).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Aceitar Proposta
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Conversar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favoritos" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Profissionais Favoritos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {profissionaisFavoritos.map((prof) => (
                <Card key={prof.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={prof.foto} alt={prof.nome} className="w-16 h-16 rounded-full object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{prof.nome}</h3>
                        <p className="text-sm text-gray-500">{prof.especialidade}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium">{prof.rating}</span>
                          <span className="text-sm text-gray-400">({prof.avaliacoes} avaliações)</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Ver Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contratados" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Profissionais Contratados</h2>
            {meusEventos.filter(e => e.status === 'contratado' || e.status === 'concluido').map((evento) => (
              <Card key={evento.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{evento.profissional}</h3>
                      <p className="text-sm text-gray-500">{evento.nome}</p>
                      <p className="text-sm text-gray-400">{new Date(evento.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-amber-600">
                        R$ {evento.valor?.toLocaleString('pt-BR')}
                      </p>
                      <Badge className={evento.status === 'concluido' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                        {evento.status === 'concluido' ? 'Concluído' : 'Em andamento'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
