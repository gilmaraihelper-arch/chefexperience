'use client';

import { useState, useCallback } from 'react';

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  ibge: string;
  ddd: string;
  coordenadas: {
    latitude: number;
    longitude: number;
  } | null;
}

interface UseCepReturn {
  data: CepData | null;
  loading: boolean;
  error: string | null;
  consultarCep: (cep: string) => Promise<CepData | null>;
  limpar: () => void;
}

/**
 * Hook para consulta de CEP no ChefExperience
 * 
 * Uso:
 * const { data, loading, error, consultarCep } = useCep();
 * 
 * // No handler de blur do campo CEP:
 * const handleCepBlur = async (e) => {
 *   const cep = e.target.value;
 *   if (cep.length >= 8) {
 *     const endereco = await consultarCep(cep);
 *     if (endereco) {
 *       setValue('address', endereco.logradouro);
 *       setValue('neighborhood', endereco.bairro);
 *       setValue('city', endereco.cidade);
 *       setValue('state', endereco.estado);
 *     }
 *   }
 * };
 */
export function useCep(): UseCepReturn {
  const [data, setData] = useState<CepData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultarCep = useCallback(async (cep: string): Promise<CepData | null> => {
    // Limpa estado anterior
    setError(null);
    
    // Validação básica
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return null;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/cep/${cepLimpo}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao consultar CEP');
      }

      setData(result.data);
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const limpar = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    consultarCep,
    limpar,
  };
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
 * Valida formato do CEP
 */
export function validarCep(cep: string): boolean {
  const numeros = cep.replace(/\D/g, '');
  return numeros.length === 8;
}
