'use client';

import { useState } from 'react';
import { ChefHat, Search, ChevronDown, ChevronUp, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const faqs = [
  {
    question: "Como funciona o Chef Experience?",
    answer: "O Chef Experience é uma plataforma que conecta clientes que precisam de serviços de gastronomia para eventos com profissionais qualificados (chefs, buffets, empresas de eventos). O cliente publica seu evento, recebe orçamentos de profissionais e escolhe o melhor para sua necessidade."
  },
  {
    question: "Quanto custa usar a plataforma?",
    answer: "Para clientes, o uso é totalmente gratuito! Para profissionais, oferecemos planos a partir de R$ 49/mês com diferentes benefícios. Não cobramos taxa por evento em nenhum plano."
  },
  {
    question: "Como funciona o pagamento?",
    answer: "O pagamento é combinado diretamente entre cliente e profissional. A plataforma facilita o contato e negociação, mas não intermediamos pagamentos. Assim, vocês definem a forma de pagamento mais conveniente para ambos."
  },
  {
    question: "Quais tipos de eventos vocês atendem?",
    answer: "Atendemos diversos tipos de eventos: casamentos, aniversários, corporativos, formaturas, confraternizações, jantares, coquetéis, festas infantis, debutantes, chás de bebê, noivados e muito mais."
  },
  {
    question: "Como escolho o profissional ideal?",
    answer: "Após publicar seu evento, você receberá propostas de profissionais compatíveis. Você pode verificar avaliações, portfólio, especialidades e conversar diretamente antes de decidir."
  },
  {
    question: "Os profissionais são verificados?",
    answer: "Sim! Todos os profissionais passam por verificação de identidade. Além disso, temos um sistema de avaliações onde clientes anteriores podem deixar feedback sobre o serviço prestado."
  },
  {
    question: "Posso contratar para eventos grandes?",
    answer: "Com certeza! Temos profissionais que atendem desde eventos íntimos de 10 pessoas até grandes celebrações com centenas de convidados. Na busca, você pode filtrar por capacidade."
  },
  {
    question: "O que está incluído nas propostas?",
    answer: "Cada profissional define o que inclui em seu serviço. Alguns oferecem buffet completo, outros apenas o serviço de cozinha. É importante ler os detalhes de cada proposta e tirar dúvidas antes de contratar."
  },
  {
    question: "Como funciona o sistema de avaliações?",
    answer: "Após o evento, tanto cliente quanto profissional podem avaliar uns aos outros. As avaliações são públicas e ajudam outros usuários a tomarem decisões informadas."
  },
  {
    question: "Posso cancelar ou alterar meu evento?",
    answer: "Sim, você pode cancelar ou alterar seu evento a qualquer momento. As políticas de cancelamento específicas podem ser discutidas diretamente com o profissional contratado."
  },
  {
    question: "Vocês oferecem serviços em todo o Brasil?",
    answer: "Sim! Nossa plataforma tem profissionais em todo o Brasil. Na busca, você pode filtrar por localização e raio de atendimento."
  },
  {
    question: "Como posso entrar em contato com o suporte?",
    answer: "Você pode entrar em contato pelo email suporte@chefexperience.com.br ou através da página de contato. Nosso horário de atendimento é de segunda a sexta, das 9h às 18h."
  },
  {
    question: "Vocês oferecem pratos vegetarianos ou especiais?",
    answer: "Sim! Muitos de nossos profissionais specialize em culinária vegetariana, vegana, sem glúten, sem lactose e outras dietas especiais. Você pode filtrar por tipo de culinária ao buscar profissionais."
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
          <p className="text-lg text-white/90 mb-8">
            Encontre respostas para as principais dúvidas sobre a plataforma
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar pergunta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900 border-0 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma pergunta encontrada para "{searchTerm}"</p>
              <p className="text-gray-400 text-sm mt-2">Tente buscar com outras palavras</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => {
                const originalIndex = faqs.indexOf(faq);
                const isOpen = openIndex === originalIndex;
                
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : originalIndex)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-6">
            Não encontrou a resposta que procurava?
          </p>
          <a href="/contato">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
              Fale com nosso suporte
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">© 2026 Chef Experience. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
