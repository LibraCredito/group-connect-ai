
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import PortalHeader from './PortalHeader';
import PowerBI from '@/pages/portal/PowerBI';
import FormProposal from '@/pages/portal/FormProposal';
import Simulator from '@/pages/portal/Simulator';
import News from '@/pages/portal/News';
import Materials from '@/pages/portal/Materials';
import {
  BarChart3,
  FileText,
  Calculator,
  Newspaper,
  BookOpen,
  Users,
} from 'lucide-react';

const UserPortalLayout = () => {
  const { user } = useAuth();

  const tabs = [
    { id: 'powerbi', label: 'Power BI', icon: BarChart3, component: PowerBI },
    { id: 'form', label: 'Formulário de Proposta', icon: FileText, component: FormProposal },
    { id: 'simulator', label: 'Simulador', icon: Calculator, component: Simulator },
    { id: 'news', label: 'Notícias', icon: Newspaper, component: News },
    { id: 'materials', label: 'Material de Apoio', icon: BookOpen, component: Materials },
  ];

  // Adicionar aba de gerenciar usuários se for coordenador
  if (user?.role === 'coordinator') {
    tabs.push({
      id: 'manage-users',
      label: 'Gerenciar Usuários',
      icon: Users,
      component: () => (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Gestão de Usuários do Grupo - Em desenvolvimento</h1>
        </div>
      ),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader />
      
      <div className="w-full px-4 py-6">
        <Tabs defaultValue="powerbi" className="w-full">
          <TabsList className="w-full bg-white shadow-sm border border-gray-200 mb-6 h-auto p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:flex xl:justify-center gap-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center justify-center space-y-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md min-h-[60px] flex-1 xl:flex-none xl:min-w-[140px]"
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs leading-tight text-center">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="w-full">
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0 w-full">
                <div className="w-full max-w-none">
                  <tab.component />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserPortalLayout;
