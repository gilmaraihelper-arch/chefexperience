export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Termos de Uso</h1>
            <p className="text-white/80 text-sm">
              Versão 1.0 • Vigência a partir de 01/04/2026
            </p>
          </div>
          
          <div className="p-8">
            <div className="prose prose-orange max-w-none">
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg">
                <p className="text-amber-800 text-sm m-0">
                  <strong>Importante:</strong> Ao utilizar a ChefExperience, você concorda com estes Termos de Uso. 
                  Leia atentamente antes de prosseguir.
                </p>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Definições</h2>
              <p className="text-gray-600 mb-4">
                Para fins destes Termos de Uso, aplicam-se as seguintes definições:
              </p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li><strong>"Plataforma"</strong> ou <strong>"ChefExperience"</strong>: site e aplicativos que conectam clientes a profissionais de gastronomia.</li>
                <li><strong>"Usuário"</strong>: qualquer pessoa que acesse ou utilize a Plataforma.</li>
                <li><strong>"Cliente"</strong>: pessoa que utiliza a Plataforma para contratar serviços gastronômicos.</li>
                <li><strong>"Profissional"</strong>: pessoa que oferece serviços gastronômicos (chefs, buffets, bartenders, etc.).</li>
                <li><strong>"Evento"</strong>: encomenda específica criada pelo Cliente.</li>
                <li><strong>"Proposta"</strong>: orçamento enviado pelo Profissional em resposta a um Evento.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Objeto e Aceitação</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Objeto</h3>
              <p className="text-gray-600 mb-4">
                O presente documento estabelece os termos e condições para utilização da Plataforma ChefExperience, 
                disponível em https://chefexperience.vercel.app.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Aceitação</h3>
              <p className="text-gray-600 mb-4">
                Ao acessar ou utilizar a Plataforma, o Usuário declara ter lido, compreendido e aceito integralmente 
                estes Termos de Uso, bem como nossa <a href="/privacidade" className="text-amber-600 hover:text-amber-700 underline">Política de Privacidade</a>. 
                Se não concordar, não deve utilizar a Plataforma.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3 Alterações</h3>
              <p className="text-gray-600 mb-4">
                A ChefExperience se reserva o direito de modificar estes Termos a qualquer momento, mediante publicação 
                da versão atualizada na Plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Cadastro e Conta</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Requisitos</h3>
              <p className="text-gray-600 mb-4">Para utilizar a Plataforma, o Usuário deve:</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Ter 18 anos ou mais (ou maioridade civil aplicável)</li>
                <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Ser responsável por todas as atividades em sua conta</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Tipos de Conta</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Conta de Cliente</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>Permite criar Eventos e receber Propostas</li>
                  <li>Pode avaliar Profissionais após a contratação</li>
                  <li>Não há custo para manutenção da conta</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Conta de Profissional</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>Requer cadastro adicional com dados profissionais</li>
                  <li>Permite enviar Propostas para Eventos</li>
                  <li>Pode ter diferentes níveis de plano (Gratuito, Profissional, Premium, Empresa)</li>
                  <li>Pode ser avaliado por Clientes</li>
                </ul>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Funcionamento da Plataforma</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1 Para Clientes</h3>
              <ol className="text-gray-600 space-y-2 mb-6 list-decimal list-inside">
                <li>O Cliente cria um Evento especificando necessidades (tipo, data, número de convidados, local, etc.)</li>
                <li>O sistema apresenta Profissionais compatíveis através de algoritmo de match</li>
                <li>Profissionais interessados enviam Propostas</li>
                <li>O Cliente analisa as Propostas e perfis dos Profissionais</li>
                <li>Após aceitar uma Proposta, o Cliente recebe os dados de contato do Profissional</li>
                <li>Os detalhes finais são acertados diretamente entre as partes</li>
                <li>Após o Evento, ambos podem se avaliar mutuamente</li>
              </ol>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2 Para Profissionais</h3>
              <ol className="text-gray-600 space-y-2 mb-6 list-decimal list-inside">
                <li>O Profissional mantém seu perfil atualizado com portfolio, serviços e preços</li>
                <li>Recebe notificações de Eventos compatíveis com seu perfil</li>
                <li>Envia Propostas para Eventos de interesse</li>
                <li>Se a Proposta for aceita, recebe os dados de contato do Cliente</li>
                <li>Executa o Serviço conforme acordado</li>
                <li>Recebe avaliação do Cliente após o Evento</li>
              </ol>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Pagamentos e Planos</h2>
              
              <p className="text-gray-600 mb-4">
                Os Profissionais podem escolher entre diferentes planos de assinatura:
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-amber-100">
                      <th className="text-left p-3 font-semibold text-gray-800 rounded-tl-lg">Plano</th>
                      <th className="text-center p-3 font-semibold text-gray-800">Mensalidade</th>
                      <th className="text-left p-3 font-semibold text-gray-800 rounded-tr-lg">Principais Benefícios</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3"><strong>Gratuito</strong></td>
                      <td className="p-3 text-center">R$ 0</td>
                      <td className="p-3">5 propostas/mês, até 50 convidados</td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-amber-50">
                      <td className="p-3"><strong>Profissional</strong></td>
                      <td className="p-3 text-center font-semibold text-amber-600">R$ 49</td>
                      <td className="p-3">50 propostas/mês, até 100 convidados, destaque</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3"><strong>Premium</strong></td>
                      <td className="p-3 text-center font-semibold text-purple-600">R$ 149</td>
                      <td className="p-3">Propostas ilimitadas, até 500 convidados, atendimento VIP</td>
                    </tr>
                    <tr>
                      <td className="p-3"><strong>Empresa</strong></td>
                      <td className="p-3 text-center font-semibold text-rose-600">R$ 499</td>
                      <td className="p-3">Convidados ilimitados, múltiplos usuários, API</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Renovação e Cancelamento</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Assinaturas renovam automaticamente mensalmente</li>
                <li>Cancelamento pode ser solicitado a qualquer momento no dashboard</li>
                <li>O acesso aos benefícios do plano permanece até o final do período pago</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Relação Entre Cliente e Profissional</h2>
              
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                <h3 className="text-red-800 font-bold mb-2">6.1 Independência das Partes</h3>
                <p className="text-red-700 text-sm m-0">
                  A ChefExperience é uma plataforma de intermediação digital. <strong>NÃO somos parte das negociações ou execuções dos serviços</strong>. 
                  A relação contratual é estabelecida diretamente entre Cliente e Profissional.
                </p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.2 Responsabilidades do Profissional</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Executar os serviços com qualidade e dentro do acordado</li>
                <li>Manter alvarás, licenças e documentações necessárias em dia</li>
                <li>Cumprir normas de segurança alimentar e trabalhistas</li>
                <li>Zelar pela higiene e segurança durante a execução</li>
                <li>Responder civil e criminalmente por seus atos</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.3 Responsabilidades do Cliente</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Fornecer informações precisas sobre o Evento</li>
                <li>Cumprir o pagamento acordado diretamente com o Profissional</li>
                <li>Fornecer acesso ao local conforme combinado</li>
                <li>Comunicar-se de forma clara sobre expectativas e restrições</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Limitação de Responsabilidade</h2>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p className="text-gray-800 font-semibold mb-2">A CHEFEXPERIENCE NÃO É RESPONSÁVEL POR:</p>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>Qualidade dos serviços prestados pelos Profissionais</li>
                  <li>Descumprimento de obrigações entre Cliente e Profissional</li>
                  <li>Danos materiais ou pessoais ocorridos durante eventos</li>
                  <li>Problemas de saúde causados por alimentos</li>
                  <li>Atrasos ou cancelamentos de última hora</li>
                  <li>Disputas sobre valores ou condições acordadas</li>
                </ul>
              </div>
              
              <p className="text-gray-600 mb-4">
                Respondemos apenas por:</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Manutenção técnica da Plataforma</li>
                <li>Segurança dos dados pessoais (conforme Política de Privacidade)</li>
                <li>Processamento adequado de pagamentos de assinaturas</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Suspensão e Exclusão</h2>
              <p className="text-gray-600 mb-4">
                A ChefExperience pode suspender ou excluir contas que:</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Violar estes Termos de Uso</li>
                <li>Praticar fraudes ou tentativas de fraude</li>
                <li>Receber múltiplas reclamações fundadas</li>
                <li>Manter comportamento abusivo ou ofensivo</li>
                <li>Ter avaliações consistentemente negativas</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Resolução de Conflitos</h2>
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.1 Canais de Atendimento</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>E-mail: suporte@chefexperience.com.br</li>
                <li>Chat: disponível no horário comercial</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.2 Foro</h3>
              <p className="text-gray-600 mb-6">
                Fica eleito o foro da Comarca de Curitiba/PR para dirimir quaisquer controvérsias decorrentes destes Termos.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Contato</h2>
              <p className="text-gray-600 mb-4">
                Para dúvidas sobre estes Termos de Uso, entre em contato:</p>
              <ul className="text-gray-600 space-y-2 mb-8">
                <li>E-mail: legal@chefexperience.com.br</li>
              </ul>

              <div className="border-t border-gray-200 pt-6 mt-8">
                <p className="text-sm text-gray-500 text-center">
                  Documento elaborado em conformidade com o Marco Civil da Internet (Lei 12.965/2014) <br/>
                  e Código de Defesa do Consumidor.
                </p>
                <p className="text-xs text-gray-400 text-center mt-4">
                  © 2026 ChefExperience. Todos os direitos reservados.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}