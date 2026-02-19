'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ChefHat,
  User,
  Briefcase,
  MapPin,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface FormData {
  type: '' | 'CLIENT' | 'PROFESSIONAL';
  name: string;
  phone: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const INITIAL_FORM_DATA: FormData = {
  type: '',
  name: '',
  phone: '',
  cpf: '',
  cep: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

const STEPS = [
  { id: 1, label: 'Tipo de conta', description: 'Escolha como deseja usar o ChefExperience' },
  { id: 2, label: 'Dados pessoais', description: 'Informe seus dados básicos' },
  { id: 3, label: 'Endereço', description: 'Onde você está localizado' },
  { id: 4, label: 'Confirmação', description: 'Revise e confirme seus dados' },
  { id: 5, label: 'Sucesso', description: 'Cadastro concluído' },
];

export default function CompletarCadastroPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    // Se usuário já tem tipo definido, redirecionar para dashboard correspondente
    if (status === 'authenticated' && session?.user?.type) {
      if (session.user.type === 'CLIENT') {
        router.push('/dashboard/cliente');
      } else {
        router.push('/dashboard/profissional');
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    // Redireciona automaticamente após a tela de sucesso
    if (step === 5 && formData.type) {
      const timeout = setTimeout(() => {
        if (formData.type === 'CLIENT') {
          router.push('/dashboard/cliente');
        } else {
          router.push('/dashboard/profissional');
        }
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [step, formData.type, router]);

  const handleTypeSelect = (type: 'CLIENT' | 'PROFESSIONAL') => {
    setFormData((prev) => ({ ...prev, type }));
    setStep(2);
  };

  const fetchAddress = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          address: data.logradouro || prev.address,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
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

      setStep(5);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao completar cadastro');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const currentStepMeta = STEPS.find((s) => s.id === step);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl shadow-amber-900/5 border-0">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Complete seu cadastro</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {currentStepMeta?.description}
                </p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {STEPS.map((s, index) => {
                const isActive = s.id === step;
                const isCompleted = s.id < step;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    {index !== 0 && (
                      <div className="h-px w-4 sm:w-6 bg-gray-200" />
                    )}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium
                        ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                        ${isActive ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : ''}
                        {!isActive && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                      `}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Escolher tipo */}
          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTypeSelect('CLIENT')}
                className={`w-full p-5 border-2 rounded-2xl text-left transition-all bg-white/80
                  ${formData.type === 'CLIENT'
                    ? 'border-amber-500 shadow-md shadow-amber-500/10 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-400 hover:bg-amber-50/40'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Sou Cliente</h3>
                    <p className="text-gray-600 text-sm">
                      Quero contratar profissionais para meus eventos.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('PROFESSIONAL')}
                className={`w-full p-5 border-2 rounded-2xl text-left transition-all bg-white/80
                  ${formData.type === 'PROFESSIONAL'
                    ? 'border-orange-500 shadow-md shadow-orange-500/10 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50/40'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Sou Profissional</h3>
                    <p className="text-gray-600 text-sm">
                      Quero oferecer meus serviços de gastronomia.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Dados pessoais */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, '');
                    setFormData((prev) => ({ ...prev, cpf: onlyNumbers }));
                  }}
                  placeholder="000.000.000-00"
                  maxLength={11}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="sm:flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  onClick={() => setStep(3)}
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Endereço */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3 items-end">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => {
                      const cep = e.target.value.replace(/\D/g, '');
                      setFormData((prev) => ({ ...prev, cep }));
                    }}
                    onBlur={() => formData.cep && fetchAddress(formData.cep)}
                    placeholder="00000-000"
                    maxLength={8}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {loading ? 'Buscando endereço...' : 'Preencha o CEP para buscar o endereço automaticamente.'}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua / Avenida"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.complement}
                  onChange={(e) => setFormData((prev) => ({ ...prev, complement: e.target.value }))}
                  placeholder="Apto, bloco, referência, etc."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-1.5">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData((prev) => ({ ...prev, neighborhood: e.target.value }))}
                    placeholder="Bairro"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1.5">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Cidade"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value.toUpperCase() }))}
                    placeholder="SP"
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  type="button"
                  className="sm:flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  onClick={() => setStep(4)}
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmação */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                  <h3 className="text-sm font-semibold text-amber-800 mb-3">Tipo de conta</h3>
                  <p className="text-sm text-amber-900 flex items-center gap-2">
                    {formData.type === 'CLIENT' ? (
                      <>
                        <User className="w-4 h-4" /> Cliente
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-4 h-4" /> Profissional
                      </>
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Dados pessoais</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><span className="font-medium">Nome:</span> {formData.name}</li>
                    <li><span className="font-medium">Telefone:</span> {formData.phone}</li>
                    <li><span className="font-medium">CPF:</span> {formData.cpf}</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Endereço</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <span className="font-medium">Endereço:</span>{' '}
                      {formData.address}, {formData.number}
                      {formData.complement && ` - ${formData.complement}`}
                    </li>
                    <li>
                      <span className="font-medium">Bairro:</span> {formData.neighborhood}
                    </li>
                    <li>
                      <span className="font-medium">Cidade/UF:</span> {formData.city} - {formData.state}
                    </li>
                    <li>
                      <span className="font-medium">CEP:</span> {formData.cep}
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Ao continuar, você confirma que seus dados estão corretos e concorda em receber
                comunicações relacionadas aos seus eventos pelo ChefExperience.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => setStep(3)}
                  disabled={submitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para editar
                </Button>
                <Button
                  type="button"
                  className="sm:flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                  onClick={handleConfirm}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando dados...
                    </>
                  ) : (
                    <>
                      Confirmar e finalizar cadastro
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Sucesso */}
          {step === 5 && (
            <div className="flex flex-col items-center text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Cadastro completo!
              </h2>
              <p className="text-gray-600 max-w-md text-sm">
                Tudo pronto, {formData.name || 'chef'}! Estamos te direcionando para o seu
                painel {formData.type === 'CLIENT' ? 'de cliente' : 'profissional'} para
                começar a usar o ChefExperience.
              </p>
              <p className="text-xs text-gray-400">
                Você será redirecionado automaticamente em alguns segundos...
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  if (formData.type === 'CLIENT') {
                    router.push('/dashboard/cliente');
                  } else {
                    router.push('/dashboard/profissional');
                  }
                }}
              >
                Ir para o dashboard agora
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
