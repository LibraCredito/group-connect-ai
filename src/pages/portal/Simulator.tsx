
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Wrench } from 'lucide-react';

const Simulator = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Simulador</h1>
        <p className="text-gray-600 mt-2">Ferramenta de simulação e cálculos</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Simulador em Desenvolvimento</CardTitle>
          <CardDescription className="text-gray-600 max-w-md mx-auto">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-center space-x-2 text-orange-700 mb-3">
              <Wrench className="h-5 w-5" />
              <span className="font-medium">Em Construção</span>
            </div>
            <p className="text-sm text-orange-800">
              Nossa equipe está trabalhando para entregar uma ferramenta completa de simulação 
              que permitirá fazer cálculos precisos e análises detalhadas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🔢 Cálculos Automáticos</h4>
              <p className="text-sm text-gray-600">
                Realize cálculos complexos de forma automatizada e precisa.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📊 Cenários Múltiplos</h4>
              <p className="text-sm text-gray-600">
                Compare diferentes cenários e suas respectivas projeções.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📈 Relatórios Detalhados</h4>
              <p className="text-sm text-gray-600">
                Gere relatórios completos com todas as simulações realizadas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Simulator;
