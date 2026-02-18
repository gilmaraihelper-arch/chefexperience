'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChefHat, User, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function CompletarCadastroPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: '', // 'CLIENT' ou 'PROFESSIONAL'
    phone: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    // Se usuário já tem tipo definido, redirecionar para dashboard
    if (status === 'authenticated' && session?.user?.type) {
      if (session.user.type === 'CLIENT') {
        router.push('/dashboard/cliente');
      } else {
        router.push('/dashboard/profissional');
      }
    }
  }, [status, session, router]);

  const handleTypeSelect = (type: string) => {
    setFormData({ ...formData, type });
    setStep(2);
  };

  const fetchAddress = async (cep: string) => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          }));
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao completar cadastro');
      }

      // Redirecionar baseado no tipo
      if (formData.type === 'CLIENT') {
        router.push('/dashboard/cliente');
      } else {
        router.push('/cadastro/profissional');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl shadow-amber-900/5">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Complete seu cadastro
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1 ? 'Escolha como deseja usar o ChefExperience' : 'Preencha seus dados'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Escolher tipo */}
          {step === 1 && (
            <div className="space-y-4">
              <button
                onClick={() => handleTypeSelect('CLIENT')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Sou Cliente</h3>
                    <p className="text-gray-600 text-sm">
                      Quero contratar profissionais para meus eventos
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect('PROFESSIONAL')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Sou Profissional</h3>
                    <p className="text-gray-600 text-sm">
                      Quero oferecer meus serviços de gastronomia
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Formulário de dados */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => {
                    const cep = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, cep });
                    if (cep.length === 8) fetchAddress(cep);
                  }}
                  placeholder="00000-000"
                  maxLength={8}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua/Avenida"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                  placeholder="Apto, Bloco, etc"
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Bairro"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Cidade"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="SP"
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                >
                  {loading ? 'Salvando...' : 'Continuar'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
