/**
 * Teste da API de Cadastro Profissional
 * 
 * Execute com: npx ts-node -e "$(cat src/app/api/auth/complete-profile-professional/test.ts)"
 * Ou use o Postman/Insomnia para testar
 * 
 * Endpoint: POST /api/auth/complete-profile-professional
 */

// Exemplo de requisição completa
const exemploRequisicao = {
  // Dados básicos do usuário
  name: "João da Silva",
  personType: "PF", // ou "PJ"
  cpf: "123.456.789-00",
  cnpj: null,
  razaoSocial: null,
  nomeFantasia: null,
  
  // Contato
  phone: "(11) 99999-9999",
  whatsapp: "(11) 99999-9999",
  
  // Endereço
  cep: "01001-000",
  address: "Rua Example",
  number: "123",
  complement: "Apto 45",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  
  // Descrição
  description: "Chef profissional com 10 anos de experiência em eventos corporativos e casamentos.",
  
  // Serviços e configurações
  raioAtendimento: 50,
  faixaPreco: ["executivo", "premium"],
  tiposEvento: ["casamento", "corporativo", "aniversario"],
  especialidades: ["Brasileira", "Italiana", "Francesa"],
  capacidade: ["ate-50", "50-100"],
  
  // Serviços adicionais (booleanos)
  temGarcom: true,
  temSoftDrinks: true,
  temBebidaAlcoolica: false,
  temDecoracao: false,
  temLocacao: false,
  temSom: false,
  temFotografo: false,
  temBartender: false,
  temDoces: true,
  temBolo: true,
  temPratosTalheres: true,
  
  // Certificações e disponibilidade
  certificacoes: ["Chef Executivo pelo Le Cordon Bleu", "Especialização em Gastronomia Francesa"],
  formasPagamento: ["Pix", "Cartão de Crédito", "Cartão de Débito"],
  diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
};

// Resposta esperada em caso de sucesso
const respostaSucesso = {
  success: true,
  message: "Perfil profissional criado/atualizado com sucesso",
  user: {
    id: "uuid-do-usuario",
    email: "usuario@exemplo.com",
    name: "João da Silva",
    type: "PROFESSIONAL",
    personType: "PF"
  },
  profile: {
    id: "uuid-do-profile",
    userId: "uuid-do-usuario",
    description: "Chef profissional com 10 anos..."
  }
};

// Resposta em caso de erro
const respostaErro = {
  error: "Mensagem de erro específica"
};

console.log("============================================");
console.log("TESTE DA API - Cadastro Profissional");
console.log("============================================");
console.log("\n📦 Exemplo de requisição:");
console.log(JSON.stringify(exemploRequisicao, null, 2));
console.log("\n✅ Resposta esperada (sucesso):");
console.log(JSON.stringify(respostaSucesso, null, 2));
console.log("\n❌ Resposta esperada (erro):");
console.log(JSON.stringify(respostaErro, null, 2));
console.log("\n============================================");
console.log("Instruções de teste:");
console.log("============================================");
console.log("1. Faça login com Google na aplicação");
console.log("2. Copie o cookie de sessão");
console.log("3. Envie uma requisição POST para:");
console.log("   /api/auth/complete-profile-professional");
console.log("4. Verifique se o usuário foi atualizado no banco");
console.log("5. Verifique se o ProfessionalProfile foi criado");
