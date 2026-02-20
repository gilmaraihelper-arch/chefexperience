# ChefExperience - API Documentation

## Autenticação

Todas as APIs protegidas requerem um token JWT no header:
```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /api/auth/register
Registra um novo usuário.

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "type": "CLIENT | PROFESSIONAL",
  "personType": "PF | PJ",
  "phone": "string",
  "cpf": "string" // opcional para PF
}
```

**Resposta:**
```json
{
  "success": true,
  "user": { "id", "email", "name", "type" }
}
```

**Nota:** Envia email de boas-vindas automaticamente.

---

#### POST /api/auth/login
Login com email/senha.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Resposta:**
```json
{
  "token": "jwt_token",
  "user": { "id", "email", "name", "type" }
}
```

---

#### POST /api/auth/oauth-callback
Callback após login OAuth (Google).

Redireciona automaticamente para:
- `/dashboard/cliente` - se for cliente
- `/dashboard/profissional` - se for profissional
- `/completar-cadastro` - se não tiver perfil

---

### Eventos

#### POST /api/events
Cria um novo evento.

**Body:**
```json
{
  "name": "string",
  "eventType": "string",
  "date": "2026-03-15",
  "startTime": "string",
  "duration": "string",
  "billingType": "string",
  "locationType": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "hasKitchen": boolean,
  "guestCount": number,
  "searchRadiusKm": number,
  "cuisineStyles": ["string"],
  "serviceTypes": ["string"],
  "priceRange": "string",
  "maxBudget": number,
  "description": "string"
}
```

**Resposta:**
```json
{
  "success": true,
  "event": { ... }
}
```

**Nota:** Automaticamente notifica profissionais com match ≥ 80%.

---

#### GET /api/events
Lista eventos do cliente logado.

**Resposta:**
```json
{
  "events": [ ... ]
}
```

---

### Propostas

#### POST /api/proposals
Envia uma proposta (profissional).

**Body:**
```json
{
  "eventId": "string",
  "totalPrice": number,
  "pricePerPerson": number,
  "message": "string"
}
```

**Resposta:**
```json
{
  "success": true,
  "proposal": { ... }
}
```

**Nota:** Envia email para o cliente notificando da nova proposta.

---

#### PUT /api/proposals/[id]
Aceita ou recusa uma proposta (cliente).

**Body:**
```json
{
  "action": "accept | reject"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Proposta aceita!"
}
```

**Nota:** Se aceita, envia email para o profissional.

---

### Match

#### GET /api/matches?eventId={id}
Retorna top 5 profissionais compatíveis para um evento.

**Resposta:**
```json
{
  "eventId": "string",
  "matches": [
    {
      "id": "string",
      "name": "string",
      "rating": number,
      "specialties": ["string"],
      "score": number,
      "reasons": ["string"]
    }
  ]
}
```

**Algoritmo de Match:**
- Estilo culinário: 20 pontos
- Tipo de evento: 15 pontos
- Capacidade: 15 pontos
- Orçamento: 20 pontos
- Avaliação: 15 pontos

---

### Avaliações (Reviews)

#### POST /api/reviews
Cria uma avaliação.

**Body:**
```json
{
  "targetId": "string", // professionalId ou clientId
  "eventId": "string",
  "rating": number,
  "comment": "string",
  "type": "CLIENT_TO_PROFESSIONAL | PROFESSIONAL_TO_CLIENT"
}
```

**Resposta:**
```json
{
  "success": true,
  "review": { ... }
}
```

**Nota:** Atualiza automaticamente o rating do profissional/cliente.

---

### Upload

#### POST /api/upload
Faz upload de imagens.

**Body:** FormData com:
- `file`: Arquivo (JPEG, PNG, WebP, GIF, max 5MB)
- `type`: "profile" | "portfolio" | "events"

**Resposta:**
```json
{
  "success": true,
  "url": "/uploads/portfolio/123456.jpg",
  "filename": "123456.jpg",
  "size": number
}
```

---

## Sistema de Emails

### Templates Disponíveis

1. **welcome** - Boas-vindas no registro
2. **newEvent** - Novo evento para profissionais (match ≥ 80%)
3. **proposalReceived** - Cliente recebeu proposta
4. **proposalAccepted** - Profissional ganhou contrato
5. **eventReminder** - Lembrete 1 dia antes do evento
6. **newMessage** - Nova mensagem recebida
7. **newsletter** - Atualizações

### Configuração

Variáveis de ambiente necessárias:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<senha>
```

---

## Cron Jobs

### Event Reminders (8h da manhã)
Verifica eventos do dia seguinte e envia lembretes por email.

### Daily Docs Update (9h da manhã)
Carol (QA) atualiza documentação dos projetos.

---

## Automações

### Criação de Evento
1. Evento criado
2. Sistema calcula match com profissionais
3. Profissionais com score ≥ 80% recebem email

### Nova Proposta
1. Profissional envia proposta
2. Cliente recebe email de notificação

### Aceite de Proposta
1. Cliente aceita proposta
2. Profissional recebe email de contrato fechado
3. Outras propostas são automaticamente recusadas

### Registro
1. Usuário se registra
2. Email de boas-vindas enviado automaticamente

---

## Próximas Features

- [ ] Sistema de chat em tempo real
- [ ] Notificações push
- [ ] Dashboard analytics
- [ ] API de relatórios
- [ ] Integração com Google Calendar

---

Documentação atualizada em: 2026-02-20 00:15
