
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
        <div className="p-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Gestão de Usuários do Grupo</h1>
          <div className="libra-card p-6">
            <p className="text-gray-600">Esta funcionalidade está em desenvolvimento e será disponibilizada em breve.</p>
          </div>
        </div>
      ),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader />
      
      <div className="w-full px-6 py-8">
        <Tabs defaultValue="powerbi" className="w-full">
          <TabsList className="w-full bg-white shadow-sm border-0 mb-8 h-auto p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:flex xl:justify-center gap-3 rounded-xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center justify-center space-y-2 px-6 py-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl min-h-[70px] flex-1 xl:flex-none xl:min-w-[150px] hover:bg-primary/10"
              >
                <tab.icon className="h-6 w-6" />
                <span className="text-xs leading-tight text-center font-medium">{tab.label}</span>
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
