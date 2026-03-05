export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidade</h1>
            <p className="text-white/80 text-sm">
              Versão 1.0 • Vigência a partir de 01/04/2026 • Conformidade LGPD
            </p>
          </div>
          
          <div className="p-8">
            <div className="prose prose-indigo max-w-none">
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
                <p className="text-blue-800 text-sm m-0">
                  <strong>Sua privacidade é importante para nós.</strong> Esta política explica como coletamos, 
                  usamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
                </p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg mb-8">
                <h3 className="text-indigo-800 font-semibold mb-3">Dados do Controlador</h3>
                <dl className="text-sm text-indigo-700 space-y-2">
                  <div>
                    <dt className="font-semibold inline">Empresa: </dt>
                    <dd className="inline">ChefExperience Ltda.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">CNPJ: </dt>
                    <dd className="inline">[XX.XXX.XXX/XXXX-XX]</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">E-mail DPO: </dt>
                    <dd className="inline">dpo@chefexperience.com.br</dd>
                  </div>
                </dl>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Dados Pessoais que Coletamos</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1 Dados de Cadastro</h3>
              <p className="text-gray-600 mb-4">Coletamos os seguintes dados para criação e manutenção da sua conta:</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Dados obrigatórios:</h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>Nome completo, e-mail, telefone/WhatsApp</li>
                  <li>CPF (pessoas físicas) ou CNPJ e Razão Social (pessoas jurídicas)</li>
                  <li>Endereço completo (CEP, logradouro, número, cidade, estado)</li>
                  <li>Senha (criptografada com bcrypt)</li>
                </ul>
                
                <h4 className="font-semibold text-gray-800 mb-2 mt-4">Dados de perfil (Profissionais): </h4>
                <ul className="text-gray-600 space-y-1 text-sm">
                  <li>Descrição profissional, especialidades, fotos do portfolio</li>
                  <li>Certificações, preços e pacotes de serviços</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2 Dados de Uso</h3>
              <p className="text-gray-600 mb-4">Coletamos automaticamente quando você utiliza a Plataforma:</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Endereço IP, tipo de navegador e dispositivo</li>
                <li>Páginas acessadas e tempo de navegação</li>
                <li>Cookies e tecnologias similares</li>
                <li>Localização geográfica (quando autorizada)</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.3 Dados de Eventos</h3>
              <p className="text-gray-600 mb-4">Quando você cria ou participa de um Evento:</p>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Tipo de evento, data e local</li>
                <li>Número estimado de convidados</li>
                <li>Preferências alimentares e restrições</li>
                <li>Orçamentos e valores negociados</li>
                <li>Mensagens trocadas entre as partes</li>
              </ul>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-6">
                <p className="text-yellow-800 text-sm m-0">
                  <strong>Importante:</strong> Não armazenamos números completos de cartão de crédito. 
                  Esses dados são processados diretamente por gateways certificados (PCI DSS).
                </p>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Como Utilizamos Seus Dados</h2>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="text-left p-3 font-semibold text-gray-800 rounded-tl-lg">Finalidade</th>
                      <th className="text-left p-3 font-semibold text-gray-800">Base Legal</th>
                      <th className="text-left p-3 font-semibold text-gray-800 rounded-tr-lg">Dados Utilizados</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="p-3">Criação e gestão da conta</td>
                      <td className="p-3">Execução de contrato</td>
                      <td className="p-3">Dados de cadastro</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">Match entre clientes e profissionais</td>
                      <td className="p-3">Execução de contrato</td>
                      <td className="p-3">Perfil, localização, especialidades</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">Processamento de pagamentos</td>
                      <td className="p-3">Execução de contrato</td>
                      <td className="p-3">Dados de pagamento</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">Envio de notificações</td>
                      <td className="p-3">Execução de contrato</td>
                      <td className="p-3">E-mail, telefone</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3">Prevenção de fraudes</td>
                      <td className="p-3">Legítimo interesse</td>
                      <td className="p-3">Dados de uso, IP</td>
                    </tr>
                    <tr>
                      <td className="p-3">Análises e melhorias</td>
                      <td className="p-3">Legítimo interesse</td>
                      <td className="p-3">Dados de uso anônimos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Comunicações</h3>
              
              <p className="text-gray-600 mb-2"><strong>E-mails transacionais (obrigatórios):</strong></p>
              <ul className="text-gray-600 space-y-1 mb-4 text-sm">
                <li>Confirmação de cadastro, notificações de propostas, alertas de mensagens</li>
                <li>Confirmações de pagamento, lembretes de eventos agendados</li>
              </ul>
              
              <p className="text-gray-600 mb-2"><strong>E-mails de marketing (opcionais):</strong></p>
              <ul className="text-gray-600 space-y-1 mb-4 text-sm">
                <li>Novidades da plataforma, dicas para profissionais, promoções de planos</li>
              </ul>
              
              <p className="text-gray-600 text-sm">
                Você pode optar por não receber comunicações de marketing a qualquer momento nas configurações da conta.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Compartilhamento de Dados</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Entre Usuários</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-blue-800 text-sm mb-2">
                  Quando uma proposta é aceita, há compartilhamento necessário para execução do serviço:
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li><strong>Cliente recebe:</strong> Nome, telefone e e-mail do Profissional</li>
                  <li><strong>Profissional recebe:</strong> Nome, telefone e endereço do Evento do Cliente</li>
                </ul>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Prestadores de Serviço</h3>
              <p className="text-gray-600 mb-4">Compartilhamos dados com empresas que nos auxiliam na operação:</p>
              
              <ul className="text-gray-600 space-y-2 mb-6">
                <li><strong>Gateway de pagamento:</strong> processamento de pagamentos</li>
                <li><strong>Serviço de e-mail:</strong> envio de comunicações</li>
                <li><strong>Provedor de nuvem:</strong> hospedagem e armazenamento (dados cifrados)</li>
                <li><strong>Serviço de geocodificação:</strong> cálculo de distâncias</li>
              </ul>
              
              <p className="text-gray-600 text-sm">
                Todos os parceiros estão comprometidos com a LGPD e possuem contratos de confidencialidade.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Segurança dos Dados</h2>
              
              <p className="text-gray-600 mb-4">Implementamos as seguintes proteções:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Medidas Técnicas</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>Criptografia SSL/TLS</li>
                    <li>Criptografia em repouso</li>
                    <li>Hashing de senhas (bcrypt)</li>
                    <li>Firewall e proteção contra ataques</li>
                    <li>Monitoramento contínuo</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Medidas Organizacionais</h4>
                  <ul className="text-purple-700 text-sm space-y-1">
                    <li>Treinamento de colaboradores</li>
                    <li>Política de acesso mínimo</li>
                    <li>Acordos de confidencialidade</li>
                    <li>Planos de resposta a incidentes</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1 Retenção e Exclusão</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>Mantemos seus dados pelo tempo necessário para as finalidades descritas</li>
                <li>Dados de contas inativas são anonimizados após 2 anos</li>
                <li>Backups são mantidos por até 5 anos por obrigação legal</li>
                <li>Você pode solicitar exclusão a qualquer momento</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Seus Direitos como Titular (LGPD)</h2>
              
              <p className="text-gray-600 mb-4">De acordo com a LGPD, você tem os seguintes direitos:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">✓ Acesso</h4>
                  <p className="text-gray-600 text-sm">Solicitar confirmação da existência de tratamento e acesso aos seus dados.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">✓ Correção</h4>
                  <p className="text-gray-600 text-sm">Solicitar correção de dados incompletos, inexatos ou desatualizados.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">✓ Eliminação</h4>
                  <p className="text-gray-600 text-sm">Solicitar exclusão dos dados pessoais (sujeito a retenções legais).</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">✓ Portabilidade</h4>
                  <p className="text-gray-600 text-sm">Solicitar portabilidade dos dados para outro fornecedor.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">✓ Revogação</h4>
                  <p className="text-gray-600 text-sm">Revogar o consentimento a qualquer tempo.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">✓ Informação</h4>
                  <p className="text-gray-600 text-sm">Solicitar informações sobre compartilhamentos realizados.</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Como Exercer Seus Direitos</h3>
              
              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <p className="text-indigo-800 mb-2"><strong>Canal de Atendimento:</strong> dpo@chefexperience.com.br</p>
                
                <p className="text-indigo-700 text-sm mb-2">Envie sua solicitação com:</p>
                <ul className="text-indigo-700 text-sm space-y-1">
                  <li>Nome completo, e-mail cadastrado, CPF</li>
                  <li>Descrição detalhada do pedido</li>
                  <li>Documento de identificação (para solicitações sensíveis)</li>
                </ul>
                
                <p className="text-indigo-600 text-sm mt-3">
                  <strong>Prazo de resposta:</strong> até 15 dias (prorrogáveis em casos complexos)
                </p>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Cookies e Tecnologias Similares</h2>
              
              <p className="text-gray-600 mb-4">Utilizamos cookies para melhorar sua experiência:</p>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 font-semibold text-gray-800 rounded-tl-lg">Categoria</th>
                      <th className="text-left p-3 font-semibold text-gray-800 rounded-tr-lg">Finalidade</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Estritamente necessários</td>
                      <td className="p-3">Funcionamento básico (autenticação, segurança)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Preferências</td>
                      <td className="p-3">Lembrar suas escolhas (idioma, configurações)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 font-medium">Análise</td>
                      <td className="p-3">Entender como a plataforma é usada (Google Analytics)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Marketing</td>
                      <td className="p-3">Oferecer conteúdo relevante (remarketing, anúncios)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-gray-600 text-sm">
                Você pode gerenciar as preferências de cookies no banner apresentado no primeiro acesso 
                ou nas configurações do seu navegador.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Alterações desta Política</h2>
              
              <p className="text-gray-600 mb-6">
                Podemos atualizar esta Política periodicamente. As alterações serão publicadas nesta página 
                com data de vigência atualizada e notificadas por e-mail para alterações significativas. 
                O uso continuado da Plataforma após alterações constitui aceitação da nova versão.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Contato</h2>
              
              <p className="text-gray-600 mb-4">Para dúvidas sobre privacidade e proteção de dados:</p>
              
              <div className="bg-indigo-50 p-4 rounded-lg mb-8">
                <ul className="text-indigo-800 space-y-1">
                  <li><strong>E-mail do DPO:</strong> dpo@chefexperience.com.br</li>
                  <li><strong>E-mail geral:</strong> privacidade@chefexperience.com.br</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 text-center">
                  Documento elaborado em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
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