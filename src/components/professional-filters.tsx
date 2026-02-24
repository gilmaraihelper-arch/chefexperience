'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar,
  Filter,
  X
} from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

const especialidades: FilterOption[] = [
  { label: 'Brasileira', value: 'Brasileira' },
  { label: 'Italiana', value: 'Italiana' },
  { label: 'Japonesa', value: 'Japonesa' },
  { label: 'Churrasco', value: 'Churrasco' },
  { label: 'Frutos do Mar', value: 'Frutos do Mar' },
  { label: 'Vegana', value: 'Vegana' },
  { label: 'Coffee Break', value: 'Coffee Break' },
  { label: 'Doces e Sobremesas', value: 'Doces e Sobremesas' },
];

const tiposEvento: FilterOption[] = [
  { label: 'Casamento', value: 'CASAMENTO' },
  { label: 'Aniversário', value: 'ANIVERSARIO' },
  { label: 'Corporativo', value: 'CORPORATIVO' },
  { label: 'Formatura', value: 'FORMATURA' },
  { label: 'Confraternização', value: 'CONFRATERNIZACAO' },
  { label: 'Coquetel', value: 'COQUETEL' },
];

const avaliacoes: FilterOption[] = [
  { label: '4.5+ Excelente', value: '4.5' },
  { label: '4.0+ Muito bom', value: '4.0' },
  { label: '3.5+ Bom', value: '3.5' },
  { label: '3.0+ Regular', value: '3.0' },
];

interface ProfessionalFiltersProps {
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  filters: {
    cidade: string;
    especialidade: string;
    minRating: string;
    maxPrice: number;
    eventType: string;
  };
}

export function ProfessionalFilters({ 
  onFilterChange, 
  onClearFilters,
  filters 
}: ProfessionalFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({
      cidade: '',
      especialidade: '',
      minRating: '',
      maxPrice: 500,
      eventType: ''
    });
    onClearFilters();
  };

  const hasActiveFilters = 
    filters.cidade || 
    filters.especialidade || 
    filters.minRating || 
    filters.maxPrice !== 500 ||
    filters.eventType;

  const activeFilterCount = [
    filters.cidade,
    filters.especialidade,
    filters.minRating,
    filters.eventType
  ].filter(Boolean).length + (filters.maxPrice !== 500 ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Barra de busca rápida */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por cidade..."
                value={localFilters.cidade}
                onChange={(e) => {
                  setLocalFilters({ ...localFilters, cidade: e.target.value });
                  onFilterChange({ ...filters, cidade: e.target.value });
                }}
                className="pl-9"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros avançados */}
      {showFilters && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Filtros Avançados</h3>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleClear}
                  className="text-red-500"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar filtros
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Especialidade */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Especialidade Culinária
                </Label>
                <div className="flex flex-wrap gap-2">
                  {especialidades.map((esp) => (
                    <button
                      key={esp.value}
                      onClick={() => {
                        const newValue = localFilters.especialidade === esp.value ? '' : esp.value;
                        setLocalFilters({ ...localFilters, especialidade: newValue });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        localFilters.especialidade === esp.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {esp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Evento */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  Tipo de Evento
                </Label>
                <div className="flex flex-wrap gap-2">
                  {tiposEvento.map((tipo) => (
                    <button
                      key={tipo.value}
                      onClick={() => {
                        const newValue = localFilters.eventType === tipo.value ? '' : tipo.value;
                        setLocalFilters({ ...localFilters, eventType: newValue });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        localFilters.eventType === tipo.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tipo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avaliação mínima */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Avaliação Mínima
                </Label>
                <div className="flex flex-wrap gap-2">
                  {avaliacoes.map((av) => (
                    <button
                      key={av.value}
                      onClick={() => {
                        const newValue = localFilters.minRating === av.value ? '' : av.value;
                        setLocalFilters({ ...localFilters, minRating: newValue });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        localFilters.minRating === av.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {av.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faixa de preço */}
              <div>
                <Label className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  Preço Máximo: R$ {localFilters.maxPrice}
                </Label>
                <Slider
                  value={[localFilters.maxPrice]}
                  onValueChange={([value]) => setLocalFilters({ ...localFilters, maxPrice: value })}
                  max={500}
                  min={30}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>R$ 30</span>
                  <span>R$ 500</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowFilters(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleApplyFilters}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
