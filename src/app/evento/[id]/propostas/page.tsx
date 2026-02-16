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
  FileText,
  ThumbsUp,
  ThumbsDown,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Proposta {
  id: string;
  professional: {
    id: string;
    user: {
      name: string;
    };
    rating: number;
    reviewCount: number;
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
}

export default function VerPropostasPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [propostaSelecionada, setPropostaSelecionada] = useState<Proposta | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
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
      PENDING: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
      EXPIRED: 'bg-gray-100 text-gray-700',
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

  if (!evento) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Evento não encontrado</p>
          <Link href="/dashboard/cliente">
            <Button className="mt-4">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const propostaAceita = propostas.find(p => p.status === 'ACCEPTED');
  const propostasPendentes = propostas.filter(p => p.status === 'PENDING');

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
            <div className="text-sm text-gray-500">Orçamentos</div>
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
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{evento.name}</h1>
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
                    <MapPin className="w-4 h-4" />
                    {evento.city}, {evento.state}
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(evento.status)}>
                {getStatusLabel(evento.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Proposta Aceita */}
        {propostaAceita && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">Profissional Contratado</h2>
            </div>
            
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{propostaAceita.professional.user.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <span className="font-medium">{propostaAceita.professional.rating}</span>
                        <span className="text-gray-500">({propostaAceita.professional.reviewCount} avaliações)</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-amber-600 mt-2">
                      R$ {propostaAceita.totalPrice.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lista de Propostas */}
        {!propostaAceita && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {propostasPendentes.length} orçamento{propostasPendentes.length !== 1 ? 's' : ''} recebido{propostasPendentes.length !== 1 ? 's' : ''}
            </h2>

            {propostasPendentes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Aguardando orçamentos dos profissionais...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {propostasPendentes.map((proposta) => (
                  <Card key={proposta.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900">{proposta.professional.user.name}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-medium">{proposta.professional.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-500 mb-2">
                            {proposta.professional.reviewCount} avaliações
                          </p>
                          
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{proposta.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-amber-600">
                                R$ {proposta.totalPrice.toLocaleString('pt-BR')}
                              </span>
                              {proposta.pricePerPerson && (
                                <span className="text-sm text-gray-500 ml-2">
                                  (R$ {proposta.pricePerPerson}/pessoa)
                                </span>
                              )}
                            </div>
                            
                            <Button 
                              onClick={() => abrirModal(proposta)}
                              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                            >
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Detalhes */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Proposta</DialogTitle>
          </DialogHeader>
          
          {propostaSelecionada && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <ChefHat className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{propostaSelecionada.professional.user.name}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{propostaSelecionada.professional.rating}</span>
                    <span className="text-gray-500">({propostaSelecionada.professional.reviewCount} avaliações)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{propostaSelecionada.message}</p>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-b">
                <span className="text-gray-600">Valor Total</span>
                <span className="text-3xl font-bold text-amber-600">
                  R$ {propostaSelecionada.totalPrice.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex gap-3">
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}