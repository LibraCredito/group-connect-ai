import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
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
      component: () => <div className="p-6"><h1 className="text-2xl font-bold">Gestão de Usuários do Grupo - Em desenvolvimento</h1></div>,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="powerbi" className="w-full">
          <TabsList className="flex w-full bg-white shadow-sm border border-gray-200 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center space-x-2 whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default UserPortalLayout;