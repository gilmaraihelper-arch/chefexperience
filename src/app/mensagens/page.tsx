'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Send, ChevronLeft, MoreVertical, Phone, Image as ImageIcon, Smile, Check, CheckCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SiteFooter } from '@/components/layout/Footer';

// Mock data
const conversasMock = [
  {
    id: 1,
    profissional: {
      nome: 'Chef Ricardo Mendes',
      avatar: null,
      iniciais: 'RM',
      online: true,
    },
    ultimaMensagem: 'Perfeito! Vou preparar o menu degustação então.',
    hora: '10:30',
    naoLidas: 2,
    status: 'active',
    evento: 'Casamento Ana & Pedro',
  },
  {
    id: 2,
    profissional: {
      nome: 'Buffê Gourmet Silva',
      avatar: null,
      iniciais: 'BS',
      online: false,
    },
    ultimaMensagem: 'O orçamento ficou em R$ 22.000 para 150 pessoas.',
    hora: 'Ontem',
    naoLidas: 0,
    status: 'pending',
    evento: 'Casamento Ana & Pedro',
  },
  {
    id: 3,
    profissional: {
      nome: 'Chef Juliana Costa',
      avatar: null,
      iniciais: 'JC',
      online: true,
    },
    ultimaMensagem: 'Posso fazer uma degustação na próxima semana?',
    hora: 'Ontem',
    naoLidas: 1,
    status: 'active',
    evento: 'Aniversário 40 anos',
  },
  {
    id: 4,
    profissional: {
      nome: 'Churrasqueiro Marcos',
      avatar: null,
      iniciais: 'CM',
      online: false,
    },
    ultimaMensagem: 'Confirmado para o sábado!',
    hora: 'Seg',
    naoLidas: 0,
    status: 'completed',
    evento: 'Churrasco Empresa',
  },
];

const mensagensMock = [
  {
    id: 1,
    remetente: 'them',
    texto: 'Olá! Vi seu evento de casamento. Posso oferecer um menu degustação incrível.',
    hora: '10:15',
    status: 'read',
  },
  {
    id: 2,
    remetente: 'me',
    texto: 'Oi Ricardo! Que bom que entrou em contato. Quantos pratos teria o menu?',
    hora: '10:20',
    status: 'read',
  },
  {
    id: 3,
    remetente: 'them',
    texto: 'Seria um menu de 7 pratos, com harmonização de vinhos. Posso adaptar para o paladar brasileiro também.',
    hora: '10:25',
    status: 'read',
  },
  {
    id: 4,
    remetente: 'me',
    texto: 'Adoro a ideia! E qual seria o investimento por pessoa?',
    hora: '10:28',
    status: 'read',
  },
  {
    id: 5,
    remetente: 'them',
    texto: 'Perfeito! Vou preparar o menu degustação então.',
    hora: '10:30',
    status: 'delivered',
  },
];

export default function MensagensPage() {
  const router = useRouter();
  const [conversaAtiva, setConversaAtiva] = useState(conversasMock[0]);
  const [mensagens, setMensagens] = useState(mensagensMock);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [busca, setBusca] = useState('');
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const conversasFiltradas = conversasMock.filter((c) =>
    c.profissional.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.evento.toLowerCase().includes(busca.toLowerCase())
  );

  const handleEnviar = () => {
    if (!novaMensagem.trim()) return;

    const msg = {
      id: mensagens.length + 1,
      remetente: 'me' as const,
      texto: novaMensagem,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' as const,
    };

    setMensagens([...mensagens, msg]);
    setNovaMensagem('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">Em Andamento</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">Pendente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 text-xs">Concluído</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
              <p className="text-sm text-gray-600">Central de comunicação com profissionais</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
                {conversasMock.reduce((acc, c) => acc + c.naoLidas, 0)} não lidas
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl border border-amber-100 shadow-lg shadow-amber-900/5 overflow-hidden">
          <div className="flex h-[calc(100vh-220px)] min-h-[500px]">
            {/* Sidebar - Lista de Conversas */}
            <div className={`w-full lg:w-80 border-r border-amber-100 flex flex-col ${mobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
              {/* Busca */}
              <div className="p-4 border-b border-amber-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar conversas..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Lista */}
              <div className="flex-1 overflow-y-auto">
                {conversasFiltradas.map((conversa) => (
                  <button
                    key={conversa.id}
                    onClick={() => {
                      setConversaAtiva(conversa);
                      setMobileChatOpen(true);
                    }}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-amber-50/50 transition-colors border-b border-amber-50 ${
                      conversaAtiva.id === conversa.id ? 'bg-amber-50' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {conversa.profissional.iniciais}
                      </div>
                      {conversa.profissional.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm truncate">
                          {conversa.profissional.nome}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">{conversa.hora}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{conversa.evento}</div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{conversa.ultimaMensagem}</p>
                        {conversa.naoLidas > 0 && (
                          <span className="ml-2 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                            {conversa.naoLidas}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${mobileChatOpen ? 'flex' : 'hidden lg:flex'}`}>
              {/* Chat Header */}
              <div className="p-4 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileChatOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {conversaAtiva.profissional.iniciais}
                    </div>
                    {conversaAtiva.profissional.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{conversaAtiva.profissional.nome}</div>
                    <div className="text-xs text-gray-500">
                      {conversaAtiva.profissional.online ? 'Online' : 'Offline'} • {conversaAtiva.evento}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(conversaAtiva.status)}
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.remetente === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.remetente === 'me'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.texto}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        msg.remetente === 'me' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        <span className="text-xs">{msg.hora}</span>
                        {msg.remetente === 'me' && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-amber-100">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleEnviar}
                    disabled={!novaMensagem.trim()}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
