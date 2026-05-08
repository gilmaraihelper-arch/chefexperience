'use client';

import { useState } from 'react';
import { ChefHat, Users, Star, Calendar, Award, Heart, Target, TrendingUp, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/layout/Footer';

const valores = [
  {
    icon: Heart,
    titulo: 'Paixão',
    descricao: 'Amamos gastronomia e acreditamos que ela transforma momentos em memórias inesquecíveis.',
  },
  {
    icon: Target,
    titulo: 'Excelência',
    descricao: 'Conectamos apenas profissionais verificados e comprometidos com a qualidade.',
  },
  {
    icon: Users,
    titulo: 'Comunidade',
    descricao: 'Cultivamos relações de confiança entre clientes e profissionais da gastronomia.',
  },
  {
    icon: TrendingUp,
    titulo: 'Inovação',
    descricao: 'Usamos tecnologia para simplificar o processo de encontrar o profissional ideal.',
  },
];

const equipe = [
  {
    nome: 'Ana Paula Ferreira',
    cargo: 'CEO & Fundadora',
    descricao: 'Empreendedora com 15 anos de experiência em gastronomia e eventos.',
    iniciais: 'AF',
    cor: 'from-amber-400 to-orange-500',
  },
  {
    nome: 'Carlos Mendes',
    cargo: 'CTO',
    descricao: 'Especialista em tecnologia e inovação para mercado de serviços.',
    iniciais: 'CM',
    cor: 'from-orange-400 to-red-500',
  },
  {
    nome: 'Juliana Costa',
    cargo: 'Head de Operações',
    descricao: 'Responsável pela curadoria e qualidade dos profissionais da plataforma.',
    iniciais: 'JC',
    cor: 'from-amber-500 to-yellow-500',
  },
  {
    nome: 'Ricardo Oliveira',
    cargo: 'Head de Marketing',
    descricao: 'Estrategista digital focado em crescimento e experiência do usuário.',
    iniciais: 'RO',
    cor: 'from-orange-500 to-amber-600',
  },
];

const estatisticas = [
  { valor: '2.500+', label: 'Profissionais Cadastrados', icon: ChefHat },
  { valor: '15.000+', label: 'Clientes Ativos', icon: Users },
  { valor: '10.000+', label: 'Eventos Realizados', icon: Calendar },
  { valor: '4.9', label: 'Avaliação Média', icon: Star },
  { valor: '98%', label: 'Taxa de Satisfação', icon: Award },
  { valor: '50+', label: 'Cidades Atendidas', icon: MapPin },
];

const diferenciais = [
  'Profissionais verificados e avaliados',
  'Orçamentos gratuitos e sem compromisso',
  'Pagamento seguro e parcelado',
  'Suporte dedicado 24/7',
  'Satisfação garantida ou reembolso',
  'Plataforma 100% brasileira',
];

export default function SobrePage() {
  const [activeTab, setActiveTab] = useState<'missao' | 'visao' | 'valores'>('missao');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-200/20 to-amber-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
              Quem Somos
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Conectando{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                talentos
              </span>{' '}
              da gastronomia
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              A Chef Experience nasceu da crença de que todo evento especial merece uma experiência 
              gastronômica memorável. Somos a ponte entre quem busca o melhor e quem oferece excelência.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
                Nossa História
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                De uma ideia à maior plataforma de gastronomia do Brasil
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fundada em 2023, a Chef Experience surgiu quando nossa fundadora, Ana Paula Ferreira, 
                  enfrentou dificuldades para encontrar um chef de qualidade para o aniversário de seus pais.
                </p>
                <p>
                  Percebendo que milhares de pessoas passavam pelo mesmo problema, e que muitos 
                  profissionais talentosos não tinham visibilidade, criamos uma plataforma que 
                  conecta essas duas pontas de forma simples, segura e eficiente.
                </p>
                <p>
                  Em pouco mais de 2 anos, já conectamos mais de 10.000 eventos com profissionais 
                  de gastronomia, transformando momentos especiais em experiências inesquecíveis.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6">
                  <Calendar className="w-8 h-8 text-amber-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-900">2023</div>
                  <div className="text-sm text-gray-600">Ano de Fundação</div>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-6">
                  <Users className="w-8 h-8 text-orange-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-900">20+</div>
                  <div className="text-sm text-gray-600">Colaboradores</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-6">
                  <MapPin className="w-8 h-8 text-amber-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-900">São Paulo</div>
                  <div className="text-sm text-gray-600">Sede Principal</div>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-6">
                  <Award className="w-8 h-8 text-orange-600 mb-3" />
                  <div className="text-3xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Prêmios Recebidos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
              Propósito
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              O que nos move
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              {(['missao', 'visao', 'valores'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white text-amber-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'missao' && 'Missão'}
                  {tab === 'visao' && 'Visão'}
                  {tab === 'valores' && 'Valores'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'missao' && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Democratizar o acesso a serviços gastronômicos de qualidade, conectando 
                  clientes aos melhores profissionais do mercado de forma simples, segura e 
                  transparente, transformando cada evento em uma experiência memorável.
                </p>
              </div>
            )}

            {activeTab === 'visao' && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Visão</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Ser a plataforma de referência para serviços gastronômicos na América Latina, 
                  reconhecida pela excelência na curadoria de profissionais e pela transformação 
                  positiva que trazemos para a vida de clientes e profissionais da gastronomia.
                </p>
              </div>
            )}

            {activeTab === 'valores' && (
              <div className="grid sm:grid-cols-2 gap-6">
                {valores.map((valor, index) => (
                  <Card key={index} className="border-amber-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                        <valor.icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{valor.titulo}</h4>
                      <p className="text-gray-600">{valor.descricao}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
              Números
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              A plataforma em números
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {estatisticas.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.valor}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
              Equipe
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Quem faz acontecer
            </h2>
            <p className="text-gray-600">
              Um time apaixonado por gastronomia e tecnologia, trabalhando para transformar 
              cada evento em uma experiência única.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipe.map((membro, index) => (
              <Card key={index} className="border-amber-100 hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${membro.cor} flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold`}>
                    {membro.iniciais}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{membro.nome}</h4>
                  <p className="text-sm text-amber-600 font-medium mb-3">{membro.cargo}</p>
                  <p className="text-sm text-gray-600">{membro.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
                Por Que Nós
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                O que nos diferencia
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Não somos apenas uma plataforma de conexão. Somos parceiros na realização 
                do seu evento dos sonhos.
              </p>

              <div className="space-y-4">
                {diferenciais.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Junte-se a nós</h3>
                  <p className="text-white/90">
                    Seja como cliente ou profissional, faça parte da maior comunidade 
                    gastronômica do Brasil.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">2.500+</div>
                    <div className="text-sm text-white/80">Profissionais</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">15.000+</div>
                    <div className="text-sm text-white/80">Clientes</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">10.000+</div>
                    <div className="text-sm text-white/80">Eventos</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-sm text-white/80">Avaliação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
