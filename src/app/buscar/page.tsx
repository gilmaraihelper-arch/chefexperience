'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  MapPin, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfessionalFilters } from '@/components/professional-filters';
import { StarRating } from '@/components/star-rating';

interface Professional {
  id: string;
  name: string;
  city: string;
  state: string;
  image: string | null;
  rating: number;
  reviewCount: number;
  totalEvents: number;
  cuisineStyles: string[];
  eventTypes: string[];
  packages: { id: string; name: string; basePrice: number }[];
  matchScore: number;
}

function BuscarContent() {
  const searchParams = useSearchParams();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cidade: searchParams.get('cidade') || '',
    especialidade: searchParams.get('especialidade') || '',
    minRating: searchParams.get('minRating') || '',
    maxPrice: parseInt(searchParams.get('maxPrice') || '500'),
    eventType: searchParams.get('eventType') || ''
  });

  useEffect(() => {
    fetchProfessionals();
  }, [filters]);

  async function fetchProfessionals() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.cidade) params.append('cidade', filters.cidade);
      if (filters.especialidade) params.append('cuisineStyle', filters.especialidade);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.maxPrice !== 500) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.eventType) params.append('eventType', filters.eventType);

      const response = await fetch(`/api/professionals/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProfessionals(data.professionals);
      }
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      cidade: '',
      especialidade: '',
      minRating: '',
      maxPrice: 500,
      eventType: ''
    });
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Encontrar Profissionais</h1>
        <p className="text-gray-500">Busque chefs e empresas de buffet para seu evento</p>
      </div>

      <ProfessionalFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : professionals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">Nenhum profissional encontrado</p>
              <p className="text-gray-400 mt-2">Tente ajustar seus filtros</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {professionals.length} profissional{professionals.length !== 1 ? 'ais' : ''} encontrado{professionals.length !== 1 ? 's' : ''}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professionals.map((prof) => (
                <Card key={prof.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold">
                        {prof.image ? (
                          <img src={prof.image} alt={prof.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          prof.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{prof.name}</h3>
                          {prof.matchScore >= 80 && (
                            <Badge className="bg-green-100 text-green-700">
                              {prof.matchScore}% Match
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          {prof.city}, {prof.state}
                        </div>
                        
                        <StarRating 
                          rating={prof.rating} 
                          size="sm" 
                          reviewCount={prof.reviewCount} 
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {(prof.cuisineStyles || []).slice(0, 4).map((style: string) => (
                          <Badge key={style} variant="secondary" className="text-xs">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">A partir de</p>
                        <p className="text-xl font-bold text-amber-600">
                          R$ {prof.packages[0]?.basePrice?.toLocaleString('pt-BR') || '0'}
                        </p>
                      </div>
                      
                      <Link href={`/profissional/${prof.id}`}>
                        <Button className="bg-amber-500 hover:bg-amber-600">
                          Ver Perfil
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function BuscarProfissionaisPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Chef Experience
            </span>
          </Link>
          <Link href="/dashboard/cliente">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        }>
          <BuscarContent />
        </Suspense>
      </main>
    </div>
  );
}
