'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChefHat, 
  ArrowLeft, 
  ArrowRight,
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
  Heart,
  Star,
  X,
  Search,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const tiposEvento = [
  { id: 'CASAMENTO', label: 'Casamento', icon: '💒' },
  { id: 'ANIVERSARIO', label: 'Aniversário', icon: '🎂' },
  { id: 'CORPORATIVO', label: 'Evento Corporativo', icon: '💼' },
  { id: 'FORMATURA', label: 'Formatura', icon: '🎓' },
  { id: 'CONFRATERNIZACAO', label: 'Confraternização', icon: '🎉' },
  { id: 'JANTAR', label: 'Jantar Íntimo', icon: '🍽️' },
  { id: 'COQUETEL', label: 'Coquetel', icon: '🥂' },
  { id: 'FESTA_INFANTIL', label: 'Festa Infantil', icon: '🎈' },
  { id: 'DEBUTANTE', label: 'Debutante', icon: '👗' },
  { id: 'BODAS', label: 'Bodas', icon: '💍' },
  { id: 'CHA_BEBE', label: 'Chá de Bebê', icon: '🍼' },
  { id: 'NOIVADO', label: 'Noivado', icon: '💎' },
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
  { id: 'POPULAR', label: 'Popular', desc: 'A partir de R$ 35/pessoa', min: 35, max: 80, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'EXECUTIVO', label: 'Executivo', desc: 'A partir de R$ 80/pessoa', min: 80, max: 150, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'PREMIUM', label: 'Premium', desc: 'A partir de R$ 150/pessoa', min: 150, max: 300, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'LUXO', label: 'Luxo', desc: 'A partir de R$ 300/pessoa', min: 300, max: 500, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'ULTRA_LUXO', label: 'Ultra Luxo', desc: 'A partir de R$ 500/pessoa', min: 500, max: 1000, color: 'bg-rose-100 text-rose-700 border-rose-200' },
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

// Mock data for professional matches
const mockProfissionais = [
  {
    id: 1,
    nome: 'Chef Ana Martins',
    especialidade: 'Cozinha Italiana & Massas',
    avaliacao: 4.9,
    avaliacoes: 127,
    preco: 'R$ 45-80',
    imagem: '/chef-profissional.jpg',
    descricao: 'Especialista em massas artesanais e culinária italiana tradicional',
    tags: ['Italiano/Massas', 'Premium', 'Casamentos'],
    distancia: '3.2 km',
    match: 98
  },
  {
    id: 2,
    nome: 'Buffet Gourmet Silva',
    especialidade: 'Buffet Completo & Eventos',
    avaliacao: 4.8,
    avaliacoes: 89,
    preco: 'R$ 55-120',
    imagem: '/buffet-evento.jpg',
    descricao: 'Buffet completo para eventos de todos os portes',
    tags: ['Buffet', 'Executivo', 'Corporativo'],
    distancia: '5.1 km',
    match: 95
  },
  {
    id: 3,
    nome: 'Chef Rodrigo Costa',
    especialidade: 'Churrasco & Brasileira',
    avaliacao: 4.7,
    avaliacoes: 203,
    preco: 'R$ 40-90',
    imagem: '/chef-profissional.jpg',
    descricao: 'Churrasqueiro profissional com 15 anos de experiência',
    tags: ['Churrasco', 'Popular', 'Aniversários'],
    distancia: '7.8 km',
    match: 92
  },
  {
    id: 4,
    nome: 'Elite Catering',
    especialidade: 'Eventos Corporativos & Coffee Break',
    avaliacao: 4.9,
    avaliacoes: 156,
    preco: 'R$ 35-65',
    imagem: '/buffet-evento.jpg',
    descricao: 'Especialistas em eventos corporativos e coffee breaks',
    tags: ['Coffee Break', 'Popular', 'Corporativo'],
    distancia: '2.5 km',
    match: 90
  },
  {
    id: 5,
    nome: 'Chef Patricia Lima',
    especialidade: 'Mediterrânea & Fusion',
    avaliacao: 4.8,
    avaliacoes: 78,
    preco: 'R$ 70-150',
    imagem: '/chef-profissional.jpg',
    descricao: 'Culinária mediterrânea com toques contemporâneos',
    tags: ['Mediterrânea', 'Premium', 'Jantares'],
    distancia: '4.3 km',
    match: 88
  }
];

const steps = [
  { number: 1, title: 'Tipo de Evento', icon: Sparkles },
  { number: 2, title: 'Detalhes', icon: Calendar },
  { number: 3, title: 'Local', icon: MapPin },
  { number: 4, title: 'Serviços', icon: Utensils },
  { number: 5, title: 'Orçamento', icon: DollarSign },
  { number: 6, title: 'Match', icon: Search },
];

export default function CriarEventoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedPros, setSelectedPros] = useState<number[]>([]);
  const [orcamentoSlider, setOrcamentoSlider] = useState(150);
  
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

  const getFaixaAtual = () => faixasPreco.find(f => f.id === formData.priceRange) || faixasPreco[2];

  const calcularMatch = () => {
    // Simula cálculo de match baseado nas preferências
    return mockProfissionais.map(pro => ({
      ...pro,
      match: Math.floor(85 + Math.random() * 15)
    })).sort((a, b) => b.match - a.match);
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
      if (currentStep === 5) {
        setShowMatchModal(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
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

  const profissionaisMatch = calcularMatch();
  const faixaAtual = getFaixaAtual();

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.eventType && formData.name;
      case 2: return formData.date && formData.guestCount;
      case 3: return formData.address && formData.city && formData.state;
      case 4: return true;
      case 5: return true;
      case 6: return true;
      default: return false;
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
            <div className="text-sm text-gray-500">Criar Evento - Passo {currentStep} de 6</div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex flex-col items-center ${index > 0 ? 'ml-2' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' :
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-1 ${isActive ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => currentStep === 1 ? router.push('/dashboard/cliente') : handleBack()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Voltar' : 'Anterior'}
        </Button>

        <Card className="shadow-xl shadow-amber-900/5">
          <CardContent className="p-8">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* STEP 1: Tipo de Evento */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Qual tipo de evento?</h1>
                  <p className="text-gray-600">Selecione o tipo de evento que você está planejando</p>
                </div>

                <div>
                  <Label htmlFor="name">Nome do Evento *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Casamento Ana e Pedro"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Tipo de Evento *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {tiposEvento.map((tipo) => (
                      <button
                        key={tipo.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, eventType: tipo.id })}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.eventType === tipo.id
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <span className="text-2xl mb-1 block">{tipo.icon}</span>
                        <span className="font-medium">{tipo.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Detalhes */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Detalhes do Evento</h1>
                  <p className="text-gray-600">Informe a data e número de convidados</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date">Data do Evento *</Label>
                    <div className="relative mt-2">
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
                    <div className="relative mt-2">
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
              </div>
            )}

            {/* STEP 3: Local */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Onde será o evento?</h1>
                  <p className="text-gray-600">Informe o local do evento</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Endereço Completo *</Label>
                    <Input
                      placeholder="Rua, número, bairro"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-2"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cidade *</Label>
                      <Input
                        placeholder="Cidade"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label>Estado *</Label>
                      <Input
                        placeholder="SP"
                        maxLength={2}
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
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
              </div>
            )}

            {/* STEP 4: Serviços */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Que serviços você precisa?</h1>
                  <p className="text-gray-600">Selecione os serviços desejados para seu evento</p>
                </div>

                <div>
                  <Label>Tipo de Serviço</Label>
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
                          <span className="text-sm font-medium text-center">{tipo.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Serviços Adicionais</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
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

                <div>
                  <Label htmlFor="dietaryRestrictions">Restrições Alimentares</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    placeholder="Ex: Alérgicos a frutos do mar, vegetarianos, sem lactose..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Orçamento */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Qual seu orçamento?</h1>
                  <p className="text-gray-600">Selecione a faixa de preço e ajuste o valor por pessoa</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {faixasPreco.map((faixa) => (
                    <button
                      key={faixa.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, priceRange: faixa.id });
                        setOrcamentoSlider(faixa.min);
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.priceRange === faixa.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-lg">{faixa.label}</span>
                          <p className="text-sm text-gray-500">{faixa.desc}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${faixa.color}`}>
                          {formData.priceRange === faixa.id ? 'Selecionado' : 'Selecionar'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-amber-50 p-6 rounded-lg">
                  <Label className="text-amber-800">Ajuste o valor por pessoa</Label>
                  <div className="mt-4">
                    <Slider
                      value={[orcamentoSlider]}
                      onValueChange={(value) => setOrcamentoSlider(value[0])}
                      min={faixaAtual.min}
                      max={faixaAtual.max}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-amber-600">
                      <span>R$ {faixaAtual.min}</span>
                      <span className="font-bold text-lg">R$ {orcamentoSlider}/pessoa</span>
                      <span>R$ {faixaAtual.max}</span>
                    </div>
                  </div>
                  {formData.guestCount && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <p className="text-amber-800">
                        Orçamento estimado total: <span className="font-bold text-xl">R$ {(orcamentoSlider * parseInt(formData.guestCount || '0')).toLocaleString('pt-BR')}</span>
                      </p>
                      <p className="text-sm text-amber-600">para {formData.guestCount} convidados</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Descrição do Evento</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva os detalhes do evento, preferências gastronômicas, restrições alimentares..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: Resumo e Match */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Resumo do Evento</h1>
                  <p className="text-gray-600">Revise os detalhes antes de criar</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Evento:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo:</span>
                    <span className="font-medium">{tiposEvento.find(t => t.id === formData.eventType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Data:</span>
                    <span className="font-medium">{formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Convidados:</span>
                    <span className="font-medium">{formData.guestCount} pessoas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Local:</span>
                    <span className="font-medium">{formData.city}, {formData.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Orçamento:</span>
                    <span className="font-medium">{faixaAtual.label} - R$ {orcamentoSlider}/pessoa</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-gray-500 text-sm">Orçamento total estimado:</p>
                    <p className="text-2xl font-bold text-amber-600">
                      R$ {(orcamentoSlider * parseInt(formData.guestCount || '0')).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>Dica:</strong> Após criar o evento, profissionais compatíveis com suas preferências poderão enviar orçamentos. 
                    Você receberá notificações por e-mail.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
              
              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 h-12 text-lg"
                >
                  {loading ? 'Criando Evento...' : 'Criar Evento'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Match Modal */}
      <Dialog open={showMatchModal} onOpenChange={setShowMatchModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Search className="w-6 h-6 text-amber-500" />
              Profissionais Compatíveis
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <p className="text-gray-600">
              Encontramos <strong>{profissionaisMatch.length} profissionais</strong> que podem atender seu evento. 
              Selecione os que deseja enviar solicitação de orçamento:
            </p>

            <div className="grid gap-4">
              {profissionaisMatch.map((pro) => (
                <Card 
                  key={pro.id} 
                  className={`cursor-pointer transition-all ${
                    selectedPros.includes(pro.id) ? 'border-amber-500 ring-2 ring-amber-200' : 'hover:border-amber-300'
                  }`}
                  onClick={() => {
                    setSelectedPros(prev => 
                      prev.includes(pro.id) 
                        ? prev.filter(id => id !== pro.id)
                        : [...prev, pro.id]
                    );
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={pro.imagem} 
                        alt={pro.nome}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{pro.nome}</h3>
                            <p className="text-sm text-gray-500">{pro.especialidade}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                {pro.avaliacao} ({pro.avaliacoes} avaliações)
                              </span>
                              <span>{pro.distancia}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-700 text-lg">
                              {pro.match}% Match
                            </Badge>
                            <p className="font-semibold text-amber-600 mt-1">{pro.preco}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{pro.descricao}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {pro.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedPros.includes(pro.id) && (
                        <CheckCircle2 className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowMatchModal(false)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Pular
              </Button>
              <Button
                onClick={() => {
                  setShowMatchModal(false);
                  handleSubmit();
                }}
                disabled={selectedPros.length === 0}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600"
              >
                <Check className="w-4 h-4 mr-2" />
                {selectedPros.length > 0 
                  ? `Solicitar Orçamento (${selectedPros.length})` 
                  : 'Selecione um profissional'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
