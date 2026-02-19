import { 
  ChefHat, 
  Check, 
  Star, 
  Crown, 
  Building2, 
  Users, 
  MessageCircle, 
  Zap, 
  Phone, 
  Infinity 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SiteFooter } from '@/components/layout/Footer';

const planos = [
  {
    id: 'gratuito',
    nome: 'Gratuito',
    icone: ChefHat,
    preco: 'R$ 0',
    periodo: '/mês',
    descricao: 'Perfeito para começar',
    cor: 'border-gray-200',
    destaque: false,
    beneficios: [
      'Sem mensalidade',
      'Sem taxa por evento',
      'Até 50 convidados por evento',
      'Perfil básico visível',
      '5 propostas por mês',
      'Chat com clientes',
      'Avaliações públicas',
      'Suporte por e-mail',
    ],
    limitacoes: [
      'Sem destaque nas buscas',
    ],
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    icone: Star,
    preco: 'R$ 49',
    periodo: '/mês',
    descricao: 'Para quem quer crescer',
    cor: 'border-amber-400',
    destaque: true,
    tag: 'Mais Popular',
    beneficios: [
      'Tudo do plano Gratuito',
      'Até 50 propostas por mês',
      'Até 100 convidados por evento',
      'Destaque nas buscas',
      'Suporte prioritário',
      'Estatísticas básicas',
      'Selo Profissional Verificado',
      'Sem taxa por evento',
    ],
    limitacoes: [],
  },
  {
    id: 'premium',
    nome: 'Premium',
    icone: Crown,
    preco: 'R$ 149',
    periodo: '/mês',
    descricao: 'Máxima visibilidade',
    cor: 'border-purple-400',
    destaque: false,
    beneficios: [
      'Tudo do plano Profissional',
      'Propostas ilimitadas',
      'Até 500 convidados por evento',
      'Destaque na homepage',
      'Atendimento VIP',
      'Suporte via WhatsApp',
      'Análises avançadas',
      'Página personalizada',
      'Relatórios mensais',
    ],
    limitacoes: [],
  },
  {
    id: 'empresa',
    nome: 'Empresa',
    icone: Building2,
    preco: 'R$ 499',
    periodo: '/mês',
    descricao: 'Para grandes operações',
    cor: 'border-rose-400',
    destaque: false,
    categoria: 'Corporativo',
    beneficios: [
      'Tudo do plano Premium',
      'Categoria Corporativo',
      'Convidados ilimitados',
      'Múltiplos profissionais',
      'Painel administrativo',
      'Consultoria da plataforma',
      'API de integração',
      'Gerente de conta dedicado',
      'Treinamentos exclusivos',
    ],
    limitacoes: [],
  },
];

const comparativo = [
  { feature: 'Mensalidade', gratuito: 'R$ 0', profissional: 'R$ 49', premium: 'R$ 149', empresa: 'R$ 499' },
  { feature: 'Taxa por evento', gratuito: 'Nenhuma', profissional: 'Nenhuma', premium: 'Nenhuma', empresa: 'Nenhuma' },
  { feature: 'Propostas por mês', gratuito: '5', profissional: '50', premium: 'Ilimitado', empresa: 'Ilimitado' },
  { feature: 'Máximo de convidados', gratuito: '50', profissional: '100', premium: '500', empresa: 'Ilimitado' },
  { feature: 'Destaque nas buscas', gratuito: '—', profissional: '✓', premium: '✓✓', empresa: '✓✓✓' },
  { feature: 'Destaque na homepage', gratuito: '—', profissional: '—', premium: '✓', empresa: '✓' },
  { feature: 'Suporte', gratuito: 'E-mail', profissional: 'Prioritário', premium: 'VIP + WhatsApp', empresa: 'Dedicado' },
  { feature: 'Estatísticas', gratuito: 'Básicas', profissional: 'Avançadas', premium: 'Completas', empresa: 'Personalizadas' },
  { feature: 'Página personalizada', gratuito: '—', profissional: '—', premium: '✓', empresa: '✓' },
  { feature: 'Categoria Corporativo', gratuito: '—', profissional: '—', premium: '—', empresa: '✓' },
  { feature: 'Múltiplos usuários', gratuito: '—', profissional: '—', premium: '—', empresa: '✓' },
  { feature: 'API de integração', gratuito: '—', profissional: '—', premium: '—', empresa: '✓' },
];

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Planos e Preços</h1>
          <p className="text-lg text-white/90">
            Escolha o plano ideal para o seu negócio gastronômico
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Sem taxa por evento em todos os planos</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Infinity className="w-4 h-4" />
              <span className="text-sm">Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planos.map((plano) => (
              <Card 
                key={plano.id} 
                className={`relative border-2 ${plano.cor} ${plano.destaque ? 'shadow-xl shadow-amber-200 scale-105' : ''}`}
              >
                {plano.tag && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    {plano.tag}
                  </Badge>
                )}
                {plano.categoria && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                    {plano.categoria}
                  </Badge>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                      plano.destaque 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                        : 'bg-gray-100'
                    }`}>
                      <plano.icone className={`w-7 h-7 ${plano.destaque ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plano.nome}</h3>
                    <p className="text-sm text-gray-500 mt-1">{plano.descricao}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">{plano.preco}</span>
                      <span className="text-gray-500">{plano.periodo}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plano.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{beneficio}</span>
                      </li>
                    ))}
                    {plano.limitacoes.map((limitacao, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-5 h-5 flex-shrink-0 text-center text-gray-400">—</span>
                        <span className="text-sm text-gray-400">{limitacao}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plano.destaque 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' 
                        : 'border-amber-200 text-amber-700 hover:bg-amber-50'
                    }`}
                    variant={plano.destaque ? 'default' : 'outline'}
                  >
                    Escolher {plano.nome}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destaques dos Planos */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">O que você ganha com cada plano</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mais Convidados</h3>
              <p className="text-sm text-gray-600">
                Do plano Gratuito com 50 convidados até o Empresarial com capacidade ilimitada para grandes eventos.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Suporte Diferenciado</h3>
              <p className="text-sm text-gray-600">
                Do suporte por e-mail no Gratuito até atendimento VIP com WhatsApp no Premium.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sem Taxas Ocultas</h3>
              <p className="text-sm text-gray-600">
                Nenhum plano cobra taxa por evento. Você paga apenas a mensalidade e recebe o valor integral.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativo */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Comparativo de Funcionalidades</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-amber-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Recurso</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Gratuito</th>
                  <th className="text-center py-4 px-4 font-semibold text-amber-600">Profissional</th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-600">Premium</th>
                  <th className="text-center py-4 px-4 font-semibold text-rose-600">Empresa</th>
                </tr>
              </thead>
              <tbody>
                {comparativo.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">{item.feature}</td>
                    <td className="text-center py-4 px-4 text-gray-600">{item.gratuito}</td>
                    <td className="text-center py-4 px-4 text-amber-600 font-medium">{item.profissional}</td>
                    <td className="text-center py-4 px-4 text-purple-600 font-medium">{item.premium}</td>
                    <td className="text-center py-4 px-4 text-rose-600 font-medium">{item.empresa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Comece Gratuitamente</h2>
          <p className="text-lg text-white/90 mb-8">
            Teste a plataforma sem compromisso. Upgrade quando quiser.
          </p>
          <Button 
            size="lg"
            className="bg-white text-amber-600 hover:bg-gray-100"
          >
            Criar Conta Grátis
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
