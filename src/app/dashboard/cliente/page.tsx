'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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

export default function DashboardClientePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [abaAtiva, setAbaAtiva] = useState('eventos');
  const [eventos, setEventos] = useState<any[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  
  // Track auth state from localStorage
  const [userData, setUserData] = useState<any>({});
  const [hasToken, setHasToken] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [propostasRecebidas, setPropostasRecebidas] = useState<any[]>([]);
  const [loadingPropostas, setLoadingPropostas] = useState(false);
  const profissionaisFavoritos: any[] = [];
  
  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch (e) {}
    }
    setHasToken(!!localStorage.getItem('token'));
    setAuthChecked(true);
  }, []);

  // Salvar token da URL (vindo do OAuth) e buscar dados do usuário
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        // Buscar dados do usuário usando o token
        fetch('/api/auth/token', {
          headers: { Authorization: `Bearer ${tokenFromUrl}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
            }
          })
          .catch(console.error);
        router.replace('/dashboard/cliente');
      }
    }
  }, [router]);

  useEffect(() => {
    // Verificar auth via localStorage primeiro
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      return;
    }
    
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Buscar eventos da API
  useEffect(() => {
    async function fetchEventos() {
      // Permite se tem token localStorage OU sessão autenticada
      try {
        let token = localStorage.getItem('token');
        
        // Se tem token no localStorage, verificar se é válido
        if (token) {
          try {
            const tokenRes = await fetch('/api/auth/token', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (!tokenRes.ok) {
              localStorage.removeItem('token');
              token = null;
            }
          } catch (e) {
            console.log('Erro ao validar token:', e);
          }
        }
        
        // Se não tem token, buscar da API (para OAuth)
        if (!token) {
          try {
            const tokenRes = await fetch('/api/auth/token');
            const tokenData = await tokenRes.json();
            if (tokenData.token) {
              localStorage.setItem('token', tokenData.token);
              token = tokenData.token;
            }
          } catch (e) {
            console.log('Token não disponível');
          }
        }
        
        if (!token) {
          setLoadingEventos(false);
          return;
        }
        
        const res = await fetch('/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          console.error('Erro na API de eventos:', res.status);
          setLoadingEventos(false);
          return;
        }
        
        const data = await res.json();
        if (data.events) {
          setEventos(data.events);
        }
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      } finally {
        setLoadingEventos(false);
      }
    }
    fetchEventos();
  }, [status, hasToken]);

  // Buscar propostas recebidas
  useEffect(() => {
    async function fetchPropostas() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setLoadingPropostas(true);
        const res = await fetch('/api/proposals', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          console.error('Erro na API de propostas:', res.status);
          return;
        }
        
        const data = await res.json();
        if (data.proposals) {
          setPropostasRecebidas(data.proposals);
        }
      } catch (err) {
        console.error('Erro ao buscar propostas:', err);
      } finally {
        setLoadingPropostas(false);
      }
    }
    fetchPropostas();
  }, [status, hasToken]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Permite acesso se tem token no localStorage OU sessão NextAuth
  if (authChecked && !session && !hasToken) {
    return null;
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                {session?.user?.name ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : userData?.name ? userData.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : session?.user?.email?.[0].toUpperCase() || 'U'}
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
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {session?.user?.name || userData?.name || 'Cliente'}! 👋
          </h1>
          <p className="text-gray-600">Bem-vinda ao seu dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Meus Eventos</p>
                  <p className="text-2xl font-bold">{eventos.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {eventos.reduce((acc: number, e: any) => acc + (e.proposals?.length || 0), 0)}
                  </p>
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
            <TabsTrigger value="propostas">Propostas ({propostasRecebidas.length})</TabsTrigger>
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
            
            {loadingEventos ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : eventos.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Você ainda não criou nenhum evento</p>
                <Button 
                  onClick={() => router.push('/criar-evento')}
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {eventos.map((evento: any) => (
                <Card key={evento.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gray-100 relative">
                    <img src={evento.image || '/evento-casamento.jpg'} alt={evento.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 right-2 bg-white/90">
                      {evento.status === 'OPEN' ? 'Aguardando Propostas' : evento.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">{evento.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {evento.date ? new Date(evento.date).toLocaleDateString('pt-BR') : '-'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {evento.guestCount} pessoas
                      </span>
                    </div>
                    {evento.proposals && evento.proposals.length > 0 ? (
                      <div className="mt-4 flex items-center justify-between">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          {evento.proposals.length} propostas recebidas
                        </Badge>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-amber-500 to-orange-600"
                          onClick={() => router.push(`/evento/${evento.id}/propostas`)}
                        >
                          Ver Propostas
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          Nenhuma proposta ainda
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </TabsContent>

          <TabsContent value="propostas" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Propostas Recebidas</h2>
            {loadingPropostas ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : propostasRecebidas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma proposta recebida ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {propostasRecebidas.map((proposta) => (
                  <Card key={proposta.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                          {proposta.professional?.user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'CH'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{proposta.professional?.user?.name || 'Chef'}</h3>
                              <p className="text-sm text-gray-500">{proposta.event?.name || 'Evento'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium">4.8</span>
                                <span className="text-sm text-gray-400">(12 avaliações)</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-amber-600">
                                R$ {(proposta.totalPrice || 0).toLocaleString('pt-BR')}
                              </p>
                              <p className="text-xs text-gray-400">Enviada em {proposta.sentAt ? new Date(proposta.sentAt).toLocaleDateString('pt-BR') : '-'}</p>
                            </div>
                          </div>
                          {proposta.message && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{proposta.message}</p>
                          )}
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
            )}
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
