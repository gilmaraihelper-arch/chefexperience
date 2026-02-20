'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  Users, 
  Star, 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  Utensils,
  Award,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SiteFooter } from '@/components/layout/Footer';

export default function HomePage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-amber-900/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Chef Experience
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('como-funciona')} className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                Como Funciona
              </button>
              <button onClick={() => scrollToSection('para-clientes')} className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                Para Clientes
              </button>
              <button onClick={() => scrollToSection('para-profissionais')} className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                Para Profissionais
              </button>
              <Link href="/planos" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                Planos e Preços
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/completar-cadastro/escolher-tipo">
                <Button 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  Cadastrar
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-amber-100">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => { scrollToSection('como-funciona'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600 hover:text-amber-600">
                Como Funciona
              </button>
              <button onClick={() => { scrollToSection('para-clientes'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600 hover:text-amber-600">
                Para Clientes
              </button>
              <button onClick={() => { scrollToSection('para-profissionais'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600 hover:text-amber-600">
                Para Profissionais
              </button>
              <div className="pt-3 border-t border-amber-100 space-y-2">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full border-amber-200 text-amber-600"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/completar-cadastro/escolher-tipo">
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-200/20 to-amber-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 border border-amber-200">
                <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                <span className="text-sm font-medium text-amber-800">Mais de 10.000 eventos realizados</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Conectando{' '}
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">talentos da gastronomia</span>{' '}
                aos seus eventos especiais
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Do casamento dos sonhos ao jantar íntimo, encontre os melhores profissionais 
                de gastronomia ou amplie sua carteira de clientes como chef, bufê ou empresa de eventos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/completar-cadastro/escolher-tipo">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/25 text-base px-8"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Quero Contratar
                  </Button>
                </Link>
                <Link href="/completar-cadastro/escolher-tipo">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-600 text-base px-8 transition-all duration-200"
                  >
                    <ChefHat className="w-5 h-5 mr-2" />
                    Sou Profissional
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-amber-600">2.500+</div>
                  <div className="text-sm text-gray-500">Profissionais</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">15.000+</div>
                  <div className="text-sm text-gray-500">Clientes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">4.9</div>
                  <div className="text-sm text-gray-500">Avaliação Média</div>
                </div>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="overflow-hidden rounded-2xl shadow-2xl shadow-amber-900/10 ">
                    <img src="/evento-casamento.jpg" alt="Casamento" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-2xl shadow-amber-900/10 ">
                    <img src="/buffet-evento.jpg" alt="Buffet" className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-2xl shadow-2xl shadow-amber-900/10 ">
                    <img src="/chef-profissional.jpg" alt="Chef" className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-2xl shadow-amber-900/10 ">
                    <img src="/equipe-cozinha.jpg" alt="Equipe" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl shadow-amber-900/10 z-20">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">+50 chefs</div>
                    <div className="text-xs text-gray-500">disponíveis agora</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
              Como Funciona
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simples, rápido e seguro
            </h2>
            <p className="text-lg text-gray-600">
              Conectamos quem precisa de serviços gastronômicos com os melhores profissionais em poucos passos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Calendar, step: '01', title: 'Publique seu Evento', description: 'Descreva seu evento, número de convidados, tipo de festa e suas preferências gastronômicas.', color: 'from-amber-400 to-amber-500' },
              { icon: MessageSquare, step: '02', title: 'Receba Orçamentos', description: 'Profissionais qualificados enviam propostas personalizadas com detalhes do serviço.', color: 'from-orange-400 to-orange-500' },
              { icon: Star, step: '03', title: 'Avalie e Escolha', description: 'Compare propostas, verifique avaliações e escolha o profissional ideal para você.', color: 'from-amber-500 to-orange-500' },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-3xl p-8 shadow-lg shadow-amber-900/5 border border-amber-100 hover:shadow-xl transition-shadow h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-amber-100 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Clients Section */}
      <section id="para-clientes" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
                Para Clientes
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Encontre o profissional perfeito para seu evento
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Seja um casamento de 200 pessoas ou um jantar romântico, temos o chef ou empresa ideal para tornar seu momento especial.
              </p>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle2, text: 'Orçamentos gratuitos e sem compromisso' },
                  { icon: CheckCircle2, text: 'Profissionais verificados e avaliados' },
                  { icon: CheckCircle2, text: 'Negocie diretamente com o profissional' },
                  { icon: CheckCircle2, text: 'Sistema de avaliação mútua transparente' },
                  { icon: CheckCircle2, text: 'Pagamento seguro e parcelado' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link href="/criar-evento">
                <Button 
                  size="lg" 
                  className="mt-8 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/25"
                >
                  Publicar Meu Evento
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <Card className="overflow-hidden border-0 shadow-2xl shadow-amber-900/10">
                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Casamento Ana & Pedro</h4>
                      <p className="text-sm text-gray-500">150 convidados • Buffet completo</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <ChefHat className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">Chef Ricardo Mendes</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-medium">4.9</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Especialista em eventos de luxo...</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-amber-600">R$ 18.500</span>
                            <Button size="sm" variant="outline" className="border-amber-200 text-amber-600">Ver Proposta</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">Buffê Gourmet Silva</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-sm font-medium">4.8</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">15 anos de experiência...</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-amber-600">R$ 22.000</span>
                            <Button size="sm" variant="outline" className="border-amber-200 text-amber-600">Ver Proposta</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* For Professionals Section */}
      <section id="para-profissionais" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <Card className="overflow-hidden border-0 shadow-2xl shadow-amber-900/10">
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                      <ChefHat className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Complete seu Perfil</h4>
                    <p className="text-sm text-gray-500">Destaque suas especialidades</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Especialidades', value: 'Cozinha Francesa, Italiana, Brasileira', icon: Utensils },
                      { label: 'Tipo de Atendimento', value: 'Buffê, Serviço de Mesa, Coquetel', icon: Users },
                      { label: 'Experiência', value: '12 anos em eventos de luxo', icon: Award },
                      { label: 'Certificações', value: 'Chef Executivo, Segurança Alimentar', icon: Shield },
                      { label: 'Localização', value: 'São Paulo, SP - Atendo em 100km', icon: MapPin },
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">{item.label}</div>
                          <div className="text-sm font-medium text-gray-900 truncate">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white text-center">
                    <div className="text-2xl font-bold">94% Match</div>
                    <div className="text-sm opacity-90">Seu perfil está otimizado!</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
                Para Profissionais
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Amplie sua carteira de clientes
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Cadastre-se gratuitamente e comece a receber solicitações de orçamento de clientes que buscam exatamente o que você oferece.
              </p>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle2, text: 'Cadastro gratuito e sem mensalidade' },
                  { icon: CheckCircle2, text: 'Receba apenas solicitações relevantes' },
                  { icon: CheckCircle2, text: 'Destaque suas especialidades e diferenciais' },
                  { icon: CheckCircle2, text: 'Construa reputação com avaliações' },
                  { icon: CheckCircle2, text: 'Receba pagamentos de forma segura' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/completar-cadastro/escolher-tipo">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-xl shadow-amber-500/25"
                  >
                    Cadastrar como Profissional
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
              Recursos
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Segurança', desc: 'Verificação de identidade e histórico' },
              { icon: Star, title: 'Avaliações', desc: 'Sistema de notas mútuo transparente' },
              { icon: Clock, title: 'Rapidez', desc: 'Respostas em até 24 horas' },
              { icon: MessageSquare, title: 'Chat', desc: 'Comunicação direta e integrada' },
              { icon: Award, title: 'Qualidade', desc: 'Profissionais pré-selecionados' },
              { icon: Calendar, title: 'Agenda', desc: 'Gerenciamento de compromissos' },
              { icon: MapPin, title: 'Localização', desc: 'Filtro por região de atendimento' },
              { icon: CheckCircle2, title: 'Garantia', desc: 'Satisfação garantida ou reembolso' },
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow border-amber-100">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4 group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-orange-50/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
              Depoimentos
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Ana Carolina', role: 'Noiva', image: 'AC', text: 'Encontrei o buffet perfeito para meu casamento em apenas 2 dias! O sistema de avaliações me deu muita segurança na escolha.', rating: 5 },
              { name: 'Chef Ricardo Mendes', role: 'Chef Executivo', image: 'RM', text: 'Desde que me cadastrei, tripliquei minha carteira de clientes. A plataforma é intuitiva e as solicitações são sempre relevantes.', rating: 5 },
              { name: 'Fernanda Lima', role: 'Aniversariante', image: 'FL', text: 'Organizei meus 40 anos com um chef maravilhoso que encontrou aqui. Todos os convidados elogiaram a comida!', rating: 5 },
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-xl shadow-amber-900/5">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">&ldquo;{item.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                      {item.image}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já descobriram a melhor forma de conectar gastronomia e eventos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/completar-cadastro/escolher-tipo">
              <Button 
                size="lg" 
                className="bg-white text-amber-600 hover:bg-amber-50 shadow-xl text-base px-8"
              >
                <Users className="w-5 h-5 mr-2" />
                Quero Contratar
              </Button>
            </Link>
            <Link href="/completar-cadastro/escolher-tipo">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-amber-600 text-base px-8"
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Sou Profissional
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}// Deploy trigger Fri Feb 20 19:05:35 -03 2026
// Trigger deploy after GitHub connect Fri Feb 20 20:08:04 -03 2026
