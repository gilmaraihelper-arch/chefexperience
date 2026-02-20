'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { 
  ChefHat, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export default function CadastroClientePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isOAuth = status === 'authenticated' && session?.user?.email;
  
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: session?.user?.name || '',
    email: session?.user?.email || '',
    telefone: '',
    whatsapp: '',
    cpf: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    senha: '',
    confirmarSenha: '',
    aceitaTermos: false,
    receberNovidades: false,
  });

  // Atualizar form quando sessão carregar
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        nome: session.user.name || prev.nome,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.nome && formData.email && formData.telefone && formData.cpf;
      case 2:
        return formData.cep && formData.endereco && formData.cidade && formData.estado;
      case 3:
        // Se for OAuth, não precisa validar senha
        if (isOAuth) return formData.aceitaTermos;
        return formData.senha.length >= 8 && formData.senha === formData.confirmarSenha && formData.aceitaTermos;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (isOAuth) {
        // Se veio do OAuth, usar complete-profile
        response = await fetch('/api/auth/complete-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CLIENT',
            phone: formData.telefone,
            cep: formData.cep,
            address: formData.endereco,
            number: formData.numero,
            complement: formData.complemento,
            neighborhood: formData.bairro,
            city: formData.cidade,
            state: formData.estado,
          }),
        });
      } else {
        // Cadastro normal
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.senha,
            name: formData.nome,
            phone: formData.telefone,
            whatsapp: formData.whatsapp,
            type: 'CLIENT',
            personType: 'PF',
            cpf: formData.cpf,
            cep: formData.cep,
            address: formData.endereco,
            number: formData.numero,
            complement: formData.complemento,
            neighborhood: formData.bairro,
            city: formData.cidade,
            state: formData.estado,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      if (isOAuth) {
        // Se for OAuth, já está logado, só redirecionar
        router.push('/dashboard/cliente');
      } else {
        // Login automático para cadastro normal
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
          router.push('/dashboard/cliente');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Dados Pessoais' },
    { number: 2, title: 'Endereço' },
    { number: 3, title: 'Segurança' },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Crie sua conta</h2>
              <p className="text-gray-600">Preencha seus dados para começar a encontrar os melhores profissionais</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => updateForm('nome', e.target.value)}
                    placeholder="Seu nome completo"
                    className="pl-10"
                  />
                </div>
              </div>

              {!isOAuth && (
                <div className="md:col-span-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              {isOAuth && formData.email && (
                <div className="md:col-span-2">
                  <Label>E-mail (via Google)</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 bg-gray-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => updateForm('telefone', e.target.value)}
                    placeholder="(00) 0000-0000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => updateForm('whatsapp', e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => updateForm('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu Endereço</h2>
              <p className="text-gray-600">Informe sua localização para encontrar profissionais próximos</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => updateForm('cep', e.target.value)}
                    placeholder="00000-000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => updateForm('endereco', e.target.value)}
                    placeholder="Rua, Avenida, etc."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => updateForm('numero', e.target.value)}
                  placeholder="123"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => updateForm('complemento', e.target.value)}
                  placeholder="Apartamento, Bloco, etc."
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => updateForm('bairro', e.target.value)}
                  placeholder="Seu bairro"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => updateForm('cidade', e.target.value)}
                  placeholder="Sua cidade"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => updateForm('estado', e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isOAuth ? 'Termos de Uso' : 'Crie sua senha'}
              </h2>
              <p className="text-gray-600">
                {isOAuth 
                  ? 'Revise e aceite os termos para completar seu cadastro'
                  : 'Proteja sua conta com uma senha segura'
                }
              </p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              {!isOAuth && (
                <>
                  <div>
                    <Label htmlFor="senha">Senha *</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="senha"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.senha}
                        onChange={(e) => updateForm('senha', e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmarSenha"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmarSenha}
                        onChange={(e) => updateForm('confirmarSenha', e.target.value)}
                        placeholder="Digite a senha novamente"
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmarSenha && formData.senha !== formData.confirmarSenha && (
                      <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-4 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.aceitaTermos}
                    onCheckedChange={(checked) => updateForm('aceitaTermos', checked)}
                  />
                  <span className="text-sm text-gray-600">
                    Li e aceito os <a href="/termos" className="text-amber-600 hover:underline">Termos de Uso</a> e{' '}
                    <a href="/privacidade" className="text-amber-600 hover:underline">Política de Privacidade</a> *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.receberNovidades}
                    onCheckedChange={(checked) => updateForm('receberNovidades', checked)}
                  />
                  <span className="text-sm text-gray-600">
                    Quero receber novidades e promoções por e-mail
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => router.push('/')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </button>
            <div className="text-sm text-gray-500">
              Cadastro de Cliente
            </div>
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
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200'
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
                  <span
                    className={`text-xs mt-2 hidden md:block ${
                      step === s.number ? 'text-amber-600 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 md:w-32 h-0.5 mx-2 ${
                      step > s.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
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
            
            {/* Social Login - Google */}
            {step === 1 && (
              <div className="mb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => signIn('google', { callbackUrl: '/api/auth/oauth-callback' })}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">Continuar com Google</span>
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou continue com e-mail</span>
                  </div>
                </div>
              </div>
            )}
            
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => step === 1 ? router.push('/') : setStep(step - 1)}
                disabled={loading}
                className="border-gray-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? 'Voltar para Home' : 'Voltar'}
              </Button>
              
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid()}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
                >
                  {loading ? 'Criando...' : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Criar Conta
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem uma conta?{' '}
          <a href="/login" className="text-amber-600 hover:underline font-medium">
            Faça login
          </a>
        </p>
      </main>
    </div>
  );
}