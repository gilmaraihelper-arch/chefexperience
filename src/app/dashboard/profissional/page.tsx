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
  Loader2,
  ArrowUpRight,
  MapPin,
  Clock,
  CheckCircle2,
  Eye,
  MessageSquare,
  TrendingUp,
  Plus,
  Settings
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
  clientName?: string;
}

interface Proposta {
  id: string;
  event: Evento;
  totalPrice: number;
  status: string;
  sentAt: string;
}

const faixaPrecoLabels: Record<string, string> = {
  ECONOMICO: 'Econômico',
  INTERMEDIARIO: 'Intermediário',
  PREMIUM: 'Premium',
  LUXO: 'Luxo',
  ULTRA_LUXO: 'Ultra Luxo',
};

export default function DashboardProfissionalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [activeTab, setActiveTab] = useState('disponiveis');
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
      const eventRes = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (eventRes.ok) {
        const eventData = await eventRes.json();
        setEventos(eventData.events?.filter((e: any) => e.status === 'OPEN') || []);
      }

      const propRes = await fetch('/api/proposals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (propRes.ok) {
        const propData = await propRes.json();
        setPropostas(propData.proposals || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleEnviarOrcamento = (evento: Evento) => {
    setEventoSelecionado(evento);
    setModalAberto(true);
  };

  const enviarProposta = async () => {
    if (!eventoSelecionado || !valorProposta) return;
    
    setEnviando(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('/api/proposals', {
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

      if (response.ok) {
        setModalAberto(false);
        setValorProposta('');
        setMensagem('');
        carregarDados(token!);
      }
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
    } finally {
      setEnviando(false);
    }
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

  const calcularMatch = (evento: Evento) => {
    return Math.floor(75 + Math.random() * 20);
  };

  const propostasPendentes = propostas.filter(p => p.status === 'PENDING');
  const propostasAceitas = propostas.filter(p => p.status === 'ACCEPTED');
  const ganhosTotais = propostasAceitas.reduce((acc, p) => acc + p.totalPrice, 0);

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
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Briefcase className="w-4 h-4" />
                <span>Plano Profissional</span>
              </div>
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
                {user?.name?.charAt(0) || 'P'}
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
            Olá, {user?.name?.split(' ')[0] || 'Chef'}! 👨‍🍳
          </h1>
          <p className="text-gray-600">Aqui está o resumo da sua atividade</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Ganhos (Mês)</p>
                  <p className="text-2xl font-bold">R$ {ganhosTotais.toLocaleString('pt-BR')}</p>
                </div>
                <DollarSign className="w-8 h-8 text-white/60" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+23% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Eventos Confirmados</p>
                  <p className="text-2xl font-bold text-gray-900">{propostasAceitas.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Orçamentos Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{propostasPendentes.length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Avaliação</p>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="disponiveis">Disponíveis ({eventos.length})</TabsTrigger>
            <TabsTrigger value="enviados">Orçamentos Enviados ({propostas.length})</TabsTrigger>
            <TabsTrigger value="contratados">Contratados ({propostasAceitas.length})</TabsTrigger>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
          </TabsList>

          <TabsContent value="disponiveis" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Eventos Disponíveis para Orçamento</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar eventos..." className="pl-9 w-64" />
              </div>
            </div>
            
            {eventos.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Nenhum evento disponível no momento</p>
                <p className="text-sm text-gray-400 mt-2">Volte mais tarde para ver novos eventos</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {eventos.map((evento) => (
                  <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{evento.name}</h3>
                            <Badge className="bg-green-100 text-green-700">{calcularMatch(evento)}% Match</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{evento.clientName || 'Cliente'}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(evento.date).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {evento.guestCount} pessoas
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {evento.city}, {evento.state}
                            </span>
                          </div>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-amber-500 to-orange-600"
                          onClick={() => handleEnviarOrcamento(evento)}
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

          <TabsContent value="enviados" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Meus Orçamentos Enviados</h2>
            {propostas.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Você ainda não enviou nenhum orçamento</p>
                <p className="text-sm text-gray-400 mt-2">Clique em "Enviar Orçamento" nos eventos disponíveis</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {propostas.map((proposta) => (
                  <Card key={proposta.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{proposta.event?.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Evento: {new Date(proposta.event?.date).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Enviado: {new Date(proposta.sentAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            R$ {proposta.totalPrice?.toLocaleString('pt-BR')}
                          </p>
                          <Badge className={
                            proposta.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                            proposta.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }>
                            {proposta.status === 'PENDING' ? 'Aguardando' :
                             proposta.status === 'ACCEPTED' ? 'Aceito' : 'Recusado'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contratados" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Eventos Contratados</h2>
            {propostasAceitas.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">Você ainda não tem eventos contratados</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {propostasAceitas.map((proposta) => (
                  <Card key={proposta.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{proposta.event?.name}</h3>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Confirmado</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(proposta.event?.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {proposta.event?.guestCount} pessoas
                        </span>
                      </div>
                      <div className="pt-4 border-t flex items-center justify-between">
                        <span className="text-xl font-bold text-amber-600">
                          R$ {proposta.totalPrice?.toLocaleString('pt-BR')}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendario" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Calendário de Eventos</h2>
                <p className="text-sm text-gray-500">Visualize seus eventos confirmados</p>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configurar Disponibilidade
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Fevereiro 2026</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Anterior</Button>
                    <Button size="sm" variant="outline">Próximo</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                    <div key={dia} className="text-xs font-medium text-gray-500 py-2">{dia}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }, (_, i) => {
                    const dia = i + 1;
                    const evento = propostasAceitas.find(p => {
                      const data = new Date(p.event?.date);
                      return data.getDate() === dia && data.getMonth() === 1;
                    });
                    
                    return (
                      <div
                        key={dia}
                        className={`aspect-square border rounded-lg p-1 text-sm ${
                          evento 
                            ? 'bg-green-100 border-green-300' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{dia}</div>
                        {evento && (
                          <div className="text-xs mt-1">
                            <CheckCircle2 className="w-3 h-3 inline text-green-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Legenda</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Evento Confirmado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Orçamento Enviado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Envio de Orçamento */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Orçamento</DialogTitle>
          </DialogHeader>
          
          {eventoSelecionado && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900">{eventoSelecionado.name}</h4>
                <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                  <span>📅 {new Date(eventoSelecionado.date).toLocaleDateString('pt-BR')}</span>
                  <span>👥 {eventoSelecionado.guestCount} pessoas</span>
                </div>
              </div>

              <div>
                <Label htmlFor="valor">Valor do Orçamento (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  value={valorProposta}
                  onChange={(e) => setValorProposta(e.target.value)}
                  placeholder="Ex: 15000"
                />
              </div>

              <div>
                <Label htmlFor="mensagem">Mensagem para o Cliente</Label>
                <Textarea
                  id="mensagem"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Escreva uma mensagem personalizada..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setModalAberto(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                  onClick={enviarProposta}
                  disabled={enviando || !valorProposta}
                >
                  {enviando ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Enviar Orçamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
