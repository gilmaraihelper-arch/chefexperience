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
  Check,
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
import { Label } from '@/components/ui/label';

// =====================
// Types
// =====================

interface DashboardKPI {
  totalUsers: { value: number; change: number; trend: 'up' | 'down' };
  totalProfessionals: { value: number; change: number; trend: 'up' | 'down' };
  totalEvents: { value: number; change: number; trend: 'up' | 'down' };
  totalRevenue: { value: number; change: number; trend: 'up' | 'down' };
  conversionRate: { value: number; change: number; trend: 'up' | 'down' };
  activeToday: { value: number; change: number; trend: 'up' | 'down' };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN' | string;
  status: 'active' | 'inactive' | 'pending' | 'blocked' | string;
  createdAt: string;
  lastLoginAt?: string | null;
  avatar?: string;
}

interface AdminEvent {
  id: string;
  name: string;
  client: string;
  date: string;
  status: 'OPEN' | 'HIRED' | 'COMPLETED' | 'CANCELLED' | string;
  proposals: number;
  value: number | null;
}

interface PendingApproval {
  id: string | number;
  name: string;
  email: string;
  type: 'PF' | 'PJ' | string;
  submittedAt: string;
  documents: boolean;
}

interface RevenuePoint {
  month: string;
  revenue: number;
  events: number;
}

interface PlanDistributionPoint {
  plan: string;
  users: number;
  percentage: number;
}

interface FlaggedContentItem {
  id: string | number;
  type: 'REVIEW' | 'PHOTO' | 'MESSAGE' | string;
  content: string;
  user: string;
  target: string;
  date: string;
  priority: 'low' | 'medium' | 'high' | string;
}

interface AuditLogItem {
  id: string | number;
  action: string;
  user: string;
  target: string;
  details: string;
  date: string;
}

interface SubscriptionPlan {
  id: string;
  planKey: 'FREE' | 'PROFESSIONAL' | 'PREMIUM' | 'ENTERPRISE' | string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxProposalsPerMonth: number;
  maxPortfolioImages: number;
  maxPackages: number;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  users: number;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | string;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  applicablePlans: string[];
  isActive: boolean;
}

interface DashboardApiResponse {
  kpis?: DashboardKPI;
  revenueByMonth?: RevenuePoint[];
  planDistribution?: PlanDistributionPoint[];
  pendingApprovals?: PendingApproval[];
  flaggedContent?: FlaggedContentItem[];
  auditLogs?: AuditLogItem[];
  subscriptionPlans?: SubscriptionPlan[];
  coupons?: Coupon[];
  recentUsers?: AdminUser[];
  recentEvents?: AdminEvent[];
}

// =====================
// Mock defaults (used as fallback while APIs não existem)
// =====================

const mockKPI: DashboardKPI = {
  totalUsers: { value: 2847, change: 12.5, trend: 'up' },
  totalProfessionals: { value: 456, change: 8.3, trend: 'up' },
  totalEvents: { value: 1234, change: 23.1, trend: 'up' },
  totalRevenue: { value: 158900, change: 15.7, trend: 'up' },
  conversionRate: { value: 68.5, change: -2.3, trend: 'down' },
  activeToday: { value: 342, change: 5.2, trend: 'up' },
};

const mockRevenueByMonth: RevenuePoint[] = [
  { month: 'Jan', revenue: 45000, events: 45 },
  { month: 'Fev', revenue: 52000, events: 52 },
  { month: 'Mar', revenue: 48000, events: 48 },
  { month: 'Abr', revenue: 61000, events: 61 },
  { month: 'Mai', revenue: 58000, events: 58 },
  { month: 'Jun', revenue: 72000, events: 72 },
];

const mockPlanDistribution: PlanDistributionPoint[] = [
  { plan: 'Gratuito', users: 1800, percentage: 63 },
  { plan: 'Profissional', users: 650, percentage: 23 },
  { plan: 'Premium', users: 320, percentage: 11 },
  { plan: 'Empresa', users: 77, percentage: 3 },
];

const mockPendingApprovals: PendingApproval[] = [
  { id: 1, name: 'Buffet Gourmet Silva', email: 'contato@buffet.com', type: 'PJ', submittedAt: '2026-02-18', documents: true },
  { id: 2, name: 'Chef Patricia Lima', email: 'patricia@chef.com', type: 'PF', submittedAt: '2026-02-17', documents: true },
  { id: 3, name: 'Elite Catering', email: 'elite@catering.com', type: 'PJ', submittedAt: '2026-02-16', documents: false },
];

const mockFlagged: FlaggedContentItem[] = [
  { id: 1, type: 'REVIEW', content: 'Avaliação suspeita - muito genérica', user: 'Cliente Anônimo', target: 'Chef Ricardo', date: '2026-02-19', priority: 'low' },
  { id: 2, type: 'PHOTO', content: 'Foto inapropriada no portfólio', user: 'Buffet XYZ', target: 'Próprio', date: '2026-02-18', priority: 'high' },
  { id: 3, type: 'MESSAGE', content: 'Spam em mensagens', user: 'Profissional A', target: 'Vários clientes', date: '2026-02-17', priority: 'medium' },
];

const mockLogs: AuditLogItem[] = [
  { id: 1, action: 'USER_CREATED', user: 'Admin Principal', target: 'Ana Carolina', details: 'Cliente registrado', date: '2026-02-19 14:30:22' },
  { id: 2, action: 'PROPOSAL_ACCEPTED', user: 'Sistema', target: 'Evento #1234', details: 'Proposta aceita automaticamente', date: '2026-02-19 13:15:00' },
  { id: 3, action: 'USER_BLOCKED', user: 'Admin Principal', target: 'Usuário Suspeito', details: 'Violação de termos', date: '2026-02-19 11:45:33' },
  { id: 4, action: 'PLAN_UPGRADE', user: 'Sistema', target: 'Chef Maria', details: 'Upgrade para Premium', date: '2026-02-19 10:20:15' },
];

const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    planKey: 'FREE',
    name: 'Gratuito',
    description: 'Ideal para quem está começando',
    monthlyPrice: 0,
    yearlyPrice: 0,
    maxProposalsPerMonth: 3,
    maxPortfolioImages: 3,
    maxPackages: 1,
    features: ['3 propostas por mês', '3 fotos no portfólio', '1 pacote de serviços', 'Perfil básico', 'Suporte por email'],
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
    maxProposalsPerMonth: 15,
    maxPortfolioImages: 10,
    maxPackages: 5,
    features: ['15 propostas por mês', '10 fotos no portfólio', '5 pacotes de serviços', 'Perfil destacado', 'Suporte prioritário', 'Estatísticas avançadas', 'Selo Profissional'],
    isActive: true,
    isPopular: true,
    users: 650,
  },
  {
    id: '3',
    planKey: 'PREMIUM',
    name: 'Premium',
    description: 'Máxima visibilidade e recursos',
    monthlyPrice: 99.9,
    yearlyPrice: 999.9,
    maxProposalsPerMonth: 999999,
    maxPortfolioImages: 30,
    maxPackages: 15,
    features: ['Propostas ilimitadas', '30 fotos no portfólio', '15 pacotes de serviços', 'Perfil premium destacado', 'Suporte VIP', 'Estatísticas completas', 'Selo Premium', 'Prioridade nas buscas', 'Link personalizado'],
    isActive: true,
    isPopular: false,
    users: 320,
  },
  {
    id: '4',
    planKey: 'ENTERPRISE',
    name: 'Empresarial',
    description: 'Para empresas e grandes equipes',
    monthlyPrice: 299.9,
    yearlyPrice: 2999.9,
    maxProposalsPerMonth: 999999,
    maxPortfolioImages: 100,
    maxPackages: 50,
    features: ['Tudo do Premium', 'Múltiplos usuários', 'API access', 'Integrações', 'Gerente de conta dedicado', 'Relatórios personalizados', 'White label', 'SLA garantido'],
    isActive: true,
    isPopular: false,
    users: 77,
  },
];

const mockCoupons: Coupon[] = [
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
    maxDiscount: null,
    usageLimit: 50,
    usageCount: 12,
    validFrom: '2026-02-01',
    validUntil: '2026-03-31',
    applicablePlans: ['PREMIUM'],
    isActive: true,
  },
];

// =====================
// UI helpers
// =====================

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
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {typeof change === 'number' && (
              <span>
                {change > 0 ? '+' : ''}
                {change}% vs mês anterior
              </span>
            )}
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

  return (
    <Badge className={styles[status] || 'bg-gray-100 text-gray-600'}>
      {labels[status] || status}
    </Badge>
  );
};

// =====================
// Main page
// =====================

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [revenueByMonth, setRevenueByMonth] = useState<RevenuePoint[]>(mockRevenueByMonth);
  const [planDistribution, setPlanDistribution] = useState<PlanDistributionPoint[]>(mockPlanDistribution);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(mockPendingApprovals);
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContentItem[]>(mockFlagged);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockLogs);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);

  // UI state for modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [userSearch, setUserSearch] = useState('');

  // =====================
  // Auth guard
  // =====================

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

      setAuthChecked(true);
    }
  }, [status, session, router]);

  // =====================
  // Data loading
  // =====================

  useEffect(() => {
    if (!authChecked) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // Dashboard consolidated data
        const dashRes = await fetch('/api/admin/dashboard');
        if (dashRes.ok) {
          const dashJson: DashboardApiResponse & { stats?: any } = await dashRes.json();

          // If backend already returns kpis-like structure, use it; otherwise compose from stats
          if (dashJson.kpis) {
            setKpis(dashJson.kpis);
          } else if (dashJson.stats) {
            const { stats } = dashJson;
            const k: DashboardKPI = {
              totalUsers: {
                value: stats.users?.total ?? 0,
                change: 0,
                trend: 'up',
              },
              totalProfessionals: {
                value: stats.users?.professionals ?? 0,
                change: 0,
                trend: 'up',
              },
              totalEvents: {
                value: stats.events?.total ?? 0,
                change: 0,
                trend: 'up',
              },
              totalRevenue: {
                value: stats.proposals?.totalValue ?? 0,
                change: 0,
                trend: 'up',
              },
              conversionRate: {
                value: 0,
                change: 0,
                trend: 'up',
              },
              activeToday: {
                value: stats.users?.newToday ?? 0,
                change: 0,
                trend: 'up',
              },
            };
            setKpis(k);
          } else {
            setKpis(mockKPI);
          }

          if (dashJson.revenueByMonth?.length) setRevenueByMonth(dashJson.revenueByMonth);
          if (dashJson.planDistribution?.length) setPlanDistribution(dashJson.planDistribution);
          if (dashJson.pendingApprovals?.length) setPendingApprovals(dashJson.pendingApprovals);
          if (dashJson.flaggedContent?.length) setFlaggedContent(dashJson.flaggedContent);
          if (dashJson.auditLogs?.length) setAuditLogs(dashJson.auditLogs);
          if (dashJson.subscriptionPlans?.length) setSubscriptionPlans(dashJson.subscriptionPlans);
          if (dashJson.coupons?.length) setCoupons(dashJson.coupons);
          if (dashJson.recentUsers?.length) setUsers(dashJson.recentUsers);
          if (dashJson.recentEvents?.length) setEvents(dashJson.recentEvents);
        } else {
          setKpis(mockKPI);
        }

        // Users list (for full Users tab & actions)
        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const { users: apiUsers } = await usersRes.json();
          const mappedUsers: AdminUser[] = apiUsers.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            type: u.type ?? 'CLIENT',
            status: u.isActive === false ? 'inactive' : 'active',
            createdAt: u.createdAt,
            lastLoginAt: u.lastLoginAt ?? null,
            avatar: (u.name || u.email || '')
              .split(' ')
              .slice(0, 2)
              .map((p: string) => p[0])
              .join('')
              .toUpperCase(),
          }));
          setUsers(mappedUsers);
        }

        // Events (optional, keep mock if route doesn't exist)
        try {
          const eventsRes = await fetch('/api/admin/events');
          if (eventsRes.ok) {
            const { events: apiEvents } = await eventsRes.json();
            const mappedEvents: AdminEvent[] = apiEvents.map((e: any) => ({
              id: e.id,
              name: e.name,
              client: e.clientName ?? e.client ?? 'Cliente',
              date: e.date,
              status: e.status,
              proposals: e.proposalsCount ?? 0,
              value: e.value ?? null,
            }));
            setEvents(mappedEvents);
          }
        } catch (e) {
          // ignore
        }
      } catch (error) {
        console.error('Erro ao carregar dados do admin:', error);
        if (!kpis) setKpis(mockKPI);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authChecked]);

  // =====================
  // Actions
  // =====================

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleViewEvent = (event: AdminEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponModal(true);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isActive: user.status !== 'active' }),
      });

      if (res.ok) {
        const updated = users.map((u) =>
          u.id === user.id ? { ...u, status: user.status === 'active' ? 'inactive' : 'active' } : u,
        );
        setUsers(updated);
      }
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      }
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
    }
  };

  // =====================
  // Derived data
  // =====================

  const recentUsers = users.slice(0, 5);
  const recentEvents = events.slice(0, 5);

  const filteredUsers = users.filter((user) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q)
    );
  });

  // =====================
  // Loading state
  // =====================

  if (status === 'loading' || !authChecked || loading || !kpis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

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
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`$${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-20`}
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
                onClick={() => setShowNotificationModal(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                  AD
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin Principal</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
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
                  value={`${kpis.conversionRate.value}%`}
                  change={kpis.conversionRate.change}
                  trend={kpis.conversionRate.trend}
                  icon={TrendingUp}
                />
                <KPICard
                  title="Ativos Hoje"
                  value={kpis.activeToday.value}
                  change={kpis.activeToday.change}
                  trend={kpis.activeToday.trend}
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
                      {revenueByMonth.map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all hover:from-amber-600 hover:to-orange-500"
                            style={{ height: `${(item.revenue / 80000) * 200}px` }}
                          />
                          <span className="text-xs text-gray-500">{item.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Total 2026</p>
                        <p className="text-xl font-bold text-gray-900">
                          R${' '}
                          {revenueByMonth
                            .reduce((acc, cur) => acc + cur.revenue, 0)
                            .toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Média/Mês</p>
                        <p className="text-xl font-bold text-amber-600">
                          R${' '}
                          {(
                            revenueByMonth.reduce((acc, cur) => acc + cur.revenue, 0) /
                            (revenueByMonth.length || 1)
                          ).toLocaleString('pt-BR')}
                        </p>
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
                      {planDistribution.map((plan, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{plan.plan}</span>
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
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')}>
                      Ver todos
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => handleViewUser(user)}
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
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('events')}>
                      Ver todos
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => handleViewEvent(event)}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{event.name}</p>
                            <p className="text-sm text-gray-500">
                              {event.client} • {new Date(event.date).toLocaleDateString('pt-BR')}
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
                    <Badge className="bg-amber-500 text-white">{pendingApprovals.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingApprovals.map((prof) => (
                      <div
                        key={prof.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                            <ChefHat className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{prof.name}</p>
                            <p className="text-sm text-gray-500">
                              {prof.email} •{' '}
                              {prof.type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Enviado em{' '}
                              {new Date(prof.submittedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!prof.documents && (
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
                    <Input
                      placeholder="Buscar por nome, email..."
                      className="pl-10"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
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
                  <Select defaultValue="all">
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
                      {filteredUsers.map((user) => (
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
                              : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleViewUser(user)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/admin/users/${user.id}`)}
                              >
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
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user)}
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

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar eventos..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
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
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewEvent(event)}
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

          {/* FINANCE TAB (mock, funcional apenas visualmente) */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                  <CardContent className="p-6">
                    <p className="text-white/80 text-sm">Receita Total</p>
                    <p className="text-3xl font-bold">
                      R$ {kpis.totalRevenue.value.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-white/60 text-sm mt-1">+15,7% vs mês anterior</p>
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
                        <TableCell className="text-right font-semibold">R$ 15.000</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">Confirmado</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>18/02/2026</TableCell>
                        <TableCell>Assinatura Premium</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>Buffet Silva</TableCell>
                        <TableCell className="text-right font-semibold">R$ 149</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">Confirmado</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>17/02/2026</TableCell>
                        <TableCell>Pagamento Evento #1233</TableCell>
                        <TableCell>João Paulo</TableCell>
                        <TableCell>Catering Elite</TableCell>
                        <TableCell className="text-right font-semibold">R$ 8.500</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-700">Pendente</Badge>
                        </TableCell>
                      </TableRow>
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
                    <Badge className="bg-red-500 text-white">{flaggedContent.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {flaggedContent.map((item) => (
                      <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
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
                              <span className="text-sm text-gray-500">{item.date}</span>
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
                          <TableCell className="text-sm text-gray-500">{log.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {log.action === 'USER_CREATED' && 'Criação de Usuário'}
                              {log.action === 'PROPOSAL_ACCEPTED' && 'Proposta Aceita'}
                              {log.action === 'USER_BLOCKED' && 'Usuário Bloqueado'}
                              {log.action === 'PLAN_UPGRADE' && 'Upgrade de Plano'}
                              {!['USER_CREATED', 'PROPOSAL_ACCEPTED', 'USER_BLOCKED', 'PLAN_UPGRADE'].includes(
                                log.action,
                              ) && log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell className="font-medium">{log.target}</TableCell>
                          <TableCell className="text-sm text-gray-500">{log.details}</TableCell>
                        </TableRow>
                      ))}
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
                  <p className="text-gray-500">Gerencie os planos disponíveis para profissionais</p>
                </div>
                <Button
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                  onClick={() => {
                    setSelectedPlan(null);
                    setShowPlanModal(true);
                  }}
                >
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
                            <p className="text-sm text-gray-500">{plan.users} usuários</p>
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
                            {plan.maxProposalsPerMonth === 999999
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
                          onClick={() => handleEditPlan(plan)}
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
                  <p className="text-gray-500">Gerencie cupons promocionais</p>
                </div>
                <Button
                  className="bg-gradient-to-r from-amber-500 to-orange-600"
                  onClick={() => {
                    setSelectedCoupon(null);
                    setShowCouponModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cupom
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Buscar cupons..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Desconto</TableHead>
                        <TableHead>Uso</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-amber-500" />
                              <span className="font-mono font-bold text-gray-900">
                                {coupon.code}
                              </span>
                              <button
                                onClick={() => handleCopyCode(coupon.code)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {copiedCode === coupon.code ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {coupon.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Percent className="w-4 h-4 text-green-500" />
                              <span className="font-semibold">
                                {coupon.discountType === 'PERCENTAGE'
                                  ? `${coupon.discountValue}%`
                                  : `R$ ${coupon.discountValue.toFixed(2)}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {coupon.usageCount} / {coupon.usageLimit || '∞'}
                            </span>
                            <div className="w-20 bg-gray-100 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-amber-500 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (coupon.usageCount / (coupon.usageLimit || 100)) * 100,
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">
                              até{' '}
                              {new Date(coupon.validUntil).toLocaleDateString('pt-BR')}
                            </span>
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
                                onClick={() => handleEditCoupon(coupon)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600"
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
        </div>
      </main>

      {/* User Detail Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={selectedUser.status} />
                    <Badge variant="outline">
                      {selectedUser.type === 'CLIENT'
                        ? 'Cliente'
                        : selectedUser.type === 'PROFESSIONAL'
                        ? 'Profissional'
                        : 'Admin'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Cadastrado em</p>
                  <p className="font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Último acesso</p>
                  <p className="font-medium">
                    {selectedUser.lastLoginAt
                      ? new Date(selectedUser.lastLoginAt).toLocaleDateString('pt-BR')
                      : '—'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600"
                  onClick={() => router.push(`/admin/users/${selectedUser.id}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Usuário
                </Button>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600"
                  onClick={() => handleToggleUserStatus(selectedUser)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {selectedUser.status === 'active' ? 'Bloquear' : 'Reativar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Detail Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Evento</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={selectedEvent.status} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{selectedEvent.name}</h3>
                <p className="text-gray-500">Cliente: {selectedEvent.client}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Data do Evento</p>
                  <p className="font-medium">
                    {new Date(selectedEvent.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Propostas Recebidas</p>
                  <p className="font-medium">{selectedEvent.proposals}</p>
                </div>
                {selectedEvent.value && (
                  <div className="p-4 bg-green-50 rounded-lg col-span-2">
                    <p className="text-sm text-gray-500">Valor Contratado</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {selectedEvent.value.toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Propostas
                </Button>
                {selectedEvent.status !== 'CANCELLED' && (
                  <Button variant="outline" className="border-red-300 text-red-600">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelar Evento
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Notificação em Massa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Destinatários</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  <SelectItem value="clients">Apenas clientes</SelectItem>
                  <SelectItem value="professionals">Apenas profissionais</SelectItem>
                  <SelectItem value="admins">Apenas administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título</Label>
              <Input placeholder="Título da notificação" />
            </div>
            <div>
              <Label>Mensagem</Label>
              <Textarea placeholder="Digite a mensagem..." rows={4} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="email" />
              <Label htmlFor="email">Enviar também por e-mail</Label>
            </div>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600">
              <Bell className="w-4 h-4 mr-2" />
              Enviar Notificação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plan Edit Modal */}
      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Plano</Label>
                  <Input defaultValue={selectedPlan.name} />
                </div>
                <div>
                  <Label>Chave do Plano</Label>
                  <Input defaultValue={selectedPlan.planKey} disabled />
                </div>
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea defaultValue={selectedPlan.description} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço Mensal (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={selectedPlan.monthlyPrice}
                  />
                </div>
                <div>
                  <Label>Preço Anual (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={selectedPlan.yearlyPrice}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Propostas/Mês</Label>
                  <Input
                    type="number"
                    defaultValue={
                      selectedPlan.maxProposalsPerMonth === 999999
                        ? ''
                        : selectedPlan.maxProposalsPerMonth
                    }
                    placeholder="Ilimitado"
                  />
                </div>
                <div>
                  <Label>Fotos</Label>
                  <Input type="number" defaultValue={selectedPlan.maxPortfolioImages} />
                </div>
                <div>
                  <Label>Pacotes</Label>
                  <Input type="number" defaultValue={selectedPlan.maxPackages} />
                </div>
              </div>
              <div>
                <Label>Recursos (um por linha)</Label>
                <Textarea defaultValue={selectedPlan.features.join('\n')} rows={6} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="planActive" defaultChecked={selectedPlan.isActive} />
                  <Label htmlFor="planActive">Plano ativo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="planPopular" defaultChecked={selectedPlan.isPopular} />
                  <Label htmlFor="planPopular">Marcar como popular</Label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={() => setShowPlanModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Coupon Edit/Create Modal */}
      <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCoupon ? 'Editar Cupom' : 'Novo Cupom'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Código</Label>
              <Input
                placeholder="EX: PROMO20"
                defaultValue={selectedCoupon?.code}
                className="font-mono uppercase"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição do cupom..."
                defaultValue={selectedCoupon?.description}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Desconto</Label>
                <Select
                  defaultValue={selectedCoupon?.discountType || 'PERCENTAGE'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Porcentagem (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor do Desconto</Label>
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={selectedCoupon?.discountValue}
                  placeholder={
                    selectedCoupon?.discountType === 'PERCENTAGE'
                      ? '20'
                      : '50.00'
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valor Mínimo (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={selectedCoupon?.minOrderValue}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Desconto Máximo (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={selectedCoupon?.maxDiscount ?? undefined}
                  placeholder="Ilimitado"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Limite de Uso</Label>
                <Input
                  type="number"
                  defaultValue={selectedCoupon?.usageLimit ?? undefined}
                  placeholder="Ilimitado"
                />
              </div>
              <div>
                <Label>Validade</Label>
                <Input
                  type="date"
                  defaultValue={
                    selectedCoupon?.validUntil
                      ? selectedCoupon.validUntil.split('T')[0]
                      : '2026-12-31'
                  }
                />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Planos Aplicáveis</Label>
              <div className="flex flex-wrap gap-2">
                {['FREE', 'PROFESSIONAL', 'PREMIUM', 'ENTERPRISE'].map((plan) => (
                  <div key={plan} className="flex items-center gap-1">
                    <Checkbox
                      id={`plan-${plan}`}
                      defaultChecked={selectedCoupon?.applicablePlans?.includes(
                        plan,
                      )}
                    />
                    <Label htmlFor={`plan-${plan}`} className="text-sm cursor-pointer">
                      {plan === 'FREE'
                        ? 'Gratuito'
                        : plan === 'PROFESSIONAL'
                        ? 'Profissional'
                        : plan === 'PREMIUM'
                        ? 'Premium'
                        : 'Empresarial'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="couponActive"
                defaultChecked={selectedCoupon?.isActive ?? true}
              />
              <Label htmlFor="couponActive">Cupom ativo</Label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {selectedCoupon ? 'Salvar Alterações' : 'Criar Cupom'}
              </Button>
              <Button variant="outline" onClick={() => setShowCouponModal(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
