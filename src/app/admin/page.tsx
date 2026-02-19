'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ChefHat,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  FileText,
  Settings,
  Bell,
  BarChart3,
  Activity,
  Eye,
  Edit,
  Trash2,
  Lock,
  UserPlus,
  Flag,
  MessageSquare,
  Package,
  Clock,
  ChevronRight,
  LogOut,
  Menu,
  Tag,
  Percent,
  Plus,
  Copy,
  Crown,
  Star,
  Building2,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// =============================
// Types
// =============================

interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  createdAt: string;
  lastLoginAt?: string | null;
  avatar?: string;
}

interface KPIDataItem {
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface KPIData {
  totalUsers: KPIDataItem;
  totalProfessionals: KPIDataItem;
  totalEvents: KPIDataItem;
  totalRevenue: KPIDataItem;
}

interface AdminDashboardStatsResponse {
  stats?: {
    users?: {
      total?: number;
      professionals?: number;
    };
    events?: {
      total?: number;
    };
    proposals?: {
      totalValue?: number;
    };
  };
}

// =============================
// Mock data (para seções sem API)
// =============================

const fallbackKPI: KPIData = {
  totalUsers: { value: 2847, change: 12.5, trend: 'up' },
  totalProfessionals: { value: 456, change: 8.3, trend: 'up' },
  totalEvents: { value: 1234, change: 23.1, trend: 'up' },
  totalRevenue: { value: 158_900, change: 15.7, trend: 'up' },
};

const revenueByMonth = [
  { month: 'Jan', revenue: 45_000, events: 45 },
  { month: 'Fev', revenue: 52_000, events: 52 },
  { month: 'Mar', revenue: 48_000, events: 48 },
  { month: 'Abr', revenue: 61_000, events: 61 },
  { month: 'Mai', revenue: 58_000, events: 58 },
  { month: 'Jun', revenue: 72_000, events: 72 },
];

const planDistribution = [
  { plan: 'Gratuito', users: 1800, percentage: 63 },
  { plan: 'Profissional', users: 650, percentage: 23 },
  { plan: 'Premium', users: 320, percentage: 11 },
  { plan: 'Empresa', users: 77, percentage: 3 },
];

const mockEvents = [
  { id: 1, name: 'Casamento Ana e Pedro', client: 'Ana Carolina', date: '2026-03-15', status: 'OPEN', proposals: 5, value: null as number | null },
  { id: 2, name: 'Aniversário 40 anos', client: 'Fernanda Lima', date: '2026-02-20', status: 'HIRED', proposals: 3, value: 8_500 },
  { id: 3, name: 'Confraternização XYZ', client: 'Carlos Eduardo', date: '2026-02-10', status: 'COMPLETED', proposals: 8, value: 12_000 },
  { id: 4, name: 'Formatura Medicina', client: 'João Paulo', date: '2026-03-20', status: 'OPEN', proposals: 2, value: null as number | null },
  { id: 5, name: 'Festa Infantil', client: 'Pedro Santos', date: '2026-02-05', status: 'CANCELLED', proposals: 1, value: null as number | null },
];

const subscriptionPlans = [
  {
    id: '1',
    planKey: 'FREE',
    name: 'Gratuito',
    description: 'Ideal para quem está começando',
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxProposalsPerMonth: 5,
    maxPortfolioImages: 3,
    maxPackages: 1,
    features: ['5 propostas por mês', '3 fotos no portfólio', '1 pacote de serviços', 'Perfil básico', 'Suporte por email'],
    isActive: true,
    isPopular: false,
    users: 1800,
  },
  {
    id: '2',
    planKey: 'PROFESSIONAL',
    name: 'Profissional',
    description: 'Para profissionais que querem crescer',
    monthlyPrice: 49.9,
    yearlyPrice: 499.9,
    maxProposalsPerMonth: 50,
    maxPortfolioImages: 10,
    maxPackages: 5,
    features: [
      '50 propostas por mês',
      '10 fotos no portfólio',
      '5 pacotes de serviços',
      'Perfil destacado',
      'Suporte prioritário',
      'Estatísticas avançadas',
      'Selo Profissional',
    ],
    isActive: true,
    isPopular: true,
    users: 650,
  },
  {
    id: '3',
    planKey: 'PREMIUM',
    name: 'Premium',
    description: 'Máxima visibilidade e recursos',
    monthlyPrice: 149.9,
    yearlyPrice: 1499.9,
    maxProposalsPerMonth: 999_999,
    maxPortfolioImages: 30,
    maxPackages: 15,
    features: [
      'Propostas ilimitadas',
      '30 fotos no portfólio',
      '15 pacotes de serviços',
      'Perfil premium destacado',
      'Suporte VIP',
      'Estatísticas completas',
      'Selo Premium',
      'Prioridade nas buscas',
      'Link personalizado',
    ],
    isActive: true,
    isPopular: false,
    users: 320,
  },
  {
    id: '4',
    planKey: 'ENTERPRISE',
    name: 'Empresarial',
    description: 'Para empresas e grandes equipes',
    monthlyPrice: 499.9,
    yearlyPrice: 4999.9,
    maxProposalsPerMonth: 999_999,
    maxPortfolioImages: 100,
    maxPackages: 50,
    features: [
      'Tudo do Premium',
      'Múltiplos usuários',
      'API access',
      'Integrações',
      'Gerente de conta dedicado',
      'Relatórios personalizados',
      'White label',
      'SLA garantido',
    ],
    isActive: true,
    isPopular: false,
    users: 77,
  },
];

const coupons = [
  {
    id: '1',
    code: 'BEMVINDO20',
    description: '20% de desconto para novos usuários',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderValue: 50,
    maxDiscount: 100,
    usageLimit: 100,
    usageCount: 45,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    applicablePlans: ['PROFESSIONAL', 'PREMIUM'],
    isActive: true,
  },
  {
    id: '2',
    code: 'PREMIUM50',
    description: 'R$ 50 off no plano Premium',
    discountType: 'FIXED_AMOUNT',
    discountValue: 50,
    minOrderValue: 99.9,
    maxDiscount: null as number | null,
    usageLimit: 50,
    usageCount: 12,
    validFrom: '2026-02-01',
    validUntil: '2026-03-31',
    applicablePlans: ['PREMIUM'],
    isActive: true,
  },
  {
    id: '3',
    code: 'BLACKFRIDAY',
    description: 'Black Friday - 40% off',
    discountType: 'PERCENTAGE',
    discountValue: 40,
    minOrderValue: 0,
    maxDiscount: 200,
    usageLimit: 500,
    usageCount: 0,
    validFrom: '2026-11-25',
    validUntil: '2026-11-30',
    applicablePlans: ['PROFESSIONAL', 'PREMIUM', 'ENTERPRISE'],
    isActive: false,
  },
  {
    id: '4',
    code: 'PRO30',
    description: '30% off no plano Profissional',
    discountType: 'PERCENTAGE',
    discountValue: 30,
    minOrderValue: 49.9,
    maxDiscount: 50,
    usageLimit: 200,
    usageCount: 89,
    validFrom: '2026-01-15',
    validUntil: '2026-06-30',
    applicablePlans: ['PROFESSIONAL'],
    isActive: true,
  },
];

const flaggedContent = [
  {
    id: 1,
    type: 'REVIEW',
    content: 'Avaliação suspeita - muito genérica',
    user: 'Cliente Anônimo',
    target: 'Chef Ricardo',
    date: '2026-02-19',
    priority: 'low',
  },
  {
    id: 2,
    type: 'PHOTO',
    content: 'Foto inapropriada no portfólio',
    user: 'Buffet XYZ',
    target: 'Próprio',
    date: '2026-02-18',
    priority: 'high',
  },
  {
    id: 3,
    type: 'MESSAGE',
    content: 'Spam em mensagens',
    user: 'Profissional A',
    target: 'Vários clientes',
    date: '2026-02-17',
    priority: 'medium',
  },
];

const auditLogs = [
  {
    id: 1,
    action: 'USER_CREATED',
    user: 'Admin Principal',
    target: 'Ana Carolina',
    details: 'Cliente registrado',
    date: '2026-02-19 14:30:22',
  },
  {
    id: 2,
    action: 'PROPOSAL_ACCEPTED',
    user: 'Sistema',
    target: 'Evento #1234',
    details: 'Proposta aceita automaticamente',
    date: '2026-02-19 13:15:00',
  },
  {
    id: 3,
    action: 'USER_BLOCKED',
    user: 'Admin Principal',
    target: 'Usuário Suspeito',
    details: 'Violação de termos',
    date: '2026-02-19 11:45:33',
  },
  {
    id: 4,
    action: 'PLAN_UPGRADE',
    user: 'Sistema',
    target: 'Chef Maria',
    details: 'Upgrade para Premium',
    date: '2026-02-19 10:20:15',
  },
];

// =============================
// Helper components
// =============================

const KPICard = ({ title, value, change, trend, icon: Icon, prefix = '' }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </p>
          <div
            className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {change > 0 ? '+' : ''}
              {change}% vs mês anterior
            </span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-amber-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-600',
    pending: 'bg-amber-100 text-amber-700',
    blocked: 'bg-red-100 text-red-700',
    OPEN: 'bg-blue-100 text-blue-700',
    HIRED: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
    blocked: 'Bloqueado',
    OPEN: 'Aberto',
    HIRED: 'Contratado',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  };

  return <Badge className={styles[status] || 'bg-gray-100 text-gray-600'}>{labels[status] || status}</Badge>;
};

// =============================
// Page component
// =============================

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState(
    'overview' as
      | 'overview'
      | 'users'
      | 'professionals'
      | 'events'
      | 'finance'
      | 'plans'
      | 'coupons'
      | 'moderation'
      | 'logs'
      | 'settings',
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [kpis, setKpis] = useState<KPIData>(fallbackKPI);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // filtros simples
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [eventsStatusFilter, setEventsStatusFilter] = useState('all');

  const [selectedCouponsIds, setSelectedCouponsIds] = useState<string[]>([]);

  // =============================
  // Auth & data loading
  // =============================

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      if ((session as any)?.user?.type !== 'ADMIN') {
        router.push('/');
        return;
      }
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  const loadData = async () => {
    try {
      setLoading(true);

      // USERS
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const data = await usersRes.json();
        const mappedUsers: AdminUser[] = data.users.map((u: any) => ({
          id: u.id,
          name: u.name || u.email.split('@')[0],
          email: u.email,
          type: u.type || 'CLIENT',
          status: u.isActive === false ? 'inactive' : 'active',
          createdAt: u.createdAt,
          lastLoginAt: u.lastLoginAt,
          avatar: (u.name || u.email)
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        }));
        setUsers(mappedUsers);
      }

      // DASHBOARD
      const dashRes = await fetch('/api/admin/dashboard');
      if (dashRes.ok) {
        const data: AdminDashboardStatsResponse = await dashRes.json();
        if (data.stats) {
          setKpis({
            totalUsers: {
              value: data.stats.users?.total ?? fallbackKPI.totalUsers.value,
              change: fallbackKPI.totalUsers.change,
              trend: fallbackKPI.totalUsers.trend,
            },
            totalProfessionals: {
              value: data.stats.users?.professionals ?? fallbackKPI.totalProfessionals.value,
              change: fallbackKPI.totalProfessionals.change,
              trend: fallbackKPI.totalProfessionals.trend,
            },
            totalEvents: {
              value: data.stats.events?.total ?? fallbackKPI.totalEvents.value,
              change: fallbackKPI.totalEvents.change,
              trend: fallbackKPI.totalEvents.trend,
            },
            totalRevenue: {
              value: data.stats.proposals?.totalValue ?? fallbackKPI.totalRevenue.value,
              change: fallbackKPI.totalRevenue.change,
              trend: fallbackKPI.totalRevenue.trend,
            },
          });
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados do admin:', err);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Actions
  // =============================

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (selectedUser?.id === userId) {
          setShowUserModal(false);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isActive: user.status === 'inactive' }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u,
          ),
        );
        if (selectedUser && selectedUser.id === user.id) {
          setSelectedUser({
            ...selectedUser,
            status: selectedUser.status === 'active' ? 'inactive' : 'active',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  // Buscar usuários de teste específicos
  const handleFindTestUsers = async () => {
    try {
      const res = await fetch('/api/admin/find-test-users');
      if (res.ok) {
        const data = await res.json();
        console.log('Usuários encontrados:', data);
        
        let message = '🔍 RESULTADO DA BUSCA:\n\n';
        
        data.testUsers.forEach((u: any) => {
          if (u.found) {
            message += `✅ ${u.email}\n   Type: ${u.type || 'NULL (incompleto)'}\n   Name: ${u.name || 'NULL'}\n\n`;
          } else {
            message += `❌ ${u.email} - Não encontrado\n\n`;
          }
        });
        
        if (data.allGilmarUsers?.length > 0) {
          message += `\n📋 TODOS OS USUÁRIOS GILMAR:\n`;
          data.allGilmarUsers.forEach((u: any) => {
            message += `- ${u.email} | type: ${u.type || 'NULL'} | name: ${u.name || 'NULL'}\n`;
          });
        }
        
        alert(message);
      }
    } catch (error) {
      console.error('Erro ao buscar:', error);
    }
  };

  // Deletar usuários de teste do gmail
  const handleDeleteTestUsers = async () => {
    const testEmails = [
      'gilmar.guasque@gmail.com',
      'gilmar.meber@gmail.com', 
      'gilmar.ribeiro@bmvagas.com.br'
    ];
    
    if (!confirm(`Deletar ${testEmails.length} usuários de teste?\n\n${testEmails.join('\n')}`)) return;
    
    let deleted = 0;
    let notFound = 0;
    
    for (const email of testEmails) {
      const user = users.find(u => u.email === email);
      if (user) {
        try {
          const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });
          if (res.ok) {
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            deleted++;
          }
        } catch (error) {
          console.error(`Erro ao deletar ${email}:`, error);
        }
      } else {
        notFound++;
      }
    }
    
    alert(`Concluído!\nDeletados: ${deleted}\nNão encontrados: ${notFound}`);
  };

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (e) {
      console.error('Erro ao copiar código do cupom', e);
    }
  };

  const toggleCouponSelected = (id: string) => {
    setSelectedCouponsIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  // derived data
  const filteredUsers = users.filter((u) => {
    if (userTypeFilter !== 'all') {
      if (userTypeFilter === 'client' && u.type !== 'CLIENT') return false;
      if (userTypeFilter === 'professional' && u.type !== 'PROFESSIONAL') return false;
      if (userTypeFilter === 'admin' && u.type !== 'ADMIN') return false;
    }
    if (userStatusFilter !== 'all' && u.status !== userStatusFilter) return false;
    return true;
  });

  const filteredEvents = mockEvents.filter((e) => {
    if (eventsStatusFilter === 'all') return true;
    return e.status === eventsStatusFilter;
  });

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'professionals', label: 'Profissionais', icon: ChefHat },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'plans', label: 'Planos', icon: Package },
    { id: 'coupons', label: 'Cupons', icon: Tag },
    { id: 'moderation', label: 'Moderação', icon: Flag },
    { id: 'logs', label: 'Logs de Auditoria', icon: Activity },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ] as const;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-20`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-gray-900">Chef Admin</span>
                <p className="text-xs text-gray-500">Painel Administrativo</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                {menuItems.find((m) => m.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="relative p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setShowNotificationModal(true)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                  AD
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{session?.user?.email}</p>
                  <p className="text-xs text-gray-500">Super Administrador</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <KPICard
                  title="Total Usuários"
                  value={kpis.totalUsers.value}
                  change={kpis.totalUsers.change}
                  trend={kpis.totalUsers.trend}
                  icon={Users}
                />
                <KPICard
                  title="Profissionais"
                  value={kpis.totalProfessionals.value}
                  change={kpis.totalProfessionals.change}
                  trend={kpis.totalProfessionals.trend}
                  icon={ChefHat}
                />
                <KPICard
                  title="Eventos"
                  value={kpis.totalEvents.value}
                  change={kpis.totalEvents.change}
                  trend={kpis.totalEvents.trend}
                  icon={Calendar}
                />
                <KPICard
                  title="Receita Total"
                  value={kpis.totalRevenue.value}
                  change={kpis.totalRevenue.change}
                  trend={kpis.totalRevenue.trend}
                  icon={DollarSign}
                  prefix="R$ "
                />
                <KPICard
                  title="Taxa Conversão"
                  value={`68,5%`}
                  change={-2.3}
                  trend="down"
                  icon={TrendingUp}
                />
                <KPICard
                  title="Ativos Hoje"
                  value={342}
                  change={5.2}
                  trend="up"
                  icon={Activity}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Receita Mensal</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end gap-2">
                      {revenueByMonth.map((item) => (
                        <div
                          key={item.month}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <div
                            className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all hover:from-amber-600 hover:to-orange-500"
                            style={{ height: `${(item.revenue / 80_000) * 200}px` }}
                          />
                          <span className="text-xs text-gray-500">{item.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Total 2026</p>
                        <p className="text-xl font-bold text-gray-900">R$ 326.000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Média/Mês</p>
                        <p className="text-xl font-bold text-amber-600">R$ 54.333</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Distribution */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Distribuição de Planos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {planDistribution.map((plan) => (
                        <div key={plan.plan}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {plan.plan}
                            </span>
                            <span className="text-sm text-gray-500">
                              {plan.users} usuários ({plan.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full"
                              style={{ width: `${plan.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">R$ 47.500</p>
                          <p className="text-xs text-gray-600">Receita Mensal</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">1.047</p>
                          <p className="text-xs text-gray-600">Assinantes Pagos</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Usuários Recentes</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('users')}
                    >
                      Ver todos
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {users.slice(0, 5).map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                              {user.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={user.status} />
                            <Badge variant="outline">
                              {user.type === 'CLIENT'
                                ? 'Cliente'
                                : user.type === 'PROFESSIONAL'
                                ? 'Profissional'
                                : 'Admin'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Events */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Eventos Recentes</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('events')}
                    >
                      Ver todos
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockEvents.slice(0, 5).map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventModal(true);
                          }}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{event.name}</p>
                            <p className="text-sm text-gray-500">
                              {event.client} •{' '}
                              {new Date(event.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={event.status} />
                            {event.value && (
                              <span className="font-semibold text-amber-600">
                                R$ {event.value.toLocaleString('pt-BR')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Approvals */}
              <Card className="border-amber-200 bg-amber-50/30">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    Aprovações Pendentes
                    <Badge className="bg-amber-500 text-white">3</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((id) => (
                      <div
                        key={id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <ChefHat className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Profissional #{id}
                            </p>
                            <p className="text-sm text-gray-500">
                              profissional{id}@email.com • Pessoa Jurídica
                            </p>
                            <p className="text-xs text-gray-400">
                              Enviado em {new Date('2026-02-1' + id).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {id === 3 && (
                            <Badge
                              variant="outline"
                              className="text-amber-600 border-amber-300"
                            >
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Docs pendentes
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-300 text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar por nome, email..." className="pl-10" />
                  </div>
                  <Select
                    defaultValue="all"
                    onValueChange={(v) => setUserTypeFilter(v)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="client">Clientes</SelectItem>
                      <SelectItem value="professional">Profissionais</SelectItem>
                      <SelectItem value="admin">Administradores</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    defaultValue="all"
                    onValueChange={(v) => setUserStatusFilter(v)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="blocked">Bloqueados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Usuário
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cadastro</TableHead>
                        <TableHead>Último Acesso</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                                {user.avatar}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.type === 'CLIENT'
                                ? 'Cliente'
                                : user.type === 'PROFESSIONAL'
                                ? 'Profissional'
                                : 'Admin'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={user.status} />
                          </TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            {user.lastLoginAt
                              ? new Date(user.lastLoginAt).toLocaleDateString('pt-BR')
                              : 'Nunca'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                <Lock className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                <Lock className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PROFESSIONALS TAB (placeholder visual) */}
          {activeTab === 'professionals' && (
            <div className="text-center py-20">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Gerenciamento de profissionais em desenvolvimento (usa mesma base de
                usuários)
              </p>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar eventos..." className="pl-10" />
                  </div>
                  <Select
                    defaultValue="all"
                    onValueChange={(v) => setEventsStatusFilter(v)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="OPEN">Abertos</SelectItem>
                      <SelectItem value="HIRED">Contratados</SelectItem>
                      <SelectItem value="COMPLETED">Concluídos</SelectItem>
                      <SelectItem value="CANCELLED">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <StatusBadge status={event.status} />
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{event.client}</p>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {event.proposals} propostas
                          </span>
                        </div>
                        {event.value && (
                          <span className="font-semibold text-amber-600">
                            R$ {event.value.toLocaleString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* FINANCE TAB */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                  <CardContent className="p-6">
                    <p className="text-white/80 text-sm">Receita Total</p>
                    <p className="text-3xl font-bold">
                      R$ {kpis.totalRevenue.value.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      +{kpis.totalRevenue.change}% vs mês anterior
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-sm">Receita de Planos</p>
                    <p className="text-3xl font-bold text-gray-900">R$ 47.500</p>
                    <p className="text-green-600 text-sm mt-1">+8,2% vs mês anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-sm">Transações</p>
                    <p className="text-3xl font-bold text-gray-900">1.234</p>
                    <p className="text-gray-400 text-sm mt-1">Este mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-sm">Ticket Médio</p>
                    <p className="text-3xl font-bold text-gray-900">R$ 8.450</p>
                    <p className="text-green-600 text-sm mt-1">+3,1% vs mês anterior</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>19/02/2026</TableCell>
                        <TableCell>Pagamento Evento #1234</TableCell>
                        <TableCell>Ana Carolina</TableCell>
                        <TableCell>Chef Ricardo</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ 15.000
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            Confirmado
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>18/02/2026</TableCell>
                        <TableCell>Assinatura Premium</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>Buffet Silva</TableCell>
                        <TableCell className="text-right font-semibold">R$ 149</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            Confirmado
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>17/02/2026</TableCell>
                        <TableCell>Pagamento Evento #1233</TableCell>
                        <TableCell>João Paulo</TableCell>
                        <TableCell>Catering Elite</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ 8.500
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-700">
                            Pendente
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PLANS TAB */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Planos de Assinatura</h2>
                  <p className="text-gray-500">
                    Gerencie os planos disponíveis para profissionais
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Plano
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`${plan.isPopular ? 'border-amber-400 ring-2 ring-amber-100' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              plan.planKey === 'FREE'
                                ? 'bg-gray-100'
                                : plan.planKey === 'PROFESSIONAL'
                                ? 'bg-blue-100'
                                : plan.planKey === 'PREMIUM'
                                ? 'bg-amber-100'
                                : 'bg-purple-100'
                            }`}
                          >
                            {plan.planKey === 'FREE' && (
                              <Package className="w-6 h-6 text-gray-600" />
                            )}
                            {plan.planKey === 'PROFESSIONAL' && (
                              <Star className="w-6 h-6 text-blue-600" />
                            )}
                            {plan.planKey === 'PREMIUM' && (
                              <Crown className="w-6 h-6 text-amber-600" />
                            )}
                            {plan.planKey === 'ENTERPRISE' && (
                              <Building2 className="w-6 h-6 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-sm text-gray-500">
                              {plan.users} usuários
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {plan.isPopular && (
                            <Badge className="bg-amber-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                          <Badge
                            className={
                              plan.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }
                          >
                            {plan.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{plan.description}</p>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-gray-900">
                          R$ {plan.monthlyPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-500">/mês</span>
                        <span className="text-sm text-gray-400 ml-2">
                          ou R$ {plan.yearlyPrice.toFixed(2)}/ano
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">
                            {plan.maxProposalsPerMonth === 999_999
                              ? '∞'
                              : plan.maxProposalsPerMonth}
                          </p>
                          <p className="text-xs text-gray-500">Propostas/mês</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">
                            {plan.maxPortfolioImages}
                          </p>
                          <p className="text-xs text-gray-500">Fotos</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">
                            {plan.maxPackages}
                          </p>
                          <p className="text-xs text-gray-500">Pacotes</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {feature}
                          </div>
                        ))}
                        {plan.features.length > 5 && (
                          <p className="text-sm text-gray-400">
                            +{plan.features.length - 5} recursos
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowPlanModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Cupons de Desconto</h2>
                  <p className="text-gray-500">
                    Crie, gerencie e monitore cupons de desconto
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cupom
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox
                            checked={selectedCouponsIds.length === coupons.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCouponsIds(coupons.map((c) => c.id));
                              } else {
                                setSelectedCouponsIds([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Cupom</TableHead>
                        <TableHead>Desconto</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Planos</TableHead>
                        <TableHead>Uso</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons.map((coupon) => {
                        const checked = selectedCouponsIds.includes(coupon.id);
                        return (
                          <TableRow key={coupon.id}>
                            <TableCell>
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleCouponSelected(coupon.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-amber-100 text-amber-700">
                                    {coupon.code}
                                  </Badge>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="w-7 h-7"
                                    onClick={() => handleCopyCode(coupon.code)}
                                  >
                                    {copiedCode === coupon.code ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {coupon.description}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {coupon.discountType === 'PERCENTAGE' ? (
                                <span className="flex items-center gap-1">
                                  <Percent className="w-4 h-4 text-emerald-600" />
                                  {coupon.discountValue}%
                                </span>
                              ) : (
                                <span>R$ {coupon.discountValue.toFixed(2)}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-gray-500">
                                <p>
                                  {new Date(coupon.validFrom).toLocaleDateString('pt-BR')} -{' '}
                                  {new Date(coupon.validUntil).toLocaleDateString('pt-BR')}
                                </p>
                                {coupon.minOrderValue > 0 && (
                                  <p>Min. R$ {coupon.minOrderValue.toFixed(2)}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {coupon.applicablePlans.map((plan) => (
                                  <Badge key={plan} variant="outline" className="text-xs">
                                    {plan}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs text-gray-500">
                                <p>
                                  {coupon.usageCount} / {coupon.usageLimit}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  coupon.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                                }
                              >
                                {coupon.isActive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedCoupon(coupon);
                                    setShowCouponModal(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* MODERATION TAB */}
          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Flag className="w-5 h-5" />
                    Conteúdo Sinalizado
                    <Badge className="bg-red-500 text-white">
                      {flaggedContent.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {flaggedContent.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border border-gray-200 rounded-lg flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                className={
                                  item.priority === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : item.priority === 'medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-700'
                                }
                              >
                                {item.type === 'REVIEW'
                                  ? 'Avaliação'
                                  : item.type === 'PHOTO'
                                  ? 'Foto'
                                  : 'Mensagem'}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {item.date}
                              </span>
                            </div>
                            <p className="text-gray-900 font-medium">{item.content}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Por: {item.user} • Alvo: {item.target}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-600"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor={`moderation-notes-${item.id}`} className="text-xs">
                            Notas do moderador
                          </Label>
                          <Textarea
                            id={`moderation-notes-${item.id}`}
                            placeholder="Adicione um comentário sobre esta decisão..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Logs de Auditoria</CardTitle>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Logs
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Alvo</TableHead>
                        <TableHead>Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm text-gray-500">
                            {log.date}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {log.action === 'USER_CREATED' && 'Criação de Usuário'}
                              {log.action === 'PROPOSAL_ACCEPTED' && 'Proposta Aceita'}
                              {log.action === 'USER_BLOCKED' && 'Usuário Bloqueado'}
                              {log.action === 'PLAN_UPGRADE' && 'Upgrade de Plano'}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell className="font-medium">{log.target}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {log.details}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SETTINGS TAB - placeholder visual */}
          {activeTab === 'settings' && (
            <div className="text-center py-20">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Configurações em desenvolvimento</p>
            </div>
          )}
        </div>
      </main>

      {/* User Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">
                    {selectedUser.type === 'CLIENT'
                      ? 'Cliente'
                      : selectedUser.type === 'PROFESSIONAL'
                      ? 'Profissional'
                      : 'Admin'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {selectedUser.status === 'active' ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Cadastro</p>
                  <p className="font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Último Acesso</p>
                  <p className="font-medium">
                    {selectedUser.lastLoginAt
                      ? new Date(selectedUser.lastLoginAt).toLocaleDateString('pt-BR')
                      : 'Nunca'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleToggleUserStatus(selectedUser)}
                >
                  {selectedUser.status === 'active' ? (
                    <Lock className="w-4 h-4 mr-2" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  {selectedUser.status === 'active' ? 'Bloquear' : 'Reativar'}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteUser(selectedUser.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Evento</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">{selectedEvent.name}</h3>
                <p className="text-gray-500">Cliente: {selectedEvent.client}</p>
                <p className="text-gray-500">
                  Data: {new Date(selectedEvent.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    <StatusBadge status={selectedEvent.status} />
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Propostas</p>
                  <p className="font-medium">{selectedEvent.proposals}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Plan Modal (simple read-only mock) */}
      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="plan-name">Nome</Label>
                  <Input id="plan-name" defaultValue={selectedPlan.name} />
                </div>
                <div>
                  <Label htmlFor="plan-desc">Descrição</Label>
                  <Textarea
                    id="plan-desc"
                    rows={3}
                    defaultValue={selectedPlan.description}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="plan-monthly">Preço mensal</Label>
                    <Input
                      id="plan-monthly"
                      type="number"
                      defaultValue={selectedPlan.monthlyPrice}
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan-yearly">Preço anual</Label>
                    <Input
                      id="plan-yearly"
                      type="number"
                      defaultValue={selectedPlan.yearlyPrice}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowPlanModal(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
                  Salvar (mock)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Coupon Modal (simple read-only mock) */}
      <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cupom</DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="coupon-code">Código</Label>
                  <Input id="coupon-code" defaultValue={selectedCoupon.code} />
                </div>
                <div>
                  <Label htmlFor="coupon-desc">Descrição</Label>
                  <Textarea
                    id="coupon-desc"
                    rows={3}
                    defaultValue={selectedCoupon.description}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowCouponModal(false)}>
                  Cancelar
                </Button>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
                  Salvar (mock)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification Modal (simple placeholder) */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notificações</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Novos profissionais aguardando aprovação.</p>
            <p>• 3 novos eventos criados hoje.</p>
            <p>• 1 usuário foi bloqueado por atividade suspeita.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
