'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  Plus, 
  Calendar, 
  DollarSign, 
  Star, 
  LogOut, 
  Loader2,
  Heart,
  CheckCircle2,
  Users,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Event {
  id: string;
  name: string;
  eventType: string;
  date: string;
  guestCount: number;
  status: string;
  proposals: any[];
  hiredProposal?: any;
}

interface Proposal {
  id: string;
  professionalName: string;
  totalPrice: number;
  status: string;
}

export default function DashboardClientePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('eventos');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchEvents(token);
  }, [router]);

  const fetchEvents = async (token: string) => {
    try {
      const response = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      OPEN: 'Aguardando',
      CLOSED: 'Contratado',
      CANCELLED: 'Cancelado',
      COMPLETED: 'Concluído',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-amber-100 text-amber-700',
      CLOSED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CASAMENTO: 'Casamento',
      ANIVERSARIO: 'Aniversário',
      CORPORATIVO: 'Corporativo',
      FORMATURA: 'Formatura',
      CONFRATERNIZACAO: 'Confraternização',
      OUTRO: 'Outro',
    };
    return labels[type] || type;
  };

  const eventosAbertos = events.filter(e => e.status === 'OPEN');
  const eventosContratados = events.filter(e => e.status === 'CLOSED');
  const totalPropostas = events.reduce((acc, e) => acc + (e.proposals?.length || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {user?.name?.split(' ')[0] || 'Cliente'}! 👋
          </h1>
          <p className="text-gray-600">Bem-vindo ao seu dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Meus Eventos</p>
                  <p className="text-2xl font-bold">{events.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{totalPropostas}</p>
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
                  <p className="text-2xl font-bold text-gray-900">0</p>
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
                  <p className="text-2xl font-bold text-gray-900">{eventosContratados.length}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="eventos">Meus Eventos ({eventosAbertos.length})</TabsTrigger>
            <TabsTrigger value="propostas">Propostas ({totalPropostas})</TabsTrigger>
            <TabsTrigger value="contratados">Contratados ({eventosContratados.length})</TabsTrigger>
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
            
            {eventosAbertos.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">Você ainda não tem eventos criados</p>
                <Button 
                  onClick={() => router.push('/criar-evento')}
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {eventosAbertos.map((evento) => (
                  <Card key={evento.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-32 bg-gradient-to-r from-amber-100 to-orange-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-amber-300" />
                      </div>
                      <Badge className={`absolute top-2 right-2 ${getStatusColor(evento.status)}`}>
                        {getStatusLabel(evento.status)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900">{evento.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(evento.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {evento.guestCount} pessoas
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          {evento.proposals?.length || 0} propostas recebidas
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-amber-200 text-amber-600"
                          onClick={() => router.push(`/evento/${evento.id}/propostas`)}
                        >
                          Ver Propostas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="propostas" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Propostas Recebidas</h2>
            {totalPropostas === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Você ainda não recebeu propostas</p>
                <p className="text-sm text-gray-400 mt-2">Crie um evento para receber propostas de chefs</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {events.flatMap(e => e.proposals?.map(p => ({ ...p, eventName: e.name })) || []).map((proposta: any) => (
                  <Card key={proposta.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                            {proposta.professionalName?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{proposta.professionalName}</h3>
                            <p className="text-sm text-gray-500">{proposta.eventName}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm">4.8</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-600">
                            R$ {proposta.totalPrice?.toLocaleString('pt-BR')}
                          </p>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                            Pendente
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          Ver Detalhes
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600">
                          Aceitar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contratados" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Serviços Contratados</h2>
            {eventosContratados.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Você ainda não contratou nenhum serviço</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {eventosContratados.map((evento) => (
                  <Card key={evento.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{evento.name}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(evento.date).toLocaleDateString('pt-BR')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {evento.guestCount} pessoas
                                </span>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Confirmado</Badge>
                          </div>
                          <div className="mt-4 pt-4 border-t flex items-center justify-between">
                            <span className="text-2xl font-bold text-amber-600">
                              R$ {evento.hiredProposal?.totalPrice?.toLocaleString('pt-BR') || '0'}
                            </span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Chat
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
