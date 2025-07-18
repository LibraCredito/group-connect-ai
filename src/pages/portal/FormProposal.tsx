
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, AlertCircle, RefreshCw, CheckCircle, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGroups } from '@/hooks/useGroups';

const FormProposal = () => {
  const { user } = useAuth();
  const { groups } = useGroups();
  const [formLoaded, setFormLoaded] = useState(false);
  
  // Buscar o grupo do usuário
  const userGroup = groups.find(group => group.id === user?.group_id);
  
  // Verificar se o usuário tem acesso ao formulário
  const hasAccess = user?.group_id && userGroup?.form_link;

  const handleFormLoad = () => {
    setFormLoaded(true);
  };

  const handleFormError = () => {
    setFormLoaded(false);
  };

  // Se o usuário não pertence a nenhum grupo ou o grupo não tem link do formulário
  if (!hasAccess) {
    return (
      <div className="w-full max-w-none space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Formulário de Proposta</h1>
          <p className="text-gray-600 mt-2">Preencha suas informações diretamente no portal</p>
        </div>

        <Card className="border-0 shadow-lg w-full">
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Acesso Restrito
              </h3>
              {!user?.group_id ? (
                <p className="text-gray-600 mb-4">
                  Você precisa ser vinculado a um grupo para acessar o formulário de proposta.
                </p>
              ) : !userGroup?.form_link ? (
                <p className="text-gray-600 mb-4">
                  Seu grupo ({userGroup?.name}) ainda não possui um formulário configurado.
                </p>
              ) : null}
              <p className="text-sm text-gray-500">
                Entre em contato com o administrador para obter acesso.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Formulário de Proposta</h1>
        <p className="text-gray-600 mt-2">Preencha suas informações diretamente no portal</p>
      </div>

      <Card className="border-0 shadow-lg w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-green-900">Nova Proposta</CardTitle>
                <CardDescription className="text-green-700">
                  {userGroup?.name}
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => window.open(userGroup?.form_link, '_blank')}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Abrir em Nova Aba</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!formLoaded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-6 mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Se o conteúdo não aparecer, verifique sua conexão ou{' '}
                  <button
                    onClick={() => window.open(userGroup?.form_link, '_blank')}
                    className="text-yellow-900 underline hover:text-yellow-700"
                  >
                    clique aqui para abrir em nova aba
                  </button>
                </p>
              </div>
            </div>
          )}
          
          <div className="relative w-full" style={{ minHeight: '800px' }}>
            {!formLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg mx-6">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">Carregando formulário...</p>
                </div>
              </div>
            )}
            
            <iframe
              src={userGroup?.form_link}
              width="100%"
              height="800"
              frameBorder="0"
              allowFullScreen
              scrolling="yes"
              onLoad={handleFormLoad}
              onError={handleFormError}
              className="w-full rounded-lg shadow-sm"
              title="Formulário de Proposta"
            />
          </div>
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
  );
};

export default FormProposal;
