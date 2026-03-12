# Geolocalização no ChefExperience

Sistema de consulta de CEP e cálculo de distâncias para o ChefExperience.

## 📍 Funcionalidades

### 1. Auto-preenchimento de Endereço via CEP
- Consulta automática na API do ViaCEP (Brasil)
- Preenche: logradouro, bairro, cidade, estado
- Suporte a coordenadas geográficas (quando Google Maps API key configurada)

### 2. Componente Reutilizável
```tsx
import { CepInput } from '@/components/ui/cep-input';

<CepInput
  value={formData.cep}
  onChange={(cep) => setFormData({ ...formData, cep })}
  onAddressFound={(address) => {
    setFormData({
      ...formData,
      endereco: address.logradouro,
      bairro: address.bairro,
      cidade: address.cidade,
      estado: address.estado,
    });
  }}
  required
/>
```

### 3. API de Consulta
```
GET /api/cep/{cep}

Resposta:
{
  "success": true,
  "data": {
    "cep": "01001-000",
    "logradouro": "Praça da Sé",
    "complemento": "lado ímpar",
    "bairro": "Sé",
    "cidade": "São Paulo",
    "estado": "SP",
    "ibge": "3550308",
    "ddd": "11",
    "coordenadas": {
      "latitude": -23.5505,
      "longitude": -46.6333
    }
  }
}
```

### 4. Hook para Consulta
```tsx
import { useCep } from '@/hooks/useCep';

const { data, loading, error, consultarCep } = useCep();

// Consultar CEP
const endereco = await consultarCep('01001000');
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# Opcional - para geocodificação precisa
googlegooglegooglegoogle_maps_api_key=SUA_CHAVE_AQUI
```

> **Nota:** A consulta de CEP funciona sem a API do Google (usa ViaCEP gratuita). A API do Google é necessária apenas para obter coordenadas precisas.

## 📐 Cálculo de Distâncias

### Haversine (Gratuito)
```typescript
import { calcularDistanciaHaversine } from '@/lib/geolocation';

const distanciaKm = calcularDistanciaHaversine(
  lat1, lon1,  // Origem
  lat2, lon2   // Destino
);
```

### Google Maps Distance Matrix (Pago)
```typescript
import { calcularDistanciaRota } from '@/lib/geolocation';

const rota = await calcularDistanciaRota(
  { latitude: lat1, longitude: lon1 },
  { latitude: lat2, longitude: lon2 },
  apiKey
);
// Retorna: { distanciaKm: 15.2, duracaoMin: 25 }
```

## 📁 Estrutura de Arquivos

```
chefexperience/
├── src/
│   ├── lib/
│   │   └── geolocation.ts      # Serviços de geolocalização
│   ├── hooks/
│   │   └── useCep.ts           # Hook React para consulta
│   ├── components/ui/
│   │   └── cep-input.tsx       # Componente de input
│   └── app/api/cep/[cep]/
│       └── route.ts            # API Route
```

## 🗄️ Banco de Dados

O schema já inclui campos para coordenadas:

```prisma
model User {
  latitude   Float?
  longitude  Float?
  // ... outros campos
}

model Event {
  latitude   Float?
  longitude  Float?
  // ... outros campos
}

model ProfessionalProfile {
  serviceRadiusKm Int @default(50)
  // ... outros campos
}
```

## 🚀 Uso no Match

Para filtrar profissionais por distância:

```typescript
// 1. Obter coordenadas do evento
const eventoLat = event.latitude;
const eventoLon = event.longitude;

// 2. Para cada profissional, calcular distância
const profissionaisProximos = profissionais.filter(prof => {
  const distancia = calcularDistanciaHaversine(
    eventoLat, eventoLon,
    prof.user.latitude, prof.user.longitude
  );
  
  // Verifica se está dentro do raio de atendimento
  return distancia <= prof.serviceRadiusKm;
});

// 3. Ordenar por proximidade
profissionaisProximos.sort((a, b) => {
  const distA = calcularDistanciaHaversine(eventoLat, eventoLon, a.user.latitude, a.user.longitude);
  const distB = calcularDistanciaHaversine(eventoLat, eventoLon, b.user.latitude, b.user.longitude);
  return distA - distB;
});
```

## 💰 Custos

| Serviço | Custo | Limite Gratuito |
|---------|-------|-----------------|
| ViaCEP | **Gratuito** | Ilimitado |
| Google Geocoding | $5/1.000 | $200/mês |
| Google Distance Matrix | $5/1.000 | $200/mês |
| Haversine | **Gratuito** | Ilimitado |

## 📚 Recursos

- [ViaCEP Documentação](https://viacep.com.br/)
- [Google Maps Platform](https://developers.google.com/maps/documentation)
