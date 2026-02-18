export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
          
          <div className="prose text-gray-600">
            <p className="mb-4">
              O ChefExperience valoriza sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Informações Coletadas</h2>
            <p className="mb-4">
              Coletamos informações como nome, e-mail, telefone e dados de perfil profissional para facilitar a conexão entre clientes e profissionais.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Uso das Informações</h2>
            <p className="mb-4">
              Usamos seus dados para: criar seu perfil, facilitar orçamentos, enviar notificações e melhorar nossos serviços.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Proteção de Dados</h2>
            <p className="mb-4">
              Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado ou divulgação.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Compartilhamento</h2>
            <p className="mb-4">
              Seus dados são compartilhados apenas com os profissionais/clientes necessários para a prestação do serviço.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Seus Direitos</h2>
            <p className="mb-4">
              Você pode acessar, corrigir ou solicitar a exclusão de seus dados a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
