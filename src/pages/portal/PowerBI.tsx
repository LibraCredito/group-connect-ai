
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ExternalLink, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PowerBI = () => {
  const { user } = useAuth();
  
  // Simulação de dados do grupo do usuário
  const groupData = {
    name: 'Grupo Região Norte',
    powerbi_link: 'https://powerbi.microsoft.com/exemplo1',
  };

  const handleOpenPowerBI = () => {
    if (groupData.powerbi_link) {
      window.open(groupData.powerbi_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Power BI - Acompanhamento de Propostas</h1>
        <p className="text-gray-600 mt-2">Visualize e acompanhe o status das suas propostas</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">Dashboard de Propostas</CardTitle>
                <CardDescription className="text-blue-700">
                  {groupData.name}
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
                    Este dashboard contém informações atualizadas sobre todas as propostas do seu grupo, 
                    incluindo status, valores, prazos e análises de performance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleOpenPowerBI}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
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
                  O link do Power BI ainda não foi configurado para o seu grupo. 
                  Entre em contato com o administrador.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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
    </div>
  );
};

export default PowerBI;
