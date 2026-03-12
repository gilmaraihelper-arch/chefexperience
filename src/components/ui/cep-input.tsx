'use client';

import { useState, useCallback } from 'react';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CepInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressFound: (address: {
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    complemento?: string;
    coordenadas?: {
      latitude: number;
      longitude: number;
    } | null;
  }) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Componente de input de CEP com auto-preenchimento
 * 
 * Uso:
 * <CepInput
 *   value={formData.cep}
 *   onChange={(cep) => setFormData({ ...formData, cep })}
 *   onAddressFound={(address) => {
 *     setFormData({
 *       ...formData,
 *       endereco: address.logradouro,
 *       bairro: address.bairro,
 *       cidade: address.cidade,
 *       estado: address.estado,
 *     });
 *   }}
 * />
 */
export function CepInput({
  value,
  onChange,
  onAddressFound,
  disabled = false,
  required = false,
}: CepInputProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState(false);

  // Formata CEP para exibição
  const formatCep = useCallback((cep: string): string => {
    const numeros = cep.replace(/\D/g, '');
    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
  }, []);

  // Valida formato do CEP
  const isValidCep = useCallback((cep: string): boolean => {
    const numeros = cep.replace(/\D/g, '');
    return numeros.length === 8;
  }, []);

  // Consulta CEP na API
  const consultarCep = useCallback(
    async (cep: string) => {
      const cepLimpo = cep.replace(/\D/g, '');

      if (!isValidCep(cepLimpo)) {
        setError('CEP deve ter 8 dígitos');
        setFound(false);
        return;
      }

      setLoading(true);
      setError(null);
      setFound(false);

      try {
        const response = await fetch(`/api/cep/${cepLimpo}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao consultar CEP');
        }

        if (result.data) {
          setFound(true);
          onAddressFound({
            logradouro: result.data.logradouro,
            bairro: result.data.bairro,
            cidade: result.data.cidade,
            estado: result.data.estado,
            complemento: result.data.complemento,
            coordenadas: result.data.coordenadas,
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao consultar CEP';
        setError(message);
        setFound(false);
      } finally {
        setLoading(false);
      }
    },
    [isValidCep, onAddressFound]
  );

  // Handler de blur do input
  const handleBlur = useCallback(() => {
    if (isValidCep(value) && !found) {
      consultarCep(value);
    }
  }, [value, isValidCep, found, consultarCep]);

  // Handler de change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const numeros = rawValue.replace(/\D/g, '');

      // Limita a 8 dígitos
      if (numeros.length <= 8) {
        onChange(numeros);
      }

      // Reseta estado quando o usuário muda o CEP
      if (found) {
        setFound(false);
      }
      if (error) {
        setError(null);
      }
    },
    [onChange, found, error]
  );

  return (
    <div className="space-y-1">
      <Label htmlFor="cep">
        CEP {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <MapPin
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            found ? 'text-green-500' : 'text-gray-400'
          }`}
        />
        <Input
          id="cep"
          type="text"
          value={formatCep(value)}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="00000-000"
          disabled={disabled || loading}
          className={`pl-10 pr-10 ${
            error ? 'border-red-500 focus-visible:ring-red-500' : ''
          } ${found ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
          maxLength={9}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading && (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          )}
          {!loading && found && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      {!error && !found && value.length === 8 && (
        <p className="text-xs text-gray-400">
          Clique fora do campo para buscar o endereço
        </p>
      )}
      {found && (
        <p className="text-xs text-green-600">
          ✓ Endereço encontrado e preenchido automaticamente
        </p>
      )}
    </div>
  );
}

export default CepInput;
