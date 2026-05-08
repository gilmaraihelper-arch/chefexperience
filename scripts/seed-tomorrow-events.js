const Database = require('better-sqlite3');
const crypto = require('crypto');
const db = new Database('dev.db');

function generateUUID() {
  return crypto.randomUUID();
}

// Criar usuário cliente
const clientEmail = 'cliente@teste.com';
const existingClient = db.prepare('SELECT * FROM User WHERE email = ?').get(clientEmail);

let clientId;
if (!existingClient) {
  clientId = generateUUID();
  db.prepare(`
    INSERT INTO User (
      id, email, password, name, type, personType, phone,
      cep, address, number, neighborhood, city, state,
      "isActive", "isVerified", "emailVerified", "createdAt", "updatedAt"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, datetime('now'), datetime('now'))
  `).run(
    clientId, 
    clientEmail, 
    '$2b$10$dummyPasswordHashForTesting',
    'Maria Silva', 
    'CLIENT', 
    'PF',
    '(41) 99999-0000',
    '80010010',
    'Rua de Teste',
    '123',
    'Batel',
    'Curitiba',
    'PR'
  );
  console.log('Cliente criado:', clientEmail);
} else {
  clientId = existingClient.id;
  console.log('Cliente já existe:', clientEmail);
}

// Criar perfil do cliente
const existingClientProfile = db.prepare('SELECT * FROM ClientProfile WHERE "userId" = ?').get(clientId);
if (!existingClientProfile) {
  const clientProfileId = generateUUID();
  db.prepare(`
    INSERT INTO ClientProfile (id, "userId", "totalEvents", "totalSpent")
    VALUES (?, ?, 0, 0)
  `).run(clientProfileId, clientId);
  console.log('Perfil cliente criado');
} else {
  console.log('Perfil cliente já existe');
}

// Buscar profissional existente
const professionalUser = db.prepare('SELECT * FROM User WHERE email = ?').get('chef@chef.com');
if (!professionalUser) {
  console.log('Profissional não encontrado');
  process.exit(1);
}

// Criar perfil do profissional se não existir
const existingProProfile = db.prepare('SELECT * FROM ProfessionalProfile WHERE "userId" = ?').get(professionalUser.id);
if (!existingProProfile) {
  const proProfileId = generateUUID();
  db.prepare(`
    INSERT INTO ProfessionalProfile (
      id, "userId", description, "eventTypes", "cuisineStyles", 
      "serviceTypes", "priceRanges", capacity, "subscriptionPlan"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PROFESSIONAL')
  `).run(
    proProfileId,
    professionalUser.id,
    'Chef experiente em culinária italiana',
    '["ANIVERSARIO", "CASAMENTO"]',
    '["ITALIANA", "BRASILEIRA"]',
    '["BUFFET"]',
    '["PREMIUM"]',
    '[50, 100]'
  );
  console.log('Perfil profissional criado:', proProfileId);
} else {
  console.log('Perfil profissional já existe:', existingProProfile.id);
}

// Buscar IDs
const clientProfile = db.prepare('SELECT * FROM ClientProfile WHERE "userId" = ?').get(clientId);
const proProfile = db.prepare('SELECT * FROM ProfessionalProfile WHERE "userId" = ?').get(professionalUser.id);

// Criar evento para AMANHÃ (2026-03-16)
const eventDate = '2026-03-16 19:00:00';
const existingEvent = db.prepare('SELECT * FROM Event WHERE date LIKE ?').get('2026-03-16%');

if (!existingEvent) {
  const eventId = generateUUID();
  db.prepare(`
    INSERT INTO Event (
      id, "clientId", name, "eventType", date, "startTime", duration, "billingType",
      "locationType", address, city, state, "hasKitchen", "guestCount", "searchRadiusKm",
      "cuisineStyles", "serviceTypes", "needsWaiter", "needsSoftDrinks", "needsAlcoholicDrinks",
      "needsDecoration", "needsSoundLight", "needsPhotographer", "needsBartender", "needsSweets",
      "needsCake", "needsPlatesCutlery", "priceRange", "maxBudget", "referenceImages", status,
      "createdAt", "updatedAt"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    eventId,
    clientProfile.id,
    'Aniversário de 40 anos',
    'ANIVERSARIO',
    eventDate,
    '19:00',
    '5',
    'PF',
    'CLIENT_ADDRESS',
    'Av. Batel, 1000 - Curitiba, PR',
    'Curitiba',
    'PR',
    1,
    80,
    50,
    '["ITALIANA"]',
    '["BUFFET"]',
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    'PREMIUM',
    15000,
    '[]',
    'OPEN'
  );
  console.log('Evento criado:', eventId);
  
  // Criar proposta aceita
  const proposalId = generateUUID();
  db.prepare(`
    INSERT INTO Proposal (id, "eventId", "professionalId", "totalPrice", status, "sentAt")
    VALUES (?, ?, ?, ?, 'ACCEPTED', datetime('now'))
  `).run(proposalId, eventId, proProfile.id, 12000);
  console.log('Proposta criada:', proposalId);
  
  // Atualizar evento com proposta contratada
  db.prepare(`UPDATE Event SET "hiredProposalId" = ? WHERE id = ?`).run(proposalId, eventId);
  console.log('Evento atualizado com proposta contratada');
} else {
  console.log('Evento já existe:', existingEvent.id);
}

console.log('\n✅ Dados de teste criados com sucesso!');
