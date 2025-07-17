
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const FormProposal = () => {
  const { user } = useAuth();
  
  // Simulação de dados do grupo do usuário
  const groupData = {
    name: 'Grupo Região Norte',
    form_link: 'https://forms.microsoft.com/exemplo1',
  };

  const handleOpenForm = () => {
    if (groupData.form_link) {
      window.open(groupData.form_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Formulário de Proposta</h1>
        <p className="text-gray-600 mt-2">Submeta suas novas propostas de forma rápida e segura</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-green-900">Nova Proposta</CardTitle>
                <CardDescription className="text-green-700">
                  {groupData.name}
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
                    Utilize o formulário para enviar suas propostas. Todas as informações serão 
                    automaticamente organizadas e enviadas para análise da equipe responsável.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleOpenForm}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                disabled={!groupData.form_link}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Formulário de Proposta
              </Button>
            </div>
            
            {!groupData.form_link && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <Info className="h-4 w-4 inline mr-1" />
                  O link do formulário ainda não foi configurado para o seu grupo. 
                  Entre em contato com o administrador.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Informações Importantes</CardTitle>
            <CardDescription>Orientações para preenchimento do formulário</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Documentos Necessários
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Documento de identificação</li>
                    <li>• Comprovante de endereço</li>
                    <li>• Documentação específica do projeto</li>
                    <li>• Orçamento detalhado (se aplicável)</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Processo de Análise
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Análise inicial: 2-3 dias úteis</li>
                    <li>• Validação técnica: 5-7 dias úteis</li>
                    <li>• Aprovação final: 10-15 dias úteis</li>
                    <li>• Comunicação por email</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Dica Importante</h4>
                <p className="text-sm text-blue-800">
                  Certifique-se de preencher todos os campos obrigatórios e anexar todos os documentos 
                  necessários para evitar atrasos na análise da sua proposta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormProposal;
