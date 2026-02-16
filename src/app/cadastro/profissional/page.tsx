'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Building2, 
  MapPin,
  Star,
  CheckCircle2,
  Eye,
  EyeOff,
  Users,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const especialidades = [
  'Brasileira', 'Italiana', 'Francesa', 'Japonesa', 'Mexicana',
  'Árabe', 'Mediterrânea', 'Churrasco', 'Frutos do Mar', 'Vegetariana',
  'Vegana', 'Sem Glúten', 'Sem Lactose', 'Cozinha de Autor'
];

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

const faixasPreco = [
  { id: 'POPULAR', label: 'Popular', desc: 'A partir de R$ 35/pessoa' },
  { id: 'EXECUTIVO', label: 'Executivo', desc: 'A partir de R$ 80/pessoa' },
  { id: 'PREMIUM', label: 'Premium', desc: 'A partir de R$ 150/pessoa' },
  { id: 'LUXO', label: 'Luxo', desc: 'A partir de R$ 300/pessoa' },
];

export default function CadastroProfissionalPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cnpj: '',
    tipoPessoa: 'pf' as 'pf' | 'pj',
    cep: '',
    endereco: '',
    numero: '',
    cidade: '',
    estado: '',
    descricao: '',
    especialidades: [] as string[],
    eventTypes: [] as string[],
    priceRanges: [] as string[],
    senha: '',
    confirmarSenha: '',
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleEspecialidade = (esp: string) => {
    const current = formData.especialidades;
    if (current.includes(esp)) {
      updateForm('especialidades', current.filter(e => e !== esp));
    } else {
      updateForm('especialidades', [...current, esp]);
    }
  };

  const toggleEventType = (type: string) => {
    const current = formData.eventTypes;
    if (current.includes(type)) {
      updateForm('eventTypes', current.filter(t => t !== type));
    } else {
      updateForm('eventTypes', [...current, type]);
    }
  };

  const togglePriceRange = (range: string) => {
    const current = formData.priceRanges;
    if (current.includes(range)) {
      updateForm('priceRanges', current.filter(r => r !== range));
    } else {
      updateForm('priceRanges', [...current, range]);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.nome && formData.email && formData.telefone && 
               (formData.tipoPessoa === 'pf' ? formData.cpf : formData.cnpj);
      case 2:
        return formData.cep && formData.endereco && formData.cidade && formData.estado;
      case 3:
        return formData.descricao && formData.especialidades.length > 0 && 
               formData.eventTypes.length > 0 && formData.priceRanges.length > 0;
      case 4:
        return formData.senha.length >= 6 && formData.senha === formData.confirmarSenha;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.senha,
          name: formData.nome,
          phone: formData.telefone,
          type: 'PROFESSIONAL',
          personType: formData.tipoPessoa.toUpperCase(),
          cpf: formData.cpf || null,
          cnpj: formData.cnpj || null,
          cep: formData.cep,
          address: formData.endereco,
          number: formData.numero,
          city: formData.cidade,
          state: formData.estado,
          description: formData.descricao,
          cuisineStyles: JSON.stringify(formData.especialidades),
          eventTypes: JSON.stringify(formData.eventTypes),
          priceRanges: JSON.stringify(formData.priceRanges),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      // Login automático
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.senha,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        router.push('/dashboard/profissional');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Dados' },
    { number: 2, title: 'Endereço' },
    { number: 3, title: 'Perfil' },
    { number: 4, title: 'Senha' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </Link>
            <div className="text-sm text-gray-500">Cadastro Profissional</div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step === s.number
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg'
                        : step > s.number
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{s.number}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${step === s.number ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 md:w-32 h-0.5 mx-2 ${step > s.number ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl shadow-amber-900/5">
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados Profissionais</h2>
                  <p className="text-gray-600">Informe seus dados de contato</p>
                </div>

                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => updateForm('tipoPessoa', 'pf')}
                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                      formData.tipoPessoa === 'pf'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1" />
                    Pessoa Física
                  </button>
                  <button
                    type="button"
                    onClick={() => updateForm('tipoPessoa', 'pj')}
                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                      formData.tipoPessoa === 'pj'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1" />
                    Pessoa Jurídica
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Nome Completo / Razão Social *</Label>
                    <Input
                      value={formData.nome}
                      onChange={(e) => updateForm('nome', e.target.value)}
                      placeholder={formData.tipoPessoa === 'pf' ? 'Seu nome' : 'Razão social da empresa'}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>E-mail *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <Label>Telefone *</Label>
                      <Input
                        value={formData.telefone}
                        onChange={(e) => updateForm('telefone', e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>{formData.tipoPessoa === 'pf' ? 'CPF *' : 'CNPJ *'}</Label>
                    <Input
                      value={formData.tipoPessoa === 'pf' ? formData.cpf : formData.cnpj}
                      onChange={(e) => updateForm(formData.tipoPessoa === 'pf' ? 'cpf' : 'cnpj', e.target.value)}
                      placeholder={formData.tipoPessoa === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Endereço</h2>
                  <p className="text-gray-600">Onde você atende</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>CEP *</Label>
                    <Input
                      value={formData.cep}
                      onChange={(e) => updateForm('cep', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>

                  <div>
                    <Label>Endereço *</Label>
                    <Input
                      value={formData.endereco}
                      onChange={(e) => updateForm('endereco', e.target.value)}
                      placeholder="Rua, Avenida..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Número *</Label>
                      <Input
                        value={formData.numero}
                        onChange={(e) => updateForm('numero', e.target.value)}
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <Label>Cidade *</Label>
                      <Input
                        value={formData.cidade}
                        onChange={(e) => updateForm('cidade', e.target.value)}
                        placeholder="Sua cidade"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Estado *</Label>
                    <Input
                      value={formData.estado}
                      onChange={(e) => updateForm('estado', e.target.value.toUpperCase())}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil Profissional</h2>
                  <p className="text-gray-600">Conte mais sobre seu trabalho</p>
                </div>

                <div>
                  <Label>Descrição *</Label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => updateForm('descricao', e.target.value)}
                    placeholder="Descreva sua experiência, especialidades, diferenciais..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Especialidades Culinárias *</Label>
                  <div className="flex flex-wrap gap-2">
                    {especialidades.map((esp) => (
                      <button
                        key={esp}
                        type="button"
                        onClick={() => toggleEspecialidade(esp)}
                        className={`px-3 py-1 rounded-full text-sm border transition-all ${
                          formData.especialidades.includes(esp)
                            ? 'bg-amber-100 border-amber-500 text-amber-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
                        }`}
                      >
                        {esp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Tipos de Evento que Atende *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {tiposEvento.map((tipo) => (
                      <button
                        key={tipo.id}
                        type="button"
                        onClick={() => toggleEventType(tipo.id)}
                        className={`p-2 rounded-lg border text-sm text-left transition-all ${
                          formData.eventTypes.includes(tipo.id)
                            ? 'bg-amber-100 border-amber-500 text-amber-700'
                            : 'bg-white border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        {tipo.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Faixa de Preço *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {faixasPreco.map((faixa) => (
                      <button
                        key={faixa.id}
                        type="button"
                        onClick={() => togglePriceRange(faixa.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          formData.priceRanges.includes(faixa.id)
                            ? 'bg-amber-100 border-amber-500'
                            : 'bg-white border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{faixa.label}</div>
                        <div className="text-xs text-gray-500">{faixa.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Crie sua Senha</h2>
                  <p className="text-gray-600">Último passo!</p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <Label>Senha *</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.senha}
                        onChange={(e) => updateForm('senha', e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label>Confirmar Senha *</Label>
                    <Input
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={(e) => updateForm('confirmarSenha', e.target.value)}
                      placeholder="Digite a senha novamente"
                    />
                    {formData.confirmarSenha && formData.senha !== formData.confirmarSenha && (
                      <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => step === 1 ? router.push('/') : setStep(step - 1)}
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? 'Voltar' : 'Anterior'}
              </Button>
              
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid()}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Criar Conta
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}