'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { 
  ChefHat, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Building2, 
  Upload, 
  CheckCircle2,
  MapPin,
  Star,
  Utensils,
  Users,
  Wine,
  Camera,
  Award,
  Calendar,
  DollarSign,
  Briefcase,
  Phone,
  Mail,
  Image as ImageIcon,
  X,
  Plus,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const tiposEvento = [
  { id: 'casamento', label: 'Casamento', icon: '💒' },
  { id: 'aniversario', label: 'Aniversário', icon: '🎂' },
  { id: 'corporativo', label: 'Evento Corporativo', icon: '💼' },
  { id: 'formatura', label: 'Formatura', icon: '🎓' },
  { id: 'confraternizacao', label: 'Confraternização', icon: '🎉' },
  { id: 'jantar', label: 'Jantar Íntimo', icon: '🍽️' },
  { id: 'coquetel', label: 'Coquetel', icon: '🥂' },
  { id: 'festa-infantil', label: 'Festa Infantil', icon: '🎈' },
  { id: 'debutante', label: 'Debutante', icon: '👗' },
  { id: 'bodas', label: 'Bodas', icon: '💍' },
  { id: 'cha-bebe', label: 'Chá de Bebê', icon: '🍼' },
  { id: 'noivado', label: 'Noivado', icon: '💎' },
];

const especialidades = [
  'Brasileira', 'Italiana', 'Italiano/Massas', 'Italiano/Pizza', 'Francesa',
  'Japonesa', 'Mexicana', 'Árabe', 'Mediterrânea', 'Churrasco',
  'Frutos do Mar', 'Vegetariana', 'Vegana', 'Sem Glúten', 'Sem Lactose',
  'Doces e Sobremesas', 'Padaria', 'Finger Food', 'Gastronomia Molecular',
  'Cozinha de Autor', 'Comida de Rua', 'Regional', 'Outros'
];

const faixasPreco = [
  { id: 'popular', label: 'Popular', desc: 'A partir de R$ 35/pessoa', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'executivo', label: 'Executivo', desc: 'A partir de R$ 80/pessoa', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'premium', label: 'Premium', desc: 'A partir de R$ 150/pessoa', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'luxo', label: 'Luxo', desc: 'A partir de R$ 300/pessoa', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'ultra-luxo', label: 'Ultra Luxo', desc: 'A partir de R$ 500/pessoa', color: 'bg-rose-100 text-rose-700 border-rose-200' },
];

const capacidade = [
  { id: 'ate-50', label: 'Até 50 pessoas' },
  { id: '50-100', label: '50 a 100 pessoas' },
  { id: '100-200', label: '100 a 200 pessoas' },
  { id: '200-500', label: '200 a 500 pessoas' },
  { id: '500+', label: 'Mais de 500 pessoas' },
];

export default function CadastroProfissionalPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const isOAuth = status === 'authenticated' && !!session?.user?.email;
  
  // Log quando a página carrega
  useEffect(() => {
    console.log('🔍 Cadastro Profissional - Status da sessão:', status);
    console.log('🔍 Cadastro Profissional - Session:', session);
    console.log('🔍 Cadastro Profissional - isOAuth:', isOAuth);
    console.log('🔍 Cadastro Profissional - User email:', session?.user?.email);
  }, [status, session, isOAuth]);

  const [step, setStep] = useState(1);
  const [tipoPessoa, setTipoPessoa] = useState<'pf' | 'pj' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('type', 'portfolio');
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        });
        
        const data = await res.json();
        
        if (data.success) {
          setFormData((prev: any) => ({
            ...prev,
            fotos: [...prev.fotos, data.url]
          }));
        } else {
          setError(data.error || 'Erro ao fazer upload');
        }
      }
    } catch (err) {
      setError('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };
  
  const removeFoto = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      fotos: prev.fotos.filter((_: any, i: number) => i !== index)
    }));
  };
  
  const [formData, setFormData] = useState({
    // Dados básicos
    nome: session?.user?.name || '',
    razaoSocial: '',
    nomeFantasia: '',
    cpf: '',
    cnpj: '',
    email: session?.user?.email || '',
    telefone: '',
    whatsapp: '',
    
    // Senha
    senha: '',
    confirmarSenha: '',
    
    // Endereço
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // Serviços
    tiposEvento: [] as string[],
    especialidades: [] as string[],
    faixaPreco: [] as string[],
    capacidade: [] as string[],
    
    // Localização / Raio
    raioAtendimento: 50,
    
    // Serviços adicionais
    temGarcom: false,
    temSoftDrinks: false,
    temBebidaAlcoolica: false,
    temDecoracao: false,
    temLocacao: false,
    temSom: false,
    temFotografo: false,
    temBartender: false,
    temDoces: false,
    temBolo: false,
    temPratosTalheres: false,
    
    // Perfil
    descricao: '',
    slogan: '',
    diferenciais: '',
    experiencia: '',
    
    // Certificações
    certificacoes: [] as string[],
    
    // Pagamento
    formasPagamento: [] as string[],
    
    // Disponibilidade
    diasSemana: [] as string[],
    
    // Fotos
    fotos: [] as string[],
    logo: '',
  });

  const [certificacaoInput, setCertificacaoInput] = useState('');

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const addCertificacao = () => {
    if (certificacaoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certificacoes: [...prev.certificacoes, certificacaoInput.trim()]
      }));
      setCertificacaoInput('');
    }
  };

  const removeCertificacao = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificacoes: prev.certificacoes.filter((_, i) => i !== index)
    }));
  };

  const steps = [
    { number: 1, title: 'Tipo de Cadastro', icon: User },
    { number: 2, title: 'Dados Pessoais', icon: tipoPessoa === 'pf' ? User : Building2 },
    { number: 3, title: 'Localização', icon: MapPin },
    { number: 4, title: 'Serviços', icon: Utensils },
    { number: 5, title: 'Perfil', icon: Star },
    { number: 6, title: 'Fotos', icon: Camera },
  ];

  const handleSubmit = async () => {
    console.log('📝 ==========================================');
    console.log('📝 HANDLE SUBMIT INICIADO');
    console.log('📝 ==========================================');
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('📝 isOAuth:', isOAuth);
      console.log('📝 session?.user?.email:', session?.user?.email);
      
      if (isOAuth && !session?.user?.email) {
        throw new Error('Sessão não encontrada. Por favor, faça login novamente.');
      }

      const url = '/api/auth/complete-profile-professional';

      // Montar body completo com todos os dados
      const body = {
        // Dados básicos do usuário
        email: session?.user?.email,
        name: formData.nome || formData.razaoSocial || session?.user?.name,
        type: 'PROFESSIONAL',
        personType: tipoPessoa?.toUpperCase(),
        cpf: formData.cpf || null,
        cnpj: formData.cnpj || null,
        razaoSocial: formData.razaoSocial || null,
        nomeFantasia: formData.nomeFantasia || null,
        
        // Contato
        phone: formData.telefone,
        whatsapp: formData.whatsapp || null,
        
        // Endereço
        cep: formData.cep,
        address: formData.endereco,
        number: formData.numero,
        complement: formData.complemento || null,
        neighborhood: formData.bairro,
        city: formData.cidade,
        state: formData.estado,
        
        // Descrição
        description: formData.descricao,
        differentials: formData.diferenciais,
        experience: formData.experiencia,

        // Serviços e configurações
        raioAtendimento: formData.raioAtendimento,
        faixaPreco: formData.faixaPreco,
        tiposEvento: formData.tiposEvento,
        especialidades: formData.especialidades,
        capacidade: formData.capacidade,
        
        // Serviços adicionais (booleanos)
        temGarcom: formData.temGarcom,
        temSoftDrinks: formData.temSoftDrinks,
        temBebidaAlcoolica: formData.temBebidaAlcoolica,
        temDecoracao: formData.temDecoracao,
        temLocacao: formData.temLocacao,
        temSom: formData.temSom,
        temFotografo: formData.temFotografo,
        temBartender: formData.temBartender,
        temDoces: formData.temDoces,
        temBolo: formData.temBolo,
        temPratosTalheres: formData.temPratosTalheres,
        
        // Certificações e disponibilidade
        certificacoes: formData.certificacoes,
        formasPagamento: formData.formasPagamento,
        diasSemana: formData.diasSemana,
      };

      console.log('📝 Enviando POST para:', url);
      console.log('📝 Body completo:', JSON.stringify(body, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log('📝 Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('📝 Response data:', data);
      } catch (parseError) {
        console.error('❌ Erro ao parsear resposta:', parseError);
        throw new Error('Erro ao processar resposta do servidor');
      }

      if (!response.ok) {
        console.error('❌ Response não OK:', response.status, data);
        throw new Error(data.error || data.message || `Erro ${response.status} ao salvar perfil`);
      }

      console.log('✅ Cadastro concluído com sucesso!');
      console.log('✅ User:', data.user);
      console.log('✅ Profile:', data.profile);
      
      setSuccess(true);
      alert('✅ Cadastro concluído com sucesso! Redirecionando...');
      
      // Atualizar sessão antes de redirecionar
      console.log('🔄 Atualizando sessão...');
      await updateSession();
      
      // Pequeno delay para mostrar mensagem de sucesso
      console.log('🔄 Redirecionando para dashboard profissional em 1.5s...');
      setTimeout(() => {
        router.push('/dashboard/profissional');
        router.refresh();
      }, 1500);
      
    } catch (err: any) {
      console.error('❌ ERRO no submit:', err);
      console.error('❌ Message:', err.message);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
      alert('❌ ERRO: ' + (err.message || 'Erro ao criar conta. Tente novamente.'));
    } finally {
      setLoading(false);
      console.log('📝 ==========================================');
      console.log('📝 HANDLE SUBMIT FINALIZADO');
      console.log('📝 ==========================================');
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return tipoPessoa !== null;
      case 2:
        if (tipoPessoa === 'pf') {
          const baseValid = formData.nome && formData.cpf && formData.email && formData.telefone;
          if (isOAuth) return baseValid;
          return (
            baseValid &&
            formData.senha.length >= 8 &&
            formData.senha === formData.confirmarSenha
          );
        }
        const baseValidPJ = formData.razaoSocial && formData.cnpj && formData.email && formData.telefone;
        if (isOAuth) return baseValidPJ;
        return (
          baseValidPJ &&
          formData.senha.length >= 8 &&
          formData.senha === formData.confirmarSenha
        );
      case 3:
        return formData.cep && formData.endereco && formData.cidade && formData.estado;
      case 4:
        return formData.tiposEvento.length > 0 && formData.especialidades.length > 0 && formData.faixaPreco.length > 0;
      case 5:
        return formData.descricao.length >= 50;
      case 6:
        return true;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Que tipo de profissional você é?</h2>
              <p className="text-gray-600">Escolha como deseja se cadastrar na plataforma</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setTipoPessoa('pf')}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
                  tipoPessoa === 'pf'
                    ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-200'
                    : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pessoa Física</h3>
                <p className="text-gray-600">Chef independente, cozinheiro autônomo ou profissional liberal</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-600">
                  <CheckCircle2 className={`w-5 h-5 transition-opacity ${tipoPessoa === 'pf' ? 'opacity-100' : 'opacity-0'}`} />
                  <span>Selecionado</span>
                </div>
              </button>

              <button
                onClick={() => setTipoPessoa('pj')}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
                  tipoPessoa === 'pj'
                    ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-200'
                    : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pessoa Jurídica</h3>
                <p className="text-gray-600">Empresa de buffet, restaurante, casa de festas ou catering</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-600">
                  <CheckCircle2 className={`w-5 h-5 transition-opacity ${tipoPessoa === 'pj' ? 'opacity-100' : 'opacity-0'}`} />
                  <span>Selecionado</span>
                </div>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {tipoPessoa === 'pf' ? 'Dados Pessoais' : 'Dados da Empresa'}
              </h2>
              <p className="text-gray-600">Preencha suas informações de contato</p>
            </div>

            {tipoPessoa === 'pf' ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => updateForm('nome', e.target.value)}
                    placeholder="Seu nome completo"
                    className="mt-1"
                  />
                </div>
                <div>
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
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="razaoSocial">Razão Social *</Label>
                  <Input
                    id="razaoSocial"
                    value={formData.razaoSocial}
                    onChange={(e) => updateForm('razaoSocial', e.target.value)}
                    placeholder="Nome oficial da empresa"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input
                    id="nomeFantasia"
                    value={formData.nomeFantasia}
                    onChange={(e) => updateForm('nomeFantasia', e.target.value)}
                    placeholder="Nome comercial (se diferente)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => updateForm('cnpj', e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 my-6" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
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
                    disabled={isOAuth}
                  />
                </div>
                {isOAuth && (
                  <p className="text-xs text-gray-500 mt-1">
                    E-mail preenchido automaticamente a partir da sua conta de login.
                  </p>
                )}
              </div>
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
              
              {!isOAuth && (
                <>
                  <div>
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={formData.senha}
                      onChange={(e) => updateForm('senha', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={(e) => updateForm('confirmarSenha', e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Localização</h2>
              <p className="text-gray-600">Informe onde você está e onde atende</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => updateForm('cep', e.target.value)}
                  placeholder="00000-000"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => updateForm('endereco', e.target.value)}
                  placeholder="Rua, Avenida, etc."
                  className="mt-1"
                />
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
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => updateForm('complemento', e.target.value)}
                  placeholder="Sala, Andar, etc."
                  className="mt-1"
                />
              </div>
              <div>
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

            {/* Raio de Atendimento */}
            <div className="md:col-span-3 bg-amber-50 rounded-xl p-6 border border-amber-200">
              <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                Raio de Atendimento
              </Label>
              <p className="text-sm text-gray-600 mb-4">
                Até quantos quilômetros você está disposto a se deslocar para atender eventos?
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 w-12">0 km</span>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="10"
                    value={formData.raioAtendimento}
                    onChange={(e) => updateForm('raioAtendimento', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <span className="text-sm text-gray-500 w-16">300 km</span>
                </div>
                
                <div className="flex items-center justify-center">
                  <Badge className="text-lg px-4 py-2 bg-amber-100 text-amber-700 border-amber-300">
                    {formData.raioAtendimento} km
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  {formData.raioAtendimento < 50 
                    ? 'Ideal para atendimento local' 
                    : formData.raioAtendimento < 150 
                      ? 'Boa área de cobertura regional' 
                      : 'Cobertura estadual'}
                </p>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Dica</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Clientes dentro do seu raio de atendimento terão prioridade nas buscas. 
                      Um raio maior aumenta suas chances, mas considere seus custos de deslocamento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Serviços Oferecidos</h2>
              <p className="text-gray-600">Conte-nos o que você faz e para quem</p>
            </div>

            {/* Tipos de Evento */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Tipos de Evento que Atende *</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {tiposEvento.map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={() => toggleArray('tiposEvento', tipo.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      formData.tiposEvento.includes(tipo.id)
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{tipo.icon}</div>
                    <div className="text-sm font-medium">{tipo.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Especialidades */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Especialidades Gastronômicas *</Label>
              <div className="flex flex-wrap gap-2">
                {especialidades.map((esp) => (
                  <button
                    key={esp}
                    onClick={() => toggleArray('especialidades', esp)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                      formData.especialidades.includes(esp)
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-gray-200 hover:border-amber-300 text-gray-700'
                    }`}
                  >
                    {esp}
                  </button>
                ))}
              </div>
            </div>

            {/* Faixa de Preço */}
            <div>
              <Label className="text-base font-semibold mb-2 block">Público-Alvo / Faixa de Preço *</Label>
              <p className="text-sm text-gray-500 mb-4">Selecione uma ou mais faixas de preço que você atende</p>
              <div className="grid md:grid-cols-4 gap-4">
                {faixasPreco.map((faixa) => (
                  <button
                    key={faixa.id}
                    onClick={() => toggleArray('faixaPreco', faixa.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      formData.faixaPreco.includes(faixa.id)
                        ? 'border-amber-500 ring-2 ring-amber-200'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <Badge className={`mb-2 ${faixa.color}`}>{faixa.label}</Badge>
                    <p className="text-sm text-gray-600">{faixa.desc}</p>
                  </button>
                ))}
              </div>
              {formData.faixaPreco.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  {formData.faixaPreco.length} faixa(s) selecionada(s)
                </p>
              )}
            </div>

            {/* Capacidade */}
            <div>
              <Label className="text-base font-semibold mb-2 block">Capacidade de Atendimento</Label>
              <p className="text-sm text-gray-500 mb-4">Selecione uma ou mais opções de público que você atende</p>
              <div className="flex flex-wrap gap-3">
                {capacidade.map((cap) => (
                  <button
                    key={cap.id}
                    onClick={() => toggleArray('capacidade', cap.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                      formData.capacidade.includes(cap.id)
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-300 text-gray-700'
                    }`}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    {cap.label}
                  </button>
                ))}
              </div>
              {formData.capacidade.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  {formData.capacidade.length} opção(ões) selecionada(s)
                </p>
              )}
            </div>

            {/* Serviços Adicionais */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Serviços Adicionais</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { id: 'temGarcom', label: 'Garçom', icon: Users },
                  { id: 'temSoftDrinks', label: 'Soft Drinks', icon: Wine },
                  { id: 'temBebidaAlcoolica', label: 'Bebidas Alcoólicas', icon: Wine },
                  { id: 'temDecoracao', label: 'Decoração', icon: Sparkles },
                  { id: 'temLocacao', label: 'Locação', icon: Building2 },
                  { id: 'temSom', label: 'Som/Luz', icon: Briefcase },
                  { id: 'temFotografo', label: 'Fotógrafo', icon: Camera },
                  { id: 'temBartender', label: 'Bartender', icon: Wine },
                  { id: 'temDoces', label: 'Doces', icon: Utensils },
                  { id: 'temBolo', label: 'Bolo', icon: Utensils },
                  { id: 'temPratosTalheres', label: 'Pratos e Talheres', icon: Utensils },
                ].map((servico) => (
                  <label
                    key={servico.id}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center min-h-[100px] ${
                      formData[servico.id as keyof typeof formData]
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <Checkbox
                      checked={formData[servico.id as keyof typeof formData] as boolean}
                      onCheckedChange={(checked) => updateForm(servico.id, checked)}
                      className="mb-1"
                    />
                    <servico.icon className="w-6 h-6 text-gray-600" />
                    <span className="text-xs font-medium leading-tight">{servico.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu Perfil Profissional</h2>
              <p className="text-gray-600">Crie uma descrição que vá encantar seus clientes</p>
            </div>

            {/* Slogan */}
            <div>
              <Label htmlFor="slogan">Slogan ou Frase de Efeito</Label>
              <Input
                id="slogan"
                value={formData.slogan}
                onChange={(e) => updateForm('slogan', e.target.value)}
                placeholder="Ex: 'Transformando momentos em experiências gastronômicas inesquecíveis'"
                className="mt-1"
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">Descrição do seu Trabalho *</Label>
              <p className="text-sm text-gray-500 mb-2">Mínimo 50 caracteres. Fale sobre sua experiência, diferenciais e o que torna seu serviço especial.</p>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => updateForm('descricao', e.target.value)}
                placeholder="Conte sua história, sua paixão pela gastronomia, anos de experiência, prêmios, etc..."
                className="mt-1 min-h-[150px]"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.descricao.length} caracteres
              </div>
            </div>

            {/* Diferenciais */}
            <div>
              <Label htmlFor="diferenciais">Diferenciais e Destaques</Label>
              <Textarea
                id="diferenciais"
                value={formData.diferenciais}
                onChange={(e) => updateForm('diferenciais', e.target.value)}
                placeholder="O que você oferece que outros não oferecem? Ingredientes especiais, técnicas únicas, atendimento personalizado..."
                className="mt-1 min-h-[100px]"
              />
            </div>

            {/* Anos de Experiência */}
            <div>
              <Label htmlFor="experiencia">Anos de Experiência</Label>
              <div className="relative mt-1 max-w-xs">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="experiencia"
                  type="number"
                  value={formData.experiencia}
                  onChange={(e) => updateForm('experiencia', e.target.value)}
                  placeholder="Ex: 10"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Certificações */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Certificações e Cursos</Label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={certificacaoInput}
                    onChange={(e) => setCertificacaoInput(e.target.value)}
                    placeholder="Ex: Chef Executivo pelo Le Cordon Bleu"
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && addCertificacao()}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addCertificacao}
                  variant="outline"
                  className="border-amber-200 text-amber-600"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.certificacoes.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-amber-100 text-amber-700 px-3 py-1 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    {cert}
                    <button
                      onClick={() => removeCertificacao(index)}
                      className="hover:text-amber-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Formas de Pagamento Aceitas</Label>
              <div className="flex flex-wrap gap-3">
                {['Dinheiro', 'Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Transferência'].map((forma) => (
                  <button
                    key={forma}
                    onClick={() => toggleArray('formasPagamento', forma)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                      formData.formasPagamento.includes(forma)
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-300 text-gray-700'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    {forma}
                  </button>
                ))}
              </div>
            </div>

            {/* Disponibilidade */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Dias da Semana Disponíveis</Label>
              <div className="flex flex-wrap gap-3">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((dia) => (
                  <button
                    key={dia}
                    onClick={() => toggleArray('diasSemana', dia)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                      formData.diasSemana.includes(dia)
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-amber-300 text-gray-700'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    {dia}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fotos e Portfólio</h2>
              <p className="text-gray-600">Mostre seu trabalho com imagens de qualidade</p>
            </div>

            {/* Logo */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Logo ou Foto de Perfil</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-600 mb-2">Arraste uma imagem ou clique para selecionar</p>
                <p className="text-sm text-gray-400">JPG, PNG ou GIF. Máximo 5MB</p>
                <Button variant="outline" className="mt-4 border-amber-200 text-amber-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </Button>
              </div>
            </div>

            {/* Galeria de Fotos */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Galeria de Fotos</Label>
              <p className="text-sm text-gray-500 mb-4">
                Adicione fotos dos seus pratos, eventos realizados, sua equipe, etc. 
                Fotos de qualidade aumentam em até 3x suas chances de ser contratado.
              </p>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Upload Card */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-400 transition-colors cursor-pointer aspect-square flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <>
                      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
                      <p className="text-sm text-amber-600">Enviando...</p>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Adicionar foto</p>
                    </>
                  )}
                </div>
                
                {/* Uploaded Photos */}
                {(formData.fotos || []).map((foto: string, index: number) => (
                  <div key={index} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100">
                    <img src={foto} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeFoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
                
                {/* Placeholder Photos (when no uploads yet) */}
                {(!formData.fotos || formData.fotos.length === 0) && [1, 2, 3].map((i) => (
                  <div key={`placeholder-${i}`} className="relative rounded-xl overflow-hidden aspect-square bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview do Perfil */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {tipoPessoa === 'pf' ? formData.nome : formData.nomeFantasia || formData.razaoSocial}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formData.especialidades.slice(0, 3).join(', ')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">Novo perfil</span>
                    </div>
                  </div>
                </div>
                
                {formData.slogan && (
                  <p className="text-amber-700 italic mb-4">"{formData.slogan}"</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {formData.tiposEvento.slice(0, 4).map((tipo) => {
                    const tipoInfo = tiposEvento.find(t => t.id === tipo);
                    return (
                      <Badge key={tipo} variant="secondary" className="bg-white">
                        {tipoInfo?.icon} {tipoInfo?.label}
                      </Badge>
                    );
                  })}
                  {formData.tiposEvento.length > 4 && (
                    <Badge variant="secondary" className="bg-white">
                      +{formData.tiposEvento.length - 4}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Cadastro de Profissional
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                      <s.icon className="w-5 h-5" />
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
                    className={`w-12 md:w-24 h-0.5 mx-2 ${
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl shadow-amber-900/5">
          <CardContent className="p-8">
            {/* Mensagens de erro/sucesso */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>Cadastro concluído!</strong> Seu perfil profissional foi criado com sucesso. 
                  Redirecionando...
                </AlertDescription>
              </Alert>
            )}
            
            {/* Social Login - Google */}
            {step === 1 && !isOAuth && (
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
                className="border-gray-200"
                disabled={loading || success}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? 'Voltar para Home' : 'Voltar'}
              </Button>
              
              {step < 6 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!isStepValid() || loading || success}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || success}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Finalizar Cadastro
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Precisa de ajuda?{' '}
          <a href="#" className="text-amber-600 hover:underline">
            Fale com nosso suporte
          </a>
        </p>
      </main>
    </div>
  );
}
