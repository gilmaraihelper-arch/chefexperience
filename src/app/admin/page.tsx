'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ChefHat, Users, Calendar, DollarSign, TrendingUp, TrendingDown,
  Search, CheckCircle2, XCircle, Download, FileText, Settings, Bell,
  BarChart3, Activity, Eye, Edit, Trash2, Lock, UserPlus, Flag,
  MessageSquare, Package, Clock, ChevronRight, LogOut, Menu,
  Tag, Plus, Crown, Star, Building2, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Types
interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  createdAt: string;
  lastLoginAt?: string | null;
  avatar?: string;
}

interface KPIData {
  totalUsers: { value: number; change: number; trend: 'up' | 'down' };
  totalProfessionals: { value: number; change: number; trend: 'up' | 'down' };
  totalEvents: { value: number; change: number; trend: 'up' | 'down' };
  totalRevenue: { value: number; change: number; trend: 'up' | 'down' };
}

const mockKPI = {
  totalUsers: { value: 2847, change: 12.5, trend: 'up' as const },
  totalProfessionals: { value: 456, change: 8.3, trend: 'up' as const },
  totalEvents: { value: 1234, change: 23.1, trend: 'up' as const },
  totalRevenue: { value: 158900, change: 15.7, trend: 'up' as const },
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [kpis, setKpis] = useState<KPIData>(mockKPI);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Auth check
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
  }, [status, session, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const data = await usersRes.json();
        const mappedUsers = data.users.map((u: any) => ({
          id: u.id,
          name: u.name || u.email.split('@')[0],
          email: u.email,
          type: u.type || 'CLIENT',
          status: u.isActive === false ? 'inactive' : 'active',
          createdAt: u.createdAt,
          lastLoginAt: u.lastLoginAt,
          avatar: (u.name || u.email).split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
        }));
        setUsers(mappedUsers);
      }

      // Load dashboard stats
      const dashRes = await fetch('/api/admin/dashboard');
      if (dashRes.ok) {
        const data = await dashRes.json();
        if (data.stats) {
          setKpis({
            totalUsers: { 
              value: data.stats.users?.total ?? 0, 
              change: 12.5, 
              trend: 'up' 
            },
            totalProfessionals: { 
              value: data.stats.users?.professionals ?? 0, 
              change: 8.3, 
              trend: 'up' 
            },
            totalEvents: { 
              value: data.stats.events?.total ?? 0, 
              change: 23.1, 
              trend: 'up' 
            },
            totalRevenue: { 
              value: data.stats.proposals?.totalValue ?? 0, 
              change: 15.7, 
              trend: 'up' 
            },
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;
    
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        if (selectedUser?.id === userId) {
          setShowUserModal(false);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
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
        setUsers(users.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const KPICard = ({ title, value, change, trend, icon: Icon, prefix = '' }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{change > 0 ? '+' : ''}{change}% vs mês anterior</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'professionals', label: 'Profissionais', icon: ChefHat },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'plans', label: 'Planos', icon: Package },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

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
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-20`}>
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
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Total Usuários" value={kpis.totalUsers.value} change={kpis.totalUsers.change} trend={kpis.totalUsers.trend} icon={Users} />
                <KPICard title="Profissionais" value={kpis.totalProfessionals.value} change={kpis.totalProfessionals.change} trend={kpis.totalProfessionals.trend} icon={ChefHat} />
                <KPICard title="Eventos" value={kpis.totalEvents.value} change={kpis.totalEvents.change} trend={kpis.totalEvents.trend} icon={Calendar} />
                <KPICard title="Receita Total" value={kpis.totalRevenue.value} change={kpis.totalRevenue.change} trend={kpis.totalRevenue.trend} icon={DollarSign} prefix="R$ " />
              </div>

              {/* Recent Users */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">Usuários Recentes</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')}>
                    Ver todos <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => { setSelectedUser(user); setShowUserModal(true); }}>
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
                          <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Badge variant="outline">{user.type === 'CLIENT' ? 'Cliente' : user.type === 'PROFESSIONAL' ? 'Profissional' : 'Admin'}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar por nome, email..." className="pl-10" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline"><Download className="w-4 h-4 mr-2" />Exportar</Button>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-600"><UserPlus className="w-4 h-4 mr-2" />Novo</Button>
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
                            <Badge variant="outline">{user.type === 'CLIENT' ? 'Cliente' : user.type === 'PROFESSIONAL' ? 'Profissional' : 'Admin'}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                              {user.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => { setSelectedUser(user); setShowUserModal(true); }}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleToggleUserStatus(user)}>
                                <Lock className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteUser(user.id)}>
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

          {activeTab === 'professionals' && (
            <div className="text-center py-20">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Gerenciamento de profissionais em desenvolvimento</p>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Gerenciamento de eventos em desenvolvimento</p>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="text-center py-20">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Financeiro em desenvolvimento</p>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Gerenciamento de planos em desenvolvimento</p>
            </div>
          )}

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
                  <p className="font-medium">{selectedUser.type === 'CLIENT' ? 'Cliente' : selectedUser.type === 'PROFESSIONAL' ? 'Profissional' : 'Admin'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedUser.status === 'active' ? 'Ativo' : 'Inativo'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Cadastro</p>
                  <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Último Acesso</p>
                  <p className="font-medium">{selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleDateString('pt-BR') : 'Nunca'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleToggleUserStatus(selectedUser)}
                >
                  {selectedUser.status === 'active' ? <Lock className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
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
    </div>
  );
}
