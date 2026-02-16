'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  Calendar, 
  DollarSign, 
  Star, 
  Search,
  Users,
  LogOut,
  Send,
  Briefcase,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Evento {
  id: string;
  name: string;
  eventType: string;
  date: string;
  guestCount: number;
  city: string;
  state: string;
}

interface Proposta {
  id: string;
  event: Evento;
  totalPrice: number;
  status: string;
  sentAt: string;
}

export default function DashboardProfissionalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [valorProposta, setValorProposta] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.type !== 'PROFESSIONAL') {
        router.push('/dashboard/cliente');
        return;
      }
      setUser(parsed);
    }

    carregarDados(token);
  }, [router]);

  const carregarDados = async (token: string) => {
    try {
      // Buscar eventos disponíveis (simulado - precisa criar endpoint)
      // Por enquanto, vamos buscar todos os eventos abertos
      const eventRes = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (eventRes.ok) {
        const eventData = await eventRes.json();
        // Filtrar apenas eventos abertos de outros clientes
        setEventos(eventData.events?.filter((e: any) => e.status === 'OPEN') || []);
      }

      // Buscar propostas enviadas
      const propRes = await fetch('/api/proposals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (propRes.ok) {
        const propData = await propRes.json();
        setPropostas(propData.proposals || []);
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const abrirModalProposta = (evento: Evento) => {
    setEventoSelecionado(evento);
    setModalAberto(true);
  };

  const enviarProposta = async () => {
    if (!eventoSelecionado) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    setEnviando(true);
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: eventoSelecionado.id,
          totalPrice: parseFloat(valorProposta),
          message: mensagem,
        }),
      });

      if (res.ok) {
        setModalAberto(false);
        setValorProposta('');
        setMensagem('');
        carregarDados(token);
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
    } finally {
      setEnviando(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      ACCEPTED: 'Aceita',
      REJECTED: 'Recusada',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Profissional</h1>

        <Tabs defaultValue="eventos">
          <TabsList className="mb-6">
            <TabsTrigger value="eventos">Eventos Disponíveis</TabsTrigger>
            <TabsTrigger value="propostas">Minhas Propostas</TabsTrigger>
          </TabsList>

          <TabsContent value="eventos">
            {eventos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum evento disponível no momento</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {eventos.map((evento) => (
                  <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{evento.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(evento.date).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {evento.guestCount} convidados
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{evento.city}, {evento.state}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => abrirModalProposta(evento)}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Orçamento
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="propostas">
            {propostas.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Você ainda não enviou nenhuma proposta</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {propostas.map((proposta) => (
                  <Card key={proposta.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{proposta.event?.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                            <div>{new Date(proposta.event?.date).toLocaleDateString('pt-BR')}</div>
                            <div>R$ {proposta.totalPrice?.toLocaleString('pt-BR')}</div>
                          </div>
                          <Badge className={getStatusColor(proposta.status)}>
                            {getStatusLabel(proposta.status)}
                          </Badge>
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

      {/* Modal de Proposta */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Orçamento</DialogTitle>
          </DialogHeader>
          
          {eventoSelecionado && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{eventoSelecionado.name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(eventoSelecionado.date).toLocaleDateString('pt-BR')} • {eventoSelecionado.guestCount} convidados
                </p>
              </div>

              <div>
                <Label>Valor Total (R$) *</Label>
                <Input
                  type="number"
                  value={valorProposta}
                  onChange={(e) => setValorProposta(e.target.value)}
                  placeholder="15000"
                />
              </div>

              <div>
                <Label>Mensagem *</Label>
                <Textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Descreva o que está incluído no seu orçamento..."
                  rows={4}
                />
              </div>

              <Button
                onClick={enviarProposta}
                disabled={!valorProposta || !mensagem || enviando}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              >
                {enviando ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Proposta
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}