import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PowerBI = () => {
  const { user } = useAuth();
  const [powerBILoaded, setPowerBILoaded] = useState(false);
  
  // Simulação de dados do grupo do usuário
  const groupData = {
    name: 'Grupo Região Norte',
    powerbi_link: 'https://app.powerbi.com/view?r=eyJrIjoiOTBlMjEyNDQtYmYwOS00MDg0LWIxODUtZDYzNGNjNDEyYjg1IiwidCI6IjdmYzZhYTE4LWYxODUtNGQwZi1hYTdlLTQzZGIyNDc5ZGQwZCJ9',
  };

  const handlePowerBILoad = () => {
    setPowerBILoaded(true);
  };

  const handlePowerBIError = () => {
    setPowerBILoaded(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Power BI</h1>
        <p className="text-gray-600 mt-2">Visualize em tempo real as métricas do seu grupo</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">Acompanhamento de Propostas</CardTitle>
                <CardDescription className="text-blue-700">
                  {groupData.name}
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => window.open(groupData.powerbi_link, '_blank')}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Abrir em Nova Aba</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!powerBILoaded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Se o conteúdo não aparecer, verifique sua conexão ou{' '}
                  <button
                    onClick={() => window.open(groupData.powerbi_link, '_blank')}
                    className="text-yellow-900 underline hover:text-yellow-700"
                  >
                    clique aqui para abrir em nova aba
                  </button>
                </p>
              </div>
            </div>
          )}
          
          <div className="relative w-full" style={{ minHeight: '600px' }}>
            {!powerBILoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">Carregando dashboard...</p>
                </div>
              </div>
            )}
            
            <iframe
              src={groupData.powerbi_link}
              width="100%"
              height="600"
              frameBorder="0"
              allowFullScreen
              scrolling="yes"
              onLoad={handlePowerBILoad}
              onError={handlePowerBIError}
              className="rounded-lg shadow-sm"
              style={{ maxWidth: '100%', width: '100%' }}
              title="Dashboard Power BI"
            />
          </div>
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
  );
};

export default PowerBI;