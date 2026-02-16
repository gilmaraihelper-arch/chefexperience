'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ChefHat, 
  ArrowLeft, 
  Star, 
  Send,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CriterioAvaliacao {
  id: string;
  label: string;
  nota: number;
}

export default function AvaliarProfissionalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventoId = searchParams.get('evento');
  const profissionalId = searchParams.get('profissional');
  
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [profissional, setProfissional] = useState<any>(null);
  
  const [criterios, setCriterios] = useState<CriterioAvaliacao[]>([
    { id: 'foodQuality', label: 'Qualidade da comida', nota: 0 },
    { id: 'serviceQuality', label: 'Qualidade do serviço', nota: 0 },
    { id: 'punctuality', label: 'Pontualidade', nota: 0 },
    { id: 'communication', label: 'Comunicação', nota: 0 },
    { id: 'valueForMoney', label: 'Custo-benefício', nota: 0 },
  ]);
  
  const [comentario, setComentario] = useState('');
  const [notaGeral, setNotaGeral] = useState(0);

  useEffect(() => {
    if (!eventoId || !profissionalId) {
      router.push('/dashboard/cliente');
      return;
    }
    // Aqui poderia buscar dados do profissional
  }, [eventoId, profissionalId, router]);

  const handleNotaChange = (criterioId: string, nota: number) => {
    const novosCriterios = criterios.map(c => 
      c.id === criterioId ? { ...c, nota } : c
    );
    setCriterios(novosCriterios);
    
    const notasPreenchidas = novosCriterios.filter(c => c.nota > 0);
    if (notasPreenchidas.length > 0) {
      const media = notasPreenchidas.reduce((acc, c) => acc + c.nota, 0) / notasPreenchidas.length;
      setNotaGeral(Math.round(media));
    }
  };

  const handleEnviar = async () => {
    const token = localStorage.getItem('token');
    if (!token || !profissionalId || !eventoId) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const dadosAvaliacao = {
        professionalId: profissionalId,
        eventId: eventoId,
        foodQuality: criterios.find(c => c.id === 'foodQuality')?.nota,
        serviceQuality: criterios.find(c => c.id === 'serviceQuality')?.nota,
        punctuality: criterios.find(c => c.id === 'punctuality')?.nota,
        communication: criterios.find(c => c.id === 'communication')?.nota,
        valueForMoney: criterios.find(c => c.id === 'valueForMoney')?.nota,
        overall: notaGeral,
        comment: comentario,
      };

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAvaliacao),
      });

      if (res.ok) {
        setEnviado(true);
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
    } finally {
      setLoading(false);
    }
  };

  const todasNotasPreenchidas = criterios.every(c => c.nota > 0);

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Avaliação Enviada!</h2>
            <p className="text-gray-600 mb-6">Obrigado por avaliar o profissional. Sua opinião ajuda outros clientes!</p>
            
            <Link href="/dashboard/cliente">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                Voltar ao Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <nav className="bg-white border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard/cliente" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Chef Experience
              </span>
            </Link>
            <div className="text-sm text-gray-500">Avaliar</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard/cliente">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Avalie o Profissional</h1>
              <p className="text-gray-600">Compartilhe sua experiência para ajudar outros clientes</p>
            </div>

            <div className="space-y-6">
              {criterios.map((criterio) => (
                <div key={criterio.id} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{criterio.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <button
                        key={estrela}
                        type="button"
                        onClick={() => handleNotaChange(criterio.id, estrela)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            estrela <= criterio.nota
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Nota Geral</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <span className="text-2xl font-bold text-amber-600">{notaGeral}</span>
                    <span className="text-gray-500">/5</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="comentario">Comentário (opcional)</Label>
                <Textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Conte como foi sua experiência com o profissional..."
                  rows={4}
                />
              </div>

              <Button
                onClick={handleEnviar}
                disabled={!todasNotasPreenchidas || loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Avaliação
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}