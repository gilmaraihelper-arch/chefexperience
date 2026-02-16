'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, ArrowLeft, Calendar, Users, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const tiposEvento = [
  { id: 'CASAMENTO', label: 'Casamento' },
  { id: 'ANIVERSARIO', label: 'Aniversário' },
  { id: 'CORPORATIVO', label: 'Evento Corporativo' },
  { id: 'FORMATURA', label: 'Formatura' },
  { id: 'CONFRATERNIZACAO', label: 'Confraternização' },
  { id: 'JANTAR', label: 'Jantar Íntimo' },
  { id: 'COQUETEL', label: 'Coquetel' },
  { id: 'FESTA_INFANTIL', label: 'Festa Infantil' },
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
  });

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
          cuisineStyles: [],
          serviceTypes: [],
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" onClick={() => router.push('/dashboard/cliente')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="shadow-xl shadow-amber-900/5">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar Novo Evento</h1>
              <p className="text-gray-600">Descreva seu evento para receber orçamentos</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <Label>Tipo de Evento *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
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
              </div>

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

              <Button
                type="submit"
                disabled={loading || !formData.eventType}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
              >
                {loading ? 'Criando...' : 'Criar Evento'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}