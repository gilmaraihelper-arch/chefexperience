'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteFooter } from '@/components/layout/Footer';

// Mock data
const resumoFinanceiro = {
  saldoDisponivel: 12580.5,
  saldoPendente: 3450.0,
  totalGanho: 45230.75,
  totalSaques: 32650.25,
  mesAtual: 8450.0,
  mesAnterior: 7200.0,
  variacao: 17.4,
};

const transacoesMock = [
  {
    id: 1,
    tipo: 'recebimento',
    descricao: 'Pagamento - Casamento Ana & Pedro',
    valor: 18500.0,
    data: '2026-05-05',
    status: 'completed',
    metodo: 'Transferência',
  },
  {
    id: 2,
    tipo: 'recebimento',
    descricao: 'Pagamento - Aniversário Fernanda',
    valor: 4200.0,
    data: '2026-05-03',
    status: 'completed',
    metodo: 'PIX',
  },
  {
    id: 3,
    tipo: 'recebimento',
    descricao: 'Pagamento - Evento Corporativo Google',
    valor: 8500.0,
    data: '2026-04-28',
    status: 'completed',
    metodo: 'Transferência',
  },
  {
    id: 4,
    tipo: 'saque',
    descricao: 'Saque para conta bancária',
    valor: -5000.0,
    data: '2026-04-25',
    status: 'completed',
    metodo: 'Transferência',
  },
  {
    id: 5,
    tipo: 'recebimento',
    descricao: 'Pagamento - Churrasco Empresa XYZ',
    valor: 3200.0,
    data: '2026-04-20',
    status: 'pending',
    metodo: 'PIX',
  },
  {
    id: 6,
    tipo: 'taxa',
    descricao: 'Taxa de plataforma - Casamento Ana & Pedro',
    valor: -925.0,
    data: '2026-05-05',
    status: 'completed',
    metodo: 'Débito automático',
  },
  {
    id: 7,
    tipo: 'recebimento',
    descricao: 'Pagamento - Jantar Romântico',
    valor: 1800.0,
    data: '2026-04-15',
    status: 'completed',
    metodo: 'Cartão',
  },
  {
    id: 8,
    tipo: 'saque',
    descricao: 'Saque para conta bancária',
    valor: -3000.0,
    data: '2026-04-10',
    status: 'completed',
    metodo: 'Transferência',
  },
];

const pagamentosPendentes = [
  {
    id: 1,
    evento: 'Casamento Maria & João',
    cliente: 'Maria Silva',
    valor: 22000.0,
    dataPrevista: '2026-05-15',
    status: 'aguardando',
  },
  {
    id: 2,
    evento: 'Festa de Debutante',
    cliente: 'Carla Mendes',
    valor: 8500.0,
    dataPrevista: '2026-05-20',
    status: 'processando',
  },
];

// Simple bar chart component
function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all hover:from-amber-600 hover:to-orange-500"
            style={{ height: `${(item.value / max) * 100}%` }}
          />
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function FinanceiroPage() {
  const router = useRouter();
  const [filtroPeriodo, setFiltroPeriodo] = useState<'7d' | '30d' | '90d' | '1a'>('30d');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'recebimento' | 'saque' | 'taxa'>('todos');

  const dadosGrafico = [
    { label: 'Jan', value: 5200 },
    { label: 'Fev', value: 6800 },
    { label: 'Mar', value: 6100 },
    { label: 'Abr', value: 7200 },
    { label: 'Mai', value: 8450 },
    { label: 'Jun', value: 0 },
  ];

  const transacoesFiltradas =
    filtroTipo === 'todos'
      ? transacoesMock
      : transacoesMock.filter((t) => t.tipo === filtroTipo);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'processando':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
            <Clock className="w-3 h-3 mr-1" />
            Processando
          </Badge>
        );
      case 'aguardando':
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">
            <AlertCircle className="w-3 h-3 mr-1" />
            Aguardando
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
              <p className="text-sm text-gray-600">Gerencie seus ganhos e saques</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-amber-200 text-amber-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                <Wallet className="w-4 h-4 mr-2" />
                Solicitar Saque
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards Resumo */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-amber-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                  Disponível
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(resumoFinanceiro.saldoDisponivel)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Saldo disponível para saque</div>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
                  Pendente
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(resumoFinanceiro.saldoPendente)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Pagamentos em processamento</div>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  {resumoFinanceiro.variacao}%
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(resumoFinanceiro.mesAtual)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Ganhos este mês</div>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(resumoFinanceiro.totalGanho)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Total ganho na plataforma</div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico + Pagamentos Pendentes */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico */}
          <Card className="border-amber-100 lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Evolução de Ganhos</CardTitle>
                <div className="flex gap-1">
                  {(['7d', '30d', '90d', '1a'] as const).map((periodo) => (
                    <button
                      key={periodo}
                      onClick={() => setFiltroPeriodo(periodo)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        filtroPeriodo === periodo
                          ? 'bg-amber-100 text-amber-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {periodo === '7d' && '7 dias'}
                      {periodo === '30d' && '30 dias'}
                      {periodo === '90d' && '3 meses'}
                      {periodo === '1a' && '1 ano'}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={dadosGrafico} />
            </CardContent>
          </Card>

          {/* Pagamentos Pendentes */}
          <Card className="border-amber-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Pagamentos a Receber
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pagamentosPendentes.map((pagamento) => (
                <div
                  key={pagamento.id}
                  className="p-4 bg-amber-50 rounded-xl border border-amber-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {pagamento.evento}
                      </div>
                      <div className="text-xs text-gray-500">{pagamento.cliente}</div>
                    </div>
                    <div className="text-lg font-bold text-amber-600">
                      {formatCurrency(pagamento.valor)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Previsto: {formatDate(pagamento.dataPrevista)}
                    </div>
                    {getStatusBadge(pagamento.status)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Transações */}
        <Card className="border-amber-100">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg">Histórico de Transações</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filtroTipo}
                  onChange={(e) =>
                    setFiltroTipo(e.target.value as 'todos' | 'recebimento' | 'saque' | 'taxa')
                  }
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="todos">Todos</option>
                  <option value="recebimento">Recebimentos</option>
                  <option value="saque">Saques</option>
                  <option value="taxa">Taxas</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Descrição
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Data
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Método
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transacoesFiltradas.map((transacao) => (
                    <tr
                      key={transacao.id}
                      className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              transacao.tipo === 'recebimento'
                                ? 'bg-green-100'
                                : transacao.tipo === 'saque'
                                ? 'bg-red-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            {transacao.tipo === 'recebimento' && (
                              <ArrowDownRight className="w-4 h-4 text-green-600" />
                            )}
                            {transacao.tipo === 'saque' && (
                              <ArrowUpRight className="w-4 h-4 text-red-600" />
                            )}
                            {transacao.tipo === 'taxa' && (
                              <TrendingDown className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                          <span className="text-sm text-gray-900">{transacao.descricao}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(transacao.data)}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="text-xs">
                          {transacao.metodo}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(transacao.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`text-sm font-semibold ${
                            transacao.valor > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transacao.valor > 0 ? '+' : ''}
                          {formatCurrency(transacao.valor)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <SiteFooter />
    </div>
  );
}
