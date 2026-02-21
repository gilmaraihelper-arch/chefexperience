'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ChefHat, 
  Calendar, 
  DollarSign, 
  Star, 
  Search,
  Users,
  Clock,
  MessageSquare,
  ArrowUpRight,
  Briefcase,
  FileText,
  Upload,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Send,
  Settings,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function DashboardProfissionalPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [eventosAPI, setEventosAPI] = useState<any[]>([]);
  const [pacotesAPI, setPacotesAPI] = useState<any[]>([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  
  // Todos os useState juntos, antes dos useEffects
  const [abaAtiva, setAbaAtiva] = useState('disponiveis');
  const [showOrcamentoModal, setShowOrcamentoModal] = useState(false);
  const [showPacoteModal, setShowPacoteModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<any>(null);
  const [orcamentoData, setOrcamentoData] = useState({
    valor: '',
    mensagem: '',
    usarPacote: false,
    pacoteSelecionado: '',
    anexarArquivo: false,
  });
  const [pacoteForm, setPacoteForm] = useState({
    nome: '',
    descricao: '',
    precoBase: '',
    minPeople: '10',
    maxPeople: '100',
    includes: [] as string[],
  });
  const [creatingPackage, setCreatingPackage] = useState(false);

  // useEffects vêm depois de todos os useState
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
        router.replace('/dashboard/profissional');
      }
    }
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      if (status !== 'authenticated') return;
      try {
        let token = localStorage.getItem('token');
        
        // Se tem token no localStorage, verificar se é válido usando ele mesmo
        if (token) {
          try {
            // Usar o token existente para obter dados do usuário
            const tokenRes = await fetch('/api/auth/token', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (tokenRes.ok) {
              const tokenData = await tokenRes.json();
              // Token válido, usar ele
              console.log('Token válido do localStorage');
            } else {
              // Token expirado ou inválido, limpar
              console.log('Token inválido, limpando...');
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
        
        if (!token) return;
        
        const eventsRes = await fetch('/api/events?type=available', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const eventsData = await eventsRes.json();
        if (eventsData.events) setEventosAPI(eventsData.events);
        
        const packagesRes = await fetch('/api/packages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const packagesData = await packagesRes.json();
        if (packagesData.packages) setPacotesAPI(packagesData.packages);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoadingEventos(false);
      }
    }
    fetchData();
  }, [status]);

  useEffect(() => {
    // Verificar auth via localStorage primeiro (nossa API)
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Se tem token no localStorage, não precisa de sessão NextAuth
    if (token && userStr) {
      // Usuário logado via nossa API
      setLoadingEventos(false);
      return;
    }
    
    // Caso contrário, verificar sessão NextAuth
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Obter dados do usuário - só executar no cliente
  const [userData, setUserData] = useState<any>({});
  
  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);
  
  const userName = (session?.user?.name || userData.name || 'Chef');
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  // Define missing variables that were in hardcoded data
  const faixaPrecoLabels: Record<string, string> = {
    'popular': 'Popular',
    'medio': 'Médio',
    'premium': 'Premium',
    'luxo': 'Luxo'
  };
  const orcamentosEnviados: any[] = [];
  const eventosContratados: any[] = [];
  const eventosCalendario: any[] = [];

  // Track auth state from localStorage
  const [hasToken, setHasToken] = useState(false);
  
  useEffect(() => {
    setHasToken(!!localStorage.getItem('token'));
  }, []);

  // Verificar se tem algum tipo de autenticação
  const isAuthenticated = status === 'authenticated' || hasToken;
  const hasAuth = status === 'authenticated' || hasToken;

  if (status === 'loading' && !hasToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Permite acesso se tem token no localStorage OU sessão NextAuth
  if (!session && !hasToken) {
    return null;
  }

  const handleEnviarOrcamento = (evento: any) => {
    setEventoSelecionado(evento);
    setShowOrcamentoModal(true);
  };

  const handleCriarPacote = async () => {
    let token = localStorage.getItem('token');
    
    // Se não tem token, buscar da API
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
      alert('Você precisa estar logado');
      return;
    }
    
    console.log('Criando pacote com dados:', pacoteForm);
    setCreatingPackage(true);
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: pacoteForm.nome,
          description: pacoteForm.descricao,
          basePrice: pacoteForm.precoBase,
          minPeople: pacoteForm.minPeople,
          maxPeople: pacoteForm.maxPeople,
          includes: pacoteForm.includes,
        })
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      if (data.success) {
        // Recarregar pacotes
        const packagesRes = await fetch('/api/packages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const packagesData = await packagesRes.json();
        if (packagesData.packages) setPacotesAPI(packagesData.packages);
        
        setShowPacoteModal(false);
        setPacoteForm({ nome: '', descricao: '', precoBase: '', minPeople: '10', maxPeople: '100', includes: [] });
      } else {
        alert(data.error || 'Erro ao criar pacote');
      }
    } catch (err) {
      console.error('Erro ao criar pacote:', err);
      alert('Erro ao criar pacote');
    } finally {
      setCreatingPackage(false);
    }
  };

  const handleSubmitOrcamento = async () => {
    if (!eventoSelecionado) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para enviar propostas');
      return;
    }

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: eventoSelecionado.id,
          totalPrice: parseFloat(orcamentoData.valor),
          message: orcamentoData.mensagem,
        })
      });

      if (response.ok) {
        alert('Orçamento enviado com sucesso!');
        setOrcamentoData({
          valor: '',
          mensagem: '',
          usarPacote: false,
          pacoteSelecionado: '',
          anexarArquivo: false,
        });
        setShowOrcamentoModal(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao enviar proposta');
      }
    } catch (err) {
      console.error('Erro ao enviar proposta:', err);
      alert('Erro ao enviar proposta');
    }
  };

  const handleNavigateHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={handleNavigateHome} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <Briefcase className="w-4 h-4" />
                <span>Plano Profissional</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                {userInitials}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Olá, {userName}! 👨‍🍳</h1>
          <p className="text-gray-600">Aqui está o resumo da sua atividade</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Ganhos (Mês)</p>
                  <p className="text-2xl font-bold">R$ 12.450</p>
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
                  <p className="text-2xl font-bold text-gray-900">8</p>
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
                  <p className="text-2xl font-bold text-gray-900">3</p>
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
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="disponiveis">Disponíveis (3)</TabsTrigger>
            <TabsTrigger value="enviados">Orçamentos Enviados</TabsTrigger>
            <TabsTrigger value="contratados">Contratados</TabsTrigger>
            <TabsTrigger value="pacotes">Meus Pacotes</TabsTrigger>
            <TabsTrigger value="calendario">Calendário</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="disponiveis" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Eventos Disponíveis para Orçamento</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar eventos..." className="pl-9 w-64" />
              </div>
            </div>
            
            <div className="space-y-4">
              {loadingEventos ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                eventosAPI.map((evento: any) => (
                <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{evento.name || evento.evento}</h3>
                          <Badge className="bg-green-100 text-green-700">{evento.match}% Match</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{evento.client?.user?.name || evento.cliente}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {(evento.date || evento.data) ? new Date(evento.date || evento.data).toLocaleDateString('pt-BR') : 'Data não informada'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {evento.guestCount || evento.pessoas} pessoas
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {evento.city ? `${evento.city}, ${evento.state}` : (evento.local ? `${evento.local} • ${evento.distancia || '0km'}` : 'Local não informado')}
                          </span>
                          <Badge variant="secondary">{evento.priceRange || faixaPrecoLabels[evento.faixaPreco]}</Badge>
                          {(evento.hasKitchen || evento.possuiCozinha) && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              Com Cozinha
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(evento.cuisineStyles ? JSON.parse(evento.cuisineStyles || '[]') : evento.estilosCulinaria || []).map((estilo: string) => (
                            <span key={estilo} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              {estilo}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Orçamento máx.</p>
                          <p className="text-xl font-bold text-amber-600">
                            R$ {(evento.maxBudget || 0).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-amber-500 to-orange-600"
                          onClick={() => handleEnviarOrcamento(evento)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Orçamento
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="enviados" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Meus Orçamentos Enviados</h2>
            <div className="space-y-4">
              {orcamentosEnviados.map((orc) => (
                <Card key={orc.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{orc.evento}</h3>
                          {orc.temArquivo && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              <FileText className="w-3 h-3 mr-1" />
                              Com Anexo
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{orc.cliente}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Evento: {new Date(orc.dataEvento).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Enviado: {new Date(orc.dataEnvio).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {orc.mensagem && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <span className="font-medium">Mensagem:</span> {orc.mensagem}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          R$ {(orc.valor || 0).toLocaleString('pt-BR')}
                        </p>
                        <Badge className={
                          orc.status === 'aceito' ? 'bg-green-100 text-green-700' :
                          orc.status === 'recusado' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {orc.status === 'pendente' ? 'Aguardando' :
                           orc.status === 'aceito' ? 'Aceito' : 'Recusado'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contratados" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Eventos Contratados</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {eventosContratados.map((evento) => (
                <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{evento.evento}</h3>
                        <p className="text-sm text-gray-500">{evento.cliente}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Confirmado</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {evento.pessoas} pessoas
                      </span>
                    </div>
                    <div className="pt-4 border-t flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-600">
                        R$ {(evento.valor || 0).toLocaleString('pt-BR')}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pacotes" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Meus Pacotes Pré-definidos</h2>
                <p className="text-sm text-gray-500">Crie pacotes para agilizar seus orçamentos</p>
              </div>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-600"
                onClick={() => setShowPacoteModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Pacote
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pacotesAPI.map((pacote: any) => (
                <Card key={pacote.id} className={`hover:shadow-lg transition-shadow ${!pacote.isActive && pacote.ativo !== undefined && !pacote.ativo ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{pacote.name || pacote.nome}</h3>
                        <Badge className={pacote.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                          {pacote.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{pacote.description || pacote.descricao}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-amber-600">
                        R$ {((pacote.basePrice || pacote.precoBase) || 0)?.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-sm text-gray-500">/pessoa</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      <Users className="w-4 h-4 inline mr-1" />
                      {pacote.minPeople || pacote.pessoasMin} - {pacote.maxPeople || pacote.pessoasMax} pessoas
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Inclui:</p>
                      <div className="flex flex-wrap gap-1">
                        {(pacote.includes || pacote.inclui || []).map((item: any) => (
                          <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Dica: Pacotes populares</h4>
                    <p className="text-sm text-gray-600">
                      Profissionais com pacotes pré-definidos recebem 40% mais orçamentos aprovados!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendario" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Calendário Inteligente</h2>
                <p className="text-sm text-gray-500">Visualize seus eventos e disponibilidade</p>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configurar Disponibilidade
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
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
                        const evento = eventosCalendario.find(e => {
                          const data = new Date(e.data);
                          return data.getDate() === dia && data.getMonth() === 1;
                        });
                        
                        return (
                          <div
                            key={dia}
                            className={`aspect-square border rounded-lg p-1 text-sm ${
                              evento 
                                ? evento.status === 'confirmado' 
                                  ? 'bg-green-100 border-green-300' 
                                  : evento.status === 'orcamento'
                                  ? 'bg-amber-100 border-amber-300'
                                  : 'bg-blue-100 border-blue-300'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium">{dia}</div>
                            {evento && (
                              <div className="text-xs mt-1 truncate">
                                {evento.status === 'confirmado' && <CheckCircle2 className="w-3 h-3 inline text-green-600" />}
                                {evento.status === 'orcamento' && <Clock className="w-3 h-3 inline text-amber-600" />}
                                {evento.status === 'disponivel' && <Eye className="w-3 h-3 inline text-blue-600" />}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Próximos Eventos</h4>
                    <div className="space-y-3">
                      {eventosCalendario.slice(0, 5).map((evento, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                          <div className={`w-2 h-2 rounded-full ${
                            evento.status === 'confirmado' ? 'bg-green-500' :
                            evento.status === 'orcamento' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{evento.evento}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(evento.data).toLocaleDateString('pt-BR')} • {evento.pessoas} pessoas
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4">
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
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span>Disponível para Orçar</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Resumo Financeiro</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                <CardContent className="p-4">
                  <p className="text-white/80 text-sm">Saldo Disponível</p>
                  <p className="text-2xl font-bold">R$ 8.250</p>
                  <p className="text-sm text-white/70 mt-2">Transações fora do sistema</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-500 text-sm">A Receber</p>
                  <p className="text-2xl font-bold text-amber-600">R$ 15.000</p>
                  <p className="text-xs text-gray-400 mt-1">Após conclusão dos eventos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-gray-500 text-sm">Total do Mês</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 23.250</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+15% vs janeiro</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Histórico de Pagamentos</h3>
                  <div className="space-y-3">
                    {[
                      { evento: 'Casamento Silva', data: '28/01/2026', valor: 12500, status: 'recebido' },
                      { evento: 'Aniversário Pedro', data: '25/01/2026', valor: 4500, status: 'recebido' },
                      { evento: 'Confraternização XYZ', data: '20/01/2026', valor: 8000, status: 'recebido' },
                    ].map((pag, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{pag.evento}</p>
                          <p className="text-sm text-gray-500">{pag.data}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">R$ {(pag.valor || 0).toLocaleString('pt-BR')}</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">{pag.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Próximos Recebimentos</h3>
                  <div className="space-y-3">
                    {[
                      { evento: 'Casamento Juliana e Marcos', data: '14/02/2026', valor: 15000, status: 'confirmado' },
                      { evento: 'Aniversário Roberto Almeida', data: '05/03/2026', valor: 7200, status: 'confirmado' },
                      { evento: 'Formatura Medicina', data: '20/03/2026', valor: 12000, status: 'pendente' },
                    ].map((pag, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{pag.evento}</p>
                          <p className="text-sm text-gray-500">{pag.data}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">R$ {(pag.valor || 0).toLocaleString('pt-BR')}</p>
                          <Badge variant="secondary" className={
                            pag.status === 'confirmado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }>
                            {pag.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Envio de Orçamento */}
      <Dialog open={showOrcamentoModal} onOpenChange={setShowOrcamentoModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enviar Orçamento</DialogTitle>
          </DialogHeader>
          
          {eventoSelecionado && (
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900">{eventoSelecionado.name || eventoSelecionado.evento}</h4>
                <p className="text-sm text-gray-600">{eventoSelecionado.client?.user?.name || eventoSelecionado.cliente}</p>
                <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
                  <span>📅 {(eventoSelecionado.date || eventoSelecionado.data) ? new Date(eventoSelecionado.date || eventoSelecionado.data).toLocaleDateString('pt-BR') : 'Data não informada'}</span>
                  <span>👥 {eventoSelecionado.guestCount || eventoSelecionado.pessoas || 0} pessoas</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Checkbox 
                    checked={orcamentoData.usarPacote}
                    onCheckedChange={(checked) => setOrcamentoData({...orcamentoData, usarPacote: checked as boolean})}
                  />
                  <span>Usar pacote pré-definido</span>
                </Label>
              </div>

              {orcamentoData.usarPacote && (
                <div>
                  <Label>Selecione o pacote</Label>
                  <div className="grid gap-2 mt-2">
                    {pacotesAPI.length === 0 ? (
                      <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                        Você ainda não tem pacotes cadastrados. Crie um pacote na aba "Meus Pacotes" primeiro.
                      </p>
                    ) : (
                      pacotesAPI.map((pacote: any) => (
                        <button
                          key={pacote.id}
                          onClick={() => setOrcamentoData({...orcamentoData, pacoteSelecionado: pacote.id.toString()})}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            orcamentoData.pacoteSelecionado === pacote.id.toString()
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{pacote.name || pacote.nome}</span>
                            <span className="text-amber-600 font-bold">
                              R$ {(pacote.basePrice || pacote.precoBase || 0).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          {pacote.description && (
                            <p className="text-xs text-gray-500 mt-1">{pacote.description}</p>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="valor">Valor do Orçamento (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  value={orcamentoData.valor}
                  onChange={(e) => setOrcamentoData({...orcamentoData, valor: e.target.value})}
                  placeholder="Ex: 15000"
                />
                {orcamentoData.usarPacote && orcamentoData.pacoteSelecionado && eventoSelecionado && (
                  <p className="text-sm text-gray-500 mt-1">
                    Valor sugerido: R$ {(
                      (pacotesAPI.find((p: any) => p.id.toString() === orcamentoData.pacoteSelecionado)?.basePrice || 
                        pacotesAPI.find((p: any) => p.id.toString() === orcamentoData.pacoteSelecionado)?.precoBase || 0)
                      * (eventoSelecionado.guestCount || eventoSelecionado.pessoas || 1)
                    ).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="mensagem">Mensagem para o Cliente</Label>
                <Textarea
                  id="mensagem"
                  value={orcamentoData.mensagem}
                  onChange={(e) => setOrcamentoData({...orcamentoData, mensagem: e.target.value})}
                  placeholder="Escreva uma mensagem personalizada, tire dúvidas ou faça perguntas sobre o evento..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Checkbox 
                    checked={orcamentoData.anexarArquivo}
                    onCheckedChange={(checked) => setOrcamentoData({...orcamentoData, anexarArquivo: checked as boolean})}
                  />
                  <span>Anexar arquivo de orçamento (PDF)</span>
                </Label>
                {orcamentoData.anexarArquivo && (
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-amber-400 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Clique para fazer upload do arquivo</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowOrcamentoModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                  onClick={handleSubmitOrcamento}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Orçamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Novo Pacote */}
      <Dialog open={showPacoteModal} onOpenChange={setShowPacoteModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Criar Novo Pacote</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nomePacote">Nome do Pacote</Label>
              <Input 
                id="nomePacote" 
                placeholder="Ex: Casamento Premium"
                value={pacoteForm.nome}
                onChange={(e) => setPacoteForm({...pacoteForm, nome: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="descricaoPacote">Descrição</Label>
              <Input 
                id="descricaoPacote" 
                placeholder="Descreva o que está incluído..."
                value={pacoteForm.descricao}
                onChange={(e) => setPacoteForm({...pacoteForm, descricao: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="precoBase">Preço (R$)</Label>
                <Input 
                  id="precoBase" 
                  type="number" 
                  placeholder="Ex: 80"
                  value={pacoteForm.precoBase}
                  onChange={(e) => setPacoteForm({...pacoteForm, precoBase: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="pessoasMin">Mín. Pessoas</Label>
                <Input 
                  id="pessoasMin" 
                  type="number" 
                  value={pacoteForm.minPeople}
                  onChange={(e) => setPacoteForm({...pacoteForm, minPeople: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="pessoasMax">Máx. Pessoas</Label>
                <Input 
                  id="pessoasMax" 
                  type="number" 
                  value={pacoteForm.maxPeople}
                  onChange={(e) => setPacoteForm({...pacoteForm, maxPeople: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>O que está incluído</Label>
              <div className="space-y-2 mt-2">
                {['Entradas', 'Prato Principal', 'Sobremesa', 'Bebidas', 'Garçom'].map((item) => (
                  <Label key={item} className="flex items-center gap-2">
                    <Checkbox 
                      checked={pacoteForm.includes.includes(item)}
                      onCheckedChange={(checked) => {
                        const newIncludes = checked 
                          ? [...pacoteForm.includes, item]
                          : pacoteForm.includes.filter((i: string) => i !== item);
                        setPacoteForm({...pacoteForm, includes: newIncludes});
                      }}
                    />
                    <span className="text-sm">{item}</span>
                  </Label>
                ))}
              </div>
            </div>
            <div>
              <Label>Anexar Arquivo (PDF)</Label>
              <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-amber-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Clique para fazer upload do cardápio ou PDF</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowPacoteModal(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-600"
                onClick={handleCriarPacote}
                disabled={creatingPackage || !pacoteForm.nome || !pacoteForm.precoBase}
              >
                {creatingPackage ? 'Criando...' : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Pacote
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
