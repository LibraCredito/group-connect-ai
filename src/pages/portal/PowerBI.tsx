import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ExternalLink, Info, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PowerBI = () => {
  const { user } = useAuth();
  
  // Simulação de dados do grupo do usuário
  const groupData = {
    name: 'Grupo Região Norte',
    powerbi_link: 'https://powerbi.microsoft.com/exemplo1',
    form_link: 'https://forms.microsoft.com/exemplo1',
  };

  const handleOpenPowerBI = () => {
    if (groupData.powerbi_link) {
      window.open(groupData.powerbi_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenForm = () => {
    if (groupData.form_link) {
      window.open(groupData.form_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard e Formulários</h1>
        <p className="text-gray-600 mt-2">Acompanhe suas propostas e envie novas solicitações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dashboard Power BI */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">Dashboard Power BI</CardTitle>
                <CardDescription className="text-blue-700">
                  Acompanhamento de Propostas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-900">Sobre o Dashboard</h3>
                  <p className="text-sm text-blue-800 mt-1">
                    Visualize métricas, status e análises das suas propostas em tempo real.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleOpenPowerBI}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                disabled={!groupData.powerbi_link}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Dashboard Power BI
              </Button>
            </div>
            
            {!groupData.powerbi_link && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <Info className="h-4 w-4 inline mr-1" />
                  Link não configurado. Entre em contato com o administrador.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulário de Proposta */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-green-900">Formulário de Proposta</CardTitle>
                <CardDescription className="text-green-700">
                  Envie novas propostas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-medium text-green-900">Como funciona</h3>
                  <p className="text-sm text-green-800 mt-1">
                    Preencha o formulário para enviar suas propostas para análise.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleOpenForm}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                disabled={!groupData.form_link}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Formulário
              </Button>
            </div>
            
            {!groupData.form_link && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <Info className="h-4 w-4 inline mr-1" />
                  Link não configurado. Entre em contato com o administrador.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Funcionalidades do Dashboard</CardTitle>
          <CardDescription>O que você pode encontrar no Power BI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">📊 Métricas Principais</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Total de propostas enviadas</li>
                <li>• Taxa de aprovação</li>
                <li>• Valor médio das propostas</li>
                <li>• Tempo médio de análise</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">📈 Análises Avançadas</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Evolução temporal</li>
                <li>• Comparativo por período</li>
                <li>• Ranking de performance</li>
                <li>• Tendências e projeções</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerBI;