
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Newspaper, FileText, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalUsers: number;
  totalGroups: number;
  totalNews: number;
  totalMaterials: number;
  activeUsers: number;
  recentActivity: Array<{
    action: string;
    user: string;
    time: string;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGroups: 0,
    totalNews: 0,
    totalMaterials: 0,
    activeUsers: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar total de usuários
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*');
      
      if (usersError) throw usersError;

      // Buscar total de grupos
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*');
      
      if (groupsError) throw groupsError;

      // Buscar total de notícias ativas
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .eq('is_active', true);
      
      if (newsError) throw newsError;

      // Buscar total de materiais ativos
      const { data: materialsData, error: materialsError } = await supabase
        .from('materials')
        .select('*')
        .eq('is_active', true);
      
      if (materialsError) throw materialsError;

      // Buscar atividade recente (últimas notícias e materiais criados)
      const { data: recentNewsData } = await supabase
        .from('news')
        .select('*, profiles!news_created_by_fkey(name)')
        .order('created_at', { ascending: false })
        .limit(2);

      const { data: recentMaterialsData } = await supabase
        .from('materials')
        .select('*, profiles!materials_created_by_fkey(name)')
        .order('created_at', { ascending: false })
        .limit(2);

      const recentActivity = [
        ...(recentNewsData || []).map(item => ({
          action: 'Notícia publicada',
          user: item.profiles?.name || 'Usuário',
          time: new Date(item.created_at).toLocaleDateString('pt-BR')
        })),
        ...(recentMaterialsData || []).map(item => ({
          action: 'Material adicionado',
          user: item.profiles?.name || 'Usuário',
          time: new Date(item.created_at).toLocaleDateString('pt-BR')
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

      setStats({
        totalUsers: usersData?.length || 0,
        totalGroups: groupsData?.length || 0,
        totalNews: newsData?.length || 0,
        totalMaterials: materialsData?.length || 0,
        activeUsers: usersData?.filter(user => user.role !== 'admin').length || 0,
        recentActivity,
      });

    } catch (error: any) {
      toast({
        title: 'Erro ao carregar dados do dashboard',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema de gestão de parceiros</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalUsers}</div>
            <p className="text-xs text-blue-600 mt-1">
              Usuários cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Total de Grupos</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.totalGroups}</div>
            <p className="text-xs text-green-600 mt-1">
              Grupos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Usuários Ativos</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.activeUsers}</div>
            <p className="text-xs text-purple-600 mt-1">
              Usuários não-admin
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Notícias</CardTitle>
            <Newspaper className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.totalNews}</div>
            <p className="text-xs text-orange-600 mt-1">
              Notícias ativas
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-900">Materiais</CardTitle>
            <FileText className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-900">{stats.totalMaterials}</div>
            <p className="text-xs text-teal-600 mt-1">
              Materiais ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas ações realizadas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">por {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente encontrada</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
