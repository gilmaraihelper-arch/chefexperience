const Database = require('better-sqlite3');
const db = new Database('dev.db');

// Data dinâmica: amanhã
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0]; // Formato: YYYY-MM-DD

console.log('=== Cron: Lembretes de Eventos do ChefExperience ===\n');
console.log('Data de execução:', new Date().toISOString());
console.log('Data dos eventos (amanhã):', tomorrowStr, '\n');

// Buscar eventos de amanhã
const events = db.prepare(`
  SELECT 
    e.id as event_id, 
    e.name as event_name, 
    e.date, 
    e.address,
    e.city,
    e.state,
    u_client.email as client_email, 
    u_client.name as client_name,
    u_prof.email as prof_email, 
    u_prof.name as prof_name
  FROM Event e
  JOIN ClientProfile cp ON e."clientId" = cp.id
  JOIN User u_client ON cp."userId" = u_client.id
  JOIN Proposal p ON p."eventId" = e.id AND p.status = 'ACCEPTED'
  JOIN ProfessionalProfile pp ON p."professionalId" = pp.id
  JOIN User u_prof ON pp."userId" = u_prof.id
  WHERE e.date LIKE ? AND e.status != 'CANCELLED'
`).all(tomorrowStr + '%');

console.log(`Eventos encontrados: ${events.length}\n`);

if (events.length === 0) {
  console.log('Nenhum evento encontrado para amanhã.');
  console.log('Nenhum email enviado.');
} else {
  console.log('--- Emails de Lembrete ---\n');
  
  let emailsSent = 0;
  
  for (const event of events) {
    console.log(`📧 Evento: ${event.event_name}`);
    console.log(`   Data: ${event.date}`);
    console.log(`   Local: ${event.address}, ${event.city}/${event.state}`);
    
    // Email para o cliente
    console.log(`\n   → Cliente: ${event.client_name}`);
    console.log(`     Email: ${event.client_email}`);
    console.log(`     Assunto: ⏰ Lembrete: Seu evento é amanhã!`);
    
    // Email para o profissional
    console.log(`\n   → Profissional: ${event.prof_name}`);
    console.log(`     Email: ${event.prof_email}`);
    console.log(`     Assunto: ⏰ Lembrete: Você tem um evento amanhã!`);
    
    emailsSent += 2;
    console.log('');
  }
  
  console.log(`Total de emails preparados: ${emailsSent}`);
  console.log('\n⚠️ SMTP não configurado - emails não foram enviados efetivamente.');
  console.log('Configure as variáveis SMTP no .env.local para enviar emails.');
}

console.log('\n=== Fim do Cron ===');
