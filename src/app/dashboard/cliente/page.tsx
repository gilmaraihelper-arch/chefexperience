'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Plus, Calendar, DollarSign, Star, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

export default function DashboardClientePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
      OPEN: 'Aberto',
      CLOSED: 'Fechado',
      CANCELLED: 'Cancelado',
      COMPLETED: 'Concluído',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-green-100 text-green-700',
      CLOSED: 'bg-blue-100 text-blue-700',
      CANCELLED: 'bg-red-100 text-red-700',
      COMPLETED: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-gray-900">Chef Experience</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {user?.name?.split(' ')[0]}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Eventos</h1>
            <p className="text-gray-600">Gerencie seus eventos e orçamentos</p>
          </div>
          <Button 
            onClick={() => router.push('/criar-evento')}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {events.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum evento ainda</h3>
              <p className="text-gray-600 mb-6">Crie seu primeiro evento para receber orçamentos de profissionais</p>
              <Button 
                onClick={() => router.push('/criar-evento')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Evento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{event.guestCount} convidados</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {event.proposals.length} orçamento{event.proposals.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {event.hiredProposal ? (
                        <div className="space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                              <strong>Profissional contratado:</strong> {event.hiredProposal.professional?.user?.name}
                            </p>
                          </div>
                          {event.status === 'COMPLETED' && (
                            <Link href={`/avaliar?evento=${event.id}&profissional=${event.hiredProposal.professional?.id}`}>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Avaliar Profissional
                              </Button>
                            </Link>
                          )}
                        </div>
                      ) : event.proposals.length > 0 ? (
                        <Link href={`/evento/${event.id}/propostas`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-amber-200 text-amber-700 hover:bg-amber-50"
                          >
                            Ver {event.proposals.length} orçamento{event.proposals.length !== 1 ? 's' : ''}
                          </Button>
                        </Link>
                      ) : (
                        <p className="text-sm text-gray-500">Aguardando orçamentos...</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}