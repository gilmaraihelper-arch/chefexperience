export default function ExclusaoDadosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Exclusão de Dados - Chef Experience</h1>
        
        <div className="prose prose-amber max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Como solicitar a exclusão dos seus dados</h2>
          <p className="text-gray-600 mb-4">
            Você tem o direito de solicitar a exclusão completa dos seus dados pessoais do Chef Experience.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Métodos para solicitar exclusão:</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">1. Pelo aplicativo/site:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Acesse: Configurações → Privacidade → Excluir minha conta</li>
                <li>Confirme sua senha</li>
                <li>Seus dados serão excluídos em até 30 dias</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">2. Por email:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Envie para: privacidade@chefexperience.com.br</li>
                <li>Assunto: "Solicitação de exclusão de dados"</li>
                <li>Inclua: nome completo e email cadastrado</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">O que será excluído:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>✅ Dados pessoais (nome, email, telefone, endereço)</li>
            <li>✅ Histórico de eventos</li>
            <li>✅ Propostas e conversas</li>
            <li>✅ Avaliações</li>
            <li>✅ Dados de pagamento</li>
            <li>✅ Informações de login social (Google/Facebook)</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Prazo:</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Solicitação: Imediata</li>
            <li>Confirmação: Até 48 horas</li>
            <li>Exclusão completa: Até 30 dias (prazo legal)</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-amber-800 mb-2">Observações:</h4>
            <ul className="list-disc list-inside text-amber-700 text-sm">
              <li>Dados de transações financeiras podem ser mantidos por 5 anos (obrigação legal)</li>
              <li>Dados anonimizados podem ser mantidos para estatísticas</li>
              <li>Você pode solicitar confirmação de exclusão após 30 dias</li>
            </ul>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Última atualização: 18/02/2026
          </p>
        </div>
      </div>
    </div>
  );
}
