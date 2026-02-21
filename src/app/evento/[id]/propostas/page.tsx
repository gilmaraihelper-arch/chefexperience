'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  ArrowLeft, 
  Star, 
  Calendar, 
  Users, 
  MapPin,
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  TrendingDown,
  TrendingUp,
  Award,
  Utensils,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NotificationBell } from '@/components/notifications';

interface Proposta {
  id: string;
  professional: {
    id: string;
    user: {
      name: string;
      email?: string;
    };
    rating: number;
    reviewCount: number;
    description?: string;
    cuisineStyles?: string;
    serviceTypes?: string;
    totalEvents?: number;
  };
  totalPrice: number;
  pricePerPerson: number | null;
  message: string;
  sentAt: string;
  status: string;
  event?: {
    id: string;
  };
  eventId?: string;
}

interface Evento {
  id: string;
  name: string;
  eventType: string;
  date: string;
  guestCount: number;
  city: string;
  state: string;
  status: string;
  hiredProposalId: string | null;
  maxBudget?: number | null;
}

const eventTypeLabels: Record<string, string> = {
  CASAMENTO: 'Casamento',
  ANIVERSARIO: 'Aniversário',
  CORPORATIVO: 'Evento Corporativo',
  FORMATURA: 'Formatura',
  CONFRATERNIZACAO: 'Confraternização',
  JANTAR: 'Jantar',
  COQUETEL: 'Coquetel',
  FESTA_INFANTIL: 'Festa Infantil',
  DEBUTANTE: 'Debutante',
  BODAS: 'Bodas',
  CHA_BEBE: 'Chá de Bebê',
  NOIVADO: 'Noivado',
};

export default function VerPropostasPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [propostaSelecionada, setPropostaSelecionada] = useState<Proposta | null>(null);
  const [propostaComparada, setPropostaComparada] = useState<Proposta | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalComparar, setModalComparar] = useState(false);
  const [acaoLoading, setAcaoLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    carregarDados(token);
  }, [eventId, router]);

  const carregarDados = async (token: string) => {
    try {
      // Buscar evento
      const eventRes = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (eventRes.ok) {
        const eventData = await eventRes.json();
        const ev = eventData.events.find((e: Evento) => e.id === eventId);
        if (ev) setEvento(ev);
      }

      // Buscar propostas
      const propRes = await fetch('/api/proposals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (propRes.ok) {
        const propData = await propRes.json();
        const propostasEvento = propData.proposals.filter((p: Proposta) => 
          p.event?.id === eventId || p.eventId === eventId
        );
        // Ordenar por preço (menor primeiro)
        propostasEvento.sort((a: Proposta, b: Proposta) => a.totalPrice - b.totalPrice);
        setPropostas(propostasEvento);
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAceitar = async (propostaId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setAcaoLoading(true);
    try {
      const res = await fetch(`/api/proposals/${propostaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'accept' }),
      });

      if (res.ok) {
        setModalAberto(false);
        setModalComparar(false);
        carregarDados(token);
      }
    } catch (error) {
      console.error('Erro ao aceitar:', error);
    } finally {
      setAcaoLoading(false);
    }
  };

  const handleRecusar = async (propostaId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setAcaoLoading(true);
    try {
      const res = await fetch(`/api/proposals/${propostaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (res.ok) {
        setModalAberto(false);
        setModalComparar(false);
        carregarDados(token);
      }
    } catch (error) {
      console.error('Erro ao recusar:', error);
    } finally {
      setAcaoLoading(false);
    }
  };

  const abrirModal = (proposta: Proposta) => {
    setPropostaSelecionada(proposta);
    setModalAberto(true);
  };

  const abrirComparar = (proposta: Proposta) => {
    setPropostaComparada(proposta);
    setModalComparar(true);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      ACCEPTED: 'Aceita',
      REJECTED: 'Recusada',
      EXPIRED: 'Expirada',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
      ACCEPTED: 'bg-green-100 text-green-700 border-green-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
      EXPIRED: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  const calcularEconomia = (precoAtual: number, precoBase: number) => {
    if (!precoBase || precoBase === 0) return 0;
    return Math.round(((precoBase - precoAtual) / precoBase) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
        <div className="text-center">
          <p className="text-gray-600">Evento não encontrado</p>
          <Link href="/dashboard/cliente">
            <Button className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const propostaAceita = propostas.find(p => p.status === 'ACCEPTED');
  const propostasPendentes = propostas.filter(p => p.status === 'PENDING');
  const menorPreco = propostasPendentes.length > 0 ? propostasPendentes[0].totalPrice : null;
  const maiorPreco = propostasPendentes.length > 0 ? propostasPendentes[propostasPendentes.length - 1].totalPrice : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard/cliente" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <span className="text-sm text-gray-500">Orçamentos</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard/cliente">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        {/* Card do Evento */}
        <Card className="mb-8 overflow-hidden border-amber-100">
          <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {eventTypeLabels[evento.eventType] || evento.eventType}
                  </Badge>
                  <Badge className={getStatusColor(evento.status)}>
                    {getStatusLabel(evento.status)}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{evento.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <span>{new Date(evento.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>{evento.guestCount} convidados</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{evento.city}, {evento.state}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proposta Aceita */}
        {propostaAceita && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Profissional Contratado</h2>
                <p className="text-sm text-gray-500">Parabéns! Seu evento já tem um chef.</p>
              </div>
            </div>
            
            <Card className="border-green-200 bg-gradient-to-br from-green-50/80 to-emerald-50/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <ChefHat className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{propostaAceita.professional.user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">{propostaAceita.professional.rating}</span>
                          </div>
                          <span className="text-gray-500">({propostaAceita.professional.reviewCount} avaliações)</span>
                          {propostaAceita.professional.totalEvents && (
                            <span className="text-gray-400">• {propostaAceita.professional.totalEvents} eventos realizados</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-amber-600">
                          {formatCurrency(propostaAceita.totalPrice)}
                        </p>
                        {propostaAceita.pricePerPerson && (
                          <p className="text-sm text-gray-500">
                            {formatCurrency(propostaAceita.pricePerPerson)} por pessoa
                          </p>
                        )}
                      </div>
                    </div>
                    {propostaAceita.message && (
                      <div className="mt-4 bg-white/60 p-4 rounded-lg border border-green-100">
                        <p className="text-gray-700 italic">"{propostaAceita.message}"</p>
                      </div>
                    )}
                    <div className="mt-4 flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Conversar
                      </Button>
                      <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Propostas Pendentes */}
        {!propostaAceita && propostasPendentes.length > 0 && (
          <div>
            {/* Resumo de preços */}
            {propostasPendentes.length > 1 && (
              <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-900">Resumo dos Orçamentos</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(menorPreco || 0)}</p>
                      <p className="text-xs text-gray-500">Menor preço</p>
                    </div>
                    <div className="text-center border-x border-blue-100">
                      <p className="text-2xl font-bold text-amber-600">
                        {formatCurrency(propostasPendentes.reduce((acc, p) => acc + p.totalPrice, 0) / propostasPendentes.length)}
                      </p>
                      <p className="text-xs text-gray-500">Preço médio</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-600">{formatCurrency(maiorPreco || 0)}</p>
                      <p className="text-xs text-gray-500">Maior preço</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {propostasPendentes.length} orçamento{propostasPendentes.length !== 1 ? 's' : ''} recebido{propostasPendentes.length !== 1 ? 's' : ''}
                </h2>
                <p className="text-sm text-gray-500">Compare e escolha o melhor para seu evento</p>
              </div>
            </div>

            <div className="space-y-4">
              {propostasPendentes.map((proposta, index) => {
                const economia = index > 0 && menorPreco ? calcularEconomia(proposta.totalPrice, maiorPreco || proposta.totalPrice) : 0;
                const isMelhorPreco = index === 0 && propostasPendentes.length > 1;
                
                return (
                  <Card key={proposta.id} className={`overflow-hidden transition-all hover:shadow-lg ${isMelhorPreco ? 'border-green-300 ring-1 ring-green-200' : ''}`}>
                    {isMelhorPreco && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1 flex items-center gap-2">
                        <Award className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-medium">Melhor preço</span>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Avatar do Chef */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                            <ChefHat className="w-8 h-8 md:w-10 md:h-10 text-white" />
                          </div>
                        </div>
                        
                        {/* Informações do Chef */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{proposta.professional.user.name}</h3>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  <span className="text-sm font-medium">{proposta.professional.rating}</span>
                                </div>
                                <span className="text-xs text-gray-500">({proposta.professional.reviewCount} avaliações)</span>
                                {proposta.professional.totalEvents && proposta.professional.totalEvents > 0 && (
                                  <span className="text-xs text-gray-400">• {proposta.professional.totalEvents} eventos</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Preço */}
                            <div className="text-left md:text-right">
                              <div className="flex items-center md:justify-end gap-2">
                                <p className="text-2xl md:text-3xl font-bold text-amber-600">
                                  {formatCurrency(proposta.totalPrice)}
                                </p>
                                {economia > 0 && (
                                  <Badge className="bg-green-100 text-green-700">
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                    -{economia}%
                                  </Badge>
                                )}
                              </div>
                              {proposta.pricePerPerson && (
                                <p className="text-sm text-gray-500">
                                  {formatCurrency(proposta.pricePerPerson)} por pessoa
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Mensagem */}
                          {proposta.message && (
                            <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <p className="text-sm text-gray-600 line-clamp-2">"{proposta.message}"</p>
                            </div>
                          )}
                          
                          {/* Data da proposta */}
                          <p className="text-xs text-gray-400 mt-3">
                            Enviada em {new Date(proposta.sentAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                          </p>
                          
                          {/* Botões */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button 
                              onClick={() => abrirModal(proposta)}
                              className="flex-1 md:flex-none bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                            >
                              Ver Detalhes
                            </Button>
                            {propostasPendentes.length > 1 && index > 0 && (
                              <Button 
                                variant="outline"
                                onClick={() => abrirComparar(proposta)}
                                className="flex-1 md:flex-none"
                              >
                                Comparar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Sem propostas */}
        {!propostaAceita && propostasPendentes.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aguardando orçamentos</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Seu evento está publicado e os chefs estão visualizando. 
                Você receberá notificações assim que os orçamentos começarem a chegar.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-amber-600">
                <Sparkles className="w-4 h-4" />
                <span>Tipicamente em até 24 horas</span>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modal de Detalhes */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Detalhes da Proposta</DialogTitle>
            <DialogDescription>
              Revise todos os detalhes antes de fazer sua escolha
            </DialogDescription>
          </DialogHeader>
          
          {propostaSelecionada && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Header do Chef */}
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <ChefHat className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{propostaSelecionada.professional.user.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="font-medium">{propostaSelecionada.professional.rating}</span>
                      </div>
                      <span className="text-gray-500">({propostaSelecionada.professional.reviewCount} avaliações)</span>
                    </div>
                    {propostaSelecionada.professional.totalEvents && (
                      <p className="text-sm text-gray-500 mt-1">
                        {propostaSelecionada.professional.totalEvents} eventos realizados
                      </p>
                    )}
                  </div>
                </div>

                {/* Preço */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Valor Total</p>
                    <p className="text-4xl font-bold text-amber-600">
                      {formatCurrency(propostaSelecionada.totalPrice)}
                    </p>
                    {propostaSelecionada.pricePerPerson && (
                      <p className="text-gray-600 mt-2">
                        {formatCurrency(propostaSelecionada.pricePerPerson)} por pessoa
                        <span className="text-gray-400"> • {evento.guestCount} convidados</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Mensagem */}
                {propostaSelecionada.message && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Mensagem do Chef
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-700 leading-relaxed">{propostaSelecionada.message}</p>
                    </div>
                  </div>
                )}

                {/* Info do evento */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">Sobre seu evento</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-800">{new Date(evento.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-800">{evento.guestCount} convidados</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-800">{evento.city}, {evento.state}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleRecusar(propostaSelecionada.id)}
                    disabled={acaoLoading}
                  >
                    {acaoLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Recusar
                      </>
                    )}
                  </Button>
                  
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    onClick={() => handleAceitar(propostaSelecionada.id)}
                    disabled={acaoLoading}
                  >
                    {acaoLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Contratar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Comparação */}
      <Dialog open={modalComparar} onOpenChange={setModalComparar}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Comparar Propostas</DialogTitle>
            <DialogDescription>
              Compare lado a lado para fazer a melhor escolha
            </DialogDescription>
          </DialogHeader>
          
          {propostaComparada && propostasPendentes[0] && (
            <ScrollArea className="max-h-[60vh]">
              <div className="grid md:grid-cols-2 gap-6 pr-4">
                {/* Melhor preço */}
                <div className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <Badge className="bg-green-100 text-green-700 mb-2">
                      <Award className="w-3 h-3 mr-1" />
                      Melhor Preço
                    </Badge>
                    <h4 className="font-semibold">{propostasPendentes[0].professional.user.name}</h4>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(propostasPendentes[0].totalPrice)}
                    </p>
                    {propostasPendentes[0].pricePerPerson && (
                      <p className="text-sm text-gray-600">
                        {formatCurrency(propostasPendentes[0].pricePerPerson)}/pessoa
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{propostasPendentes[0].professional.rating}</span>
                    <span className="text-gray-500">({propostasPendentes[0].professional.reviewCount})</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
                    onClick={() => handleAceitar(propostasPendentes[0].id)}
                    disabled={acaoLoading}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Escolher Este
                  </Button>
                </div>

                {/* Proposta comparada */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <h4 className="font-semibold">{propostaComparada.professional.user.name}</h4>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <p className="text-3xl font-bold text-amber-600">
                      {formatCurrency(propostaComparada.totalPrice)}
                    </p>
                    {propostaComparada.pricePerPerson && (
                      <p className="text-sm text-gray-600">
                        {formatCurrency(propostaComparada.pricePerPerson)}/pessoa
                      </p>
                    )}
                    <Badge className="mt-2 bg-red-100 text-red-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{calcularEconomia(propostasPendentes[0].totalPrice, propostaComparada.totalPrice)}% mais caro
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{propostaComparada.professional.rating}</span>
                    <span className="text-gray-500">({propostaComparada.professional.reviewCount})</span>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => abrirModal(propostaComparada)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
