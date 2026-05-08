'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Star, MapPin, Award, Calendar, MessageSquare, ArrowLeft, CheckCircle2, Heart, Share2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/layout/Footer';
import Link from 'next/link';

// Dados mockados do profissional
const profissionalMock = {
  nome: 'Chef Ricardo Mendes',
  slug: 'chef-ricardo-mendes',
  foto: null,
  iniciais: 'RM',
  especialidades: ['Cozinha Francesa', 'Italiana', 'Brasileira', 'Mediterrânea'],
  tipo: 'Chef Executivo',
  experiencia: '12 anos',
  localizacao: 'São Paulo, SP',
  raioAtendimento: '100km',
  avaliacao: 4.9,
  totalAvaliacoes: 127,
  eventosRealizados: 342,
  bio: 'Chef executivo com 12 anos de experiência em eventos de luxo. Especialista em cozinha francesa e italiana, com passagens por restaurantes Michelin no Brasil e Europa. Formado pelo Le Cordon Bleu Paris.',
  certificacoes: ['Le Cordon Bleu Paris', 'Segurança Alimentar NR-33', 'Chef Executivo CBQ'],
  portfolio: [
    { id: 1, titulo: 'Casamento Luxo - Hotel Unique', categoria: 'Casamento' },
    { id: 2, titulo: 'Jantar Corporativo - Google', categoria: 'Corporativo' },
    { id: 3, titulo: 'Aniversário 50 Anos', categoria: 'Aniversário' },
    { id: 4, titulo: 'Evento de Lançamento - Porsche', categoria: 'Corporativo' },
    { id: 5, titulo: 'Casamento na Praia - Ilhabela', categoria: 'Casamento' },
    { id: 6, titulo: 'Festa de Debutante', categoria: 'Aniversário' },
  ],
  pacotes: [
    {
      id: 1,
      nome: 'Menu Degustação',
      descricao: '7 pratos com harmonização de vinhos. Ideal para jantares íntimos e eventos exclusivos.',
      preco: 350,
      pessoas: 'até 20',
      incluso: ['Entrada', 'Prato Principal', 'Sobremesa', 'Harmonização'],
    },
    {
      id: 2,
      nome: 'Buffê Premium',
      descricao: 'Buffê completo com estação ao vivo. Perfeito para casamentos e eventos corporativos.',
      preco: 180,
      pessoas: 'a partir de 50',
      incluso: ['Entradas', 'Pratos Quentes', 'Estação ao Vivo', 'Sobremesas'],
    },
    {
      id: 3,
      nome: 'Churrasco Gourmet',
      descricao: 'Churrasco de alta qualidade com cortes especiais e acompanhamentos premium.',
      preco: 220,
      pessoas: 'a partir de 30',
      incluso: ['Carnes Nobres', 'Acompanhamentos', 'Molhos Especiais', 'Sobremesa'],
    },
  ],
  avaliacoes: [
    {
      id: 1,
      cliente: 'Ana Carolina S.',
      evento: 'Casamento',
      nota: 5,
      texto: 'O Chef Ricardo superou todas as expectativas! A comida estava impecável e o serviço foi impecável. Todos os convidados elogiaram.',
      data: '15/03/2026',
    },
    {
      id: 2,
      cliente: 'Pedro M.',
      evento: 'Jantar Corporativo',
      nota: 5,
      texto: 'Profissionalismo exemplar. Organizou um jantar para 80 pessoas com a mesma qualidade de um restaurante Michelin.',
      data: '02/03/2026',
    },
    {
      id: 3,
      cliente: 'Mariana L.',
      evento: 'Aniversário',
      nota: 4,
      texto: 'Excelente chef! A apresentação dos pratos foi linda e o sabor estava incrível. Só não dei 5 estrelas porque a sobremesa demorou um pouco.',
      data: '20/02/2026',
    },
  ],
};

export default function ProfissionalPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'avaliacoes' | 'pacotes'>('portfolio');
  const [favoritado, setFavoritado] = useState(false);

  const profissional = profissionalMock;

  const handleSolicitarOrcamento = () => {
    router.push('/criar-evento');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para busca
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <section className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profissional.foto ? (
                <img
                  src={profissional.foto}
                  alt={profissional.nome}
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl lg:text-4xl font-bold">
                    {profissional.iniciais}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
                  {profissional.tipo}
                </Badge>
                {profissional.certificacoes.map((cert, i) => (
                  <Badge key={i} variant="outline" className="border-green-200 text-green-700">
                    <Award className="w-3 h-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {profissional.nome}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-gray-900">{profissional.avaliacao}</span>
                  <span>({profissional.totalAvaliacoes} avaliações)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profissional.localizacao}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{profissional.experiencia} de experiência</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>{profissional.eventosRealizados} eventos realizados</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">
                {profissional.bio}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {profissional.especialidades.map((esp, i) => (
                  <Badge key={i} variant="outline" className="border-amber-200 text-amber-700">
                    {esp}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSolicitarOrcamento}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Solicitar Orçamento
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFavoritado(!favoritado)}
                  className={`border-amber-200 ${favoritado ? 'bg-amber-50 text-amber-700' : 'text-gray-600'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${favoritado ? 'fill-amber-500 text-amber-500' : ''}`} />
                  {favoritado ? 'Favoritado' : 'Favoritar'}
                </Button>
                <Button variant="outline" className="border-gray-200 text-gray-600">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {(['portfolio', 'avaliacoes', 'pacotes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'portfolio' && `Portfólio (${profissional.portfolio.length})`}
                {tab === 'avaliacoes' && `Avaliações (${profissional.avaliacoes.length})`}
                {tab === 'pacotes' && 'Pacotes e Preços'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profissional.portfolio.map((item) => (
                <Card key={item.id} className="border-amber-100 overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-48 flex items-center justify-center">
                    <ChefHat className="w-12 h-12 text-amber-400" />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
                      {item.categoria}
                    </Badge>
                    <h4 className="font-semibold text-gray-900">{item.titulo}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Avaliações */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-6 max-w-3xl">
              {profissional.avaliacoes.map((avaliacao) => (
                <Card key={avaliacao.id} className="border-amber-100">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                          {avaliacao.cliente.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{avaliacao.cliente}</div>
                          <div className="text-sm text-gray-500">{avaliacao.evento} • {avaliacao.data}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: avaliacao.nota }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{avaliacao.texto}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pacotes */}
          {activeTab === 'pacotes' && (
            <div className="grid md:grid-cols-3 gap-6">
              {profissional.pacotes.map((pacote) => (
                <Card key={pacote.id} className="border-amber-100 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pacote.nome}</h3>
                    <p className="text-gray-600 text-sm mb-4">{pacote.descricao}</p>

                    <div className="mb-4">
                      <div className="text-3xl font-bold text-amber-600">
                        R$ {pacote.preco}
                        <span className="text-sm font-normal text-gray-500">/pessoa</span>
                      </div>
                      <div className="text-sm text-gray-500">{pacote.pessoas} pessoas</div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {pacote.incluso.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleSolicitarOrcamento}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                      Solicitar Este Pacote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Gostou do perfil do {profissional.nome.split(' ')[1]}?
          </h2>
          <p className="text-gray-600 mb-8">
            Solicite um orçamento personalizado para o seu evento. É rápido, gratuito e sem compromisso.
          </p>
          <Button
            onClick={handleSolicitarOrcamento}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/25"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Solicitar Orçamento Agora
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
