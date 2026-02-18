'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChefHat, 
  ArrowLeft, 
  Calendar, 
  Users, 
  MapPin, 
  DollarSign,
  Utensils,
  Wine,
  Camera,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Speaker,
  Cake,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const tiposEvento = [
  { id: 'CASAMENTO', label: 'Casamento' },
  { id: 'ANIVERSARIO', label: 'Aniversário' },
  { id: 'CORPORATIVO', label: 'Evento Corporativo' },
  { id: 'FORMATURA', label: 'Formatura' },
  { id: 'CONFRATERNIZACAO', label: 'Confraternização' },
  { id: 'JANTAR', label: 'Jantar Íntimo' },
  { id: 'COQUETEL', label: 'Coquetel' },
  { id: 'FESTA_INFANTIL', label: 'Festa Infantil' },
  { id: 'DEBUTANTE', label: 'Debutante' },
  { id: 'BODAS', label: 'Bodas' },
  { id: 'CHA_BEBE', label: 'Chá de Bebê' },
  { id: 'NOIVADO', label: 'Noivado' },
];

const estilosCulinaria = [
  'Brasileira', 'Italiana', 'Italiano/Massas', 'Italiano/Pizza', 'Francesa',
  'Japonesa', 'Mexicana', 'Árabe', 'Mediterrânea', 'Churrasco',
  'Frutos do Mar', 'Vegetariana', 'Vegana', 'Sem Glúten', 'Sem Lactose',
  'Doces e Sobremesas', 'Padaria', 'Finger Food', 'Gastronomia Molecular',
  'Cozinha de Autor', 'Comida de Rua', 'Regional'
];

const tiposServico = [
  { id: 'BUFFET', label: 'Buffet Completo', icon: Utensils },
  { id: 'PRATO_FECHADO', label: 'Prato Fechado', icon: Utensils },
  { id: 'COQUETEL', label: 'Coquetel', icon: Wine },
  { id: 'CHURRASCO', label: 'Churrasco', icon: Utensils },
  { id: 'COFFEE_BREAK', label: 'Coffee Break', icon: Utensils },
  { id: 'BRUNCH', label: 'Brunch', icon: Utensils },
];

const faixasPreco = [
  { id: 'POPULAR', label: 'Popular', desc: 'A partir de R$ 35/pessoa', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'EXECUTIVO', label: 'Executivo', desc: 'A partir de R$ 80/pessoa', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'PREMIUM', label: 'Premium', desc: 'A partir de R$ 150/pessoa', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'LUXO', label: 'Luxo', desc: 'A partir de R$ 300/pessoa', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'ULTRA_LUXO', label: 'Ultra Luxo', desc: 'A partir de R$ 500/pessoa', color: 'bg-rose-100 text-rose-700 border-rose-200' },
];

const servicosAdicionais = [
  { id: 'needsWaiter', label: 'Garçom', icon: Briefcase },
  { id: 'needsSoftDrinks', label: 'Bebidas não alcoólicas', icon: Wine },
  { id: 'needsAlcoholicDrinks', label: 'Bebidas alcoólicas', icon: Wine },
  { id: 'needsDecoration', label: 'Decoração', icon: Sparkles },
  { id: 'needsSoundLight', label: 'Som e Luz', icon: Speaker },
  { id: 'needsPhotographer', label: 'Fotógrafo', icon: Camera },
  { id: 'needsBartender', label: 'Bartender', icon: Wine },
  { id: 'needsSweets', label: 'Doces e Sobremesas', icon: Heart },
  { id: 'needsCake', label: 'Bolo', icon: Cake },
  { id: 'needsPlatesCutlery', label: 'Pratos e Talheres', icon: Utensils },
];

export default function CriarEventoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    eventType: '',
    date: '',
    guestCount: '',
    address: '',
    city: '',
    state: '',
    priceRange: 'PREMIUM',
    description: '',
    cuisineStyles: [] as string[],
    serviceTypes: [] as string[],
    needsWaiter: false,
    needsSoftDrinks: false,
    needsAlcoholicDrinks: false,
    needsDecoration: false,
    needsSoundLight: false,
    needsPhotographer: false,
    needsBartender: false,
    needsSweets: false,
    needsCake: false,
    needsPlatesCutlery: false,
    hasKitchen: false,
    dietaryRestrictions: '',
  });

  const toggleArray = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const toggleBoolean = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !(prev[field as keyof typeof prev] as boolean)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          eventType: formData.eventType,
          date: formData.date,
          guestCount: parseInt(formData.guestCount),
          address: formData.address,
          city: formData.city,
          state: formData.state,
          locationType: 'salao',
          billingType: 'PF',
          priceRange: formData.priceRange,
          description: formData.description,
          cuisineStyles: formData.cuisineStyles,
          serviceTypes: formData.serviceTypes,
          needsWaiter: formData.needsWaiter,
          needsSoftDrinks: formData.needsSoftDrinks,
          needsAlcoholicDrinks: formData.needsAlcoholicDrinks,
          needsDecoration: formData.needsDecoration,
          needsSoundLight: formData.needsSoundLight,
          needsPhotographer: formData.needsPhotographer,
          needsBartender: formData.needsBartender,
          needsSweets: formData.needsSweets,
          needsCake: formData.needsCake,
          needsPlatesCutlery: formData.needsPlatesCutlery,
          hasKitchen: formData.hasKitchen,
          dietaryRestrictions: formData.dietaryRestrictions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar evento');
      }

      router.push('/dashboard/cliente');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => router.push('/dashboard/cliente')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </button>
            <div className="text-sm text-gray-500">Criar Evento</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" onClick={() => router.push('/dashboard/cliente')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="shadow-xl shadow-amber-900/5">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar Novo Evento</h1>
              <p className="text-gray-600">Descreva seu evento para receber orçamentos dos melhores profissionais</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Nome do Evento */}
              <div>
                <Label htmlFor="name">Nome do Evento *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Casamento Ana e Pedro"
                  required
                />
              </div>

              {/* Tipo de Evento */}
              <div>
                <Label>Tipo de Evento *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {tiposEvento.map((tipo) => (
                    <button
                      key={tipo.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, eventType: tipo.id })}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.eventType === tipo.id
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {tipo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data e Convidados */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date">Data do Evento *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guestCount">Número de Convidados *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="guestCount"
                      type="number"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      placeholder="100"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Local */}
              <div className="space-y-4">
                <Label>Local do Evento *</Label>
                <Input
                  placeholder="Endereço completo"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Estado (SP)"
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasKitchen"
                    checked={formData.hasKitchen}
                    onCheckedChange={() => toggleBoolean('hasKitchen')}
                  />
                  <Label htmlFor="hasKitchen" className="text-sm cursor-pointer">
                    O local possui cozinha/copa disponível
                  </Label>
                </div>
              </div>

              {/* Estilos Culinários */}
              <div>
                <Label>Estilos Culinários Preferidos</Label>
                <p className="text-sm text-gray-500 mb-2">Selecione os estilos que mais te agradam</p>
                <div className="flex flex-wrap gap-2">
                  {estilosCulinaria.map((estilo) => (
                    <button
                      key={estilo}
                      type="button"
                      onClick={() => toggleArray('cuisineStyles', estilo)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.cuisineStyles.includes(estilo)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {estilo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipos de Serviço */}
              <div>
                <Label>Tipo de Serviço Desejado</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {tiposServico.map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                      <button
                        key={tipo.id}
                        type="button"
                        onClick={() => toggleArray('serviceTypes', tipo.id)}
                        className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                          formData.serviceTypes.includes(tipo.id)
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{tipo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Serviços Adicionais */}
              <div>
                <Label>Serviços Adicionais Necessários</Label>
                <p className="text-sm text-gray-500 mb-3">Selecione os serviços extras que você precisa</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {servicosAdicionais.map((servico) => {
                    const Icon = servico.icon;
                    const isSelected = formData[servico.id as keyof typeof formData] as boolean;
                    return (
                      <button
                        key={servico.id}
                        type="button"
                        onClick={() => toggleBoolean(servico.id)}
                        className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{servico.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Faixa de Preço */}
              <div>
                <Label>Faixa de Preço Esperada *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {faixasPreco.map((faixa) => (
                    <button
                      key={faixa.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, priceRange: faixa.id })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.priceRange === faixa.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{faixa.label}</span>
                        <div className={`px-2 py-0.5 rounded-full text-xs ${faixa.color}`}>
                          {faixa.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="description">Descrição do Evento</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva os detalhes do evento, preferências gastronômicas, restrições alimentares..."
                  rows={4}
                />
              </div>

              {/* Restrições Alimentares */}
              <div>
                <Label htmlFor="dietaryRestrictions">Restrições Alimentares ou Preferências Especiais</Label>
                <Textarea
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  placeholder="Ex: Alérgicos a frutos do mar, vegetarianos, veganos, sem lactose..."
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.eventType}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 h-12 text-lg"
              >
                {loading ? 'Criando Evento...' : 'Criar Evento e Encontrar Profissionais'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
