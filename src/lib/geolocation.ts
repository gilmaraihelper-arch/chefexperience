/**
 * Serviço de geolocalização e consulta de CEP
 * ChefExperience
 */

export interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Consulta CEP na API do ViaCEP (Brasil)
 * https://viacep.com.br/
 */
export async function consultarCep(cep: string): Promise<AddressData | null> {
  // Remove caracteres não numéricos
  const cepLimpo = cep.replace(/\D/g, '');
  
  if (cepLimpo.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro ao consultar CEP');
    }

    const data = await response.json();

    if (data.erro) {
      return null; // CEP não encontrado
    }

    return data as AddressData;
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    throw error;
  }
}

/**
 * Formata CEP para exibição (00000-000)
 */
export function formatarCep(cep: string): string {
  const numeros = cep.replace(/\D/g, '');
  if (numeros.length <= 5) return numeros;
  return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
}

/**
 * Valida se o CEP está no formato correto
 */
export function validarCep(cep: string): boolean {
  const numeros = cep.replace(/\D/g, '');
  return numeros.length === 8;
}

/**
 * Calcula distância entre dois pontos usando fórmula de Haversine
 * Retorna distância em quilômetros
 */
export function calcularDistanciaHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;
  
  return Math.round(distancia * 100) / 100; // Arredonda para 2 casas decimais
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Geocodifica um endereço para coordenadas (latitude/longitude)
 * Usa a API do Google Maps (requer API key)
 */
export async function geocodificarEndereco(
  endereco: string,
  apiKey: string
): Promise<Coordinates | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.warn('Geocodificação falhou:', data.status);
      return null;
    }

    const location = data.results[0].geometry.location;
    return {
      latitude: location.lat,
      longitude: location.lng,
    };
  } catch (error) {
    console.error('Erro na geocodificação:', error);
    return null;
  }
}

/**
 * Calcula distância de rota entre dois pontos usando Google Maps Distance Matrix
 * Mais preciso que Haversine (considera ruas e trânsito)
 */
export async function calcularDistanciaRota(
  origem: Coordinates,
  destino: Coordinates,
  apiKey: string
): Promise<{ distanciaKm: number; duracaoMin: number } | null> {
  try {
    const origemStr = `${origem.latitude},${origem.longitude}`;
    const destinoStr = `${destino.latitude},${destino.longitude}`;
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origemStr}&destinations=${destinoStr}&mode=driving&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.rows || data.rows.length === 0) {
      console.warn('Distance Matrix falhou:', data.status);
      return null;
    }

    const element = data.rows[0].elements[0];
    
    if (element.status !== 'OK') {
      console.warn('Rota não encontrada:', element.status);
      return null;
    }

    return {
      distanciaKm: Math.round((element.distance.value / 1000) * 100) / 100,
      duracaoMin: Math.round(element.duration.value / 60),
    };
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    return null;
  }
}

/**
 * Busca coordenadas a partir de CEP usando geocodificação
 * Combina ViaCEP + Google Maps
 */
export async function buscarCoordenadasPorCep(
  cep: string,
  googleApiKey?: string
): Promise<Coordinates | null> {
  // Primeiro consulta o CEP
  const endereco = await consultarCep(cep);
  
  if (!endereco) return null;

  // Se não tiver Google API key, retorna null (coordenadas serão preenchidas depois)
  if (!googleApiKey) return null;

  // Monta endereço completo para geocodificação
  const enderecoCompleto = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}, Brasil`;
  
  return geocodificarEndereco(enderecoCompleto, googleApiKey);
}
