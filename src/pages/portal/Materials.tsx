import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, BookOpen, ArrowLeft, Eye, Download, FileText, Video, ExternalLink } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'pdf' | 'video' | 'link' | 'text';
  url?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

const Materials = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Dados simulados de materiais de apoio
  const materialsData: Material[] = [
    {
      id: '1',
      title: 'Guia Completo do Power BI',
      description: 'Tutorial completo sobre como usar o Power BI para análise de propostas',
      content: 'Este guia aborda todos os aspectos necessários para utilizar efetivamente o Power BI em sua análise de propostas.\n\nTópicos abordados:\n• Introdução ao Power BI\n• Navegação pela interface\n• Criação de filtros personalizados\n• Interpretação de gráficos e métricas\n• Exportação de relatórios\n• Dicas avançadas de análise\n\nPré-requisitos:\n• Acesso ao sistema\n• Conhecimento básico de computação\n• Dados de propostas disponíveis\n\nEste material foi criado para facilitar o aprendizado e maximizar o uso da ferramenta.',
      type: 'pdf',
      url: '/materials/powerbi-guide.pdf',
      image_url: '/placeholder.svg',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      created_by: 'admin',
    },
    {
      id: '2',
      title: 'Vídeo: Como Preencher Formulários',
      description: 'Tutorial em vídeo mostrando passo a passo como preencher formulários de proposta',
      content: 'Vídeo tutorial prático demonstrando como preencher corretamente os formulários de proposta.\n\nO que você aprenderá:\n• Acesso ao formulário\n• Preenchimento de campos obrigatórios\n• Upload de documentos\n• Validação de dados\n• Envio da proposta\n• Acompanhamento do status\n\nDuração: 15 minutos\nFormato: MP4 (1080p)\nIdioma: Português\n\nEste vídeo foi gravado com a versão mais recente do sistema.',
      type: 'video',
      url: 'https://youtube.com/watch?v=exemplo',
      image_url: '/placeholder.svg',
      created_at: '2024-01-12T14:30:00Z',
      updated_at: '2024-01-12T14:30:00Z',
      created_by: 'admin',
    },
    {
      id: '3',
      title: 'FAQ - Perguntas Frequentes',
      description: 'Respostas para as dúvidas mais comuns sobre o sistema',
      content: 'Aqui estão as perguntas mais frequentes sobre o uso do sistema:\n\n1. Como faço para redefinir minha senha?\nR: Clique em "Esqueci minha senha" na tela de login e siga as instruções.\n\n2. Por que minha proposta foi rejeitada?\nR: Verifique se todos os documentos obrigatórios foram enviados e se as informações estão corretas.\n\n3. Quanto tempo demora para analisar uma proposta?\nR: O tempo médio é de 10-15 dias úteis, dependendo da complexidade.\n\n4. Como posso acompanhar o status da minha proposta?\nR: Acesse o dashboard Power BI onde você pode ver o status em tempo real.\n\n5. Posso editar uma proposta já enviada?\nR: Não, mas você pode enviar uma nova proposta com as correções necessárias.\n\nPara dúvidas não listadas aqui, entre em contato com o administrador.',
      type: 'text',
      image_url: '/placeholder.svg',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-10T09:15:00Z',
      created_by: 'admin',
    },
    {
      id: '4',
      title: 'Portal de Treinamentos Online',
      description: 'Acesso a cursos e treinamentos complementares',
      content: 'Link para a plataforma de treinamentos online com cursos complementares.\n\nCursos disponíveis:\n• Fundamentos de análise de dados\n• Elaboração de propostas eficazes\n• Técnicas de apresentação\n• Gestão de projetos\n• Comunicação empresarial\n\nBenefícios:\n• Certificados de conclusão\n• Acesso vitalício\n• Suporte por email\n• Exercícios práticos\n• Fóruns de discussão\n\nPara acessar, clique no link e use suas credenciais do sistema.',
      type: 'link',
      url: 'https://treinamentos.exemplo.com',
      image_url: '/placeholder.svg',
      created_at: '2024-01-08T16:45:00Z',
      updated_at: '2024-01-08T16:45:00Z',
      created_by: 'admin',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} meses atrás`;
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'link': return ExternalLink;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'link': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMaterialAction = (material: Material) => {
    if (material.type === 'link' && material.url) {
      window.open(material.url, '_blank', 'noopener,noreferrer');
    } else if (material.type === 'pdf' && material.url) {
      window.open(material.url, '_blank', 'noopener,noreferrer');
    } else if (material.type === 'video' && material.url) {
      window.open(material.url, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedMaterial(material);
    }
  };

  if (selectedMaterial) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMaterial(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Material de Apoio</h1>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getTypeColor(selectedMaterial.type)}>
                {selectedMaterial.type.toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {selectedMaterial.title}
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedMaterial.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Administrador</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getTimeAgo(selectedMaterial.created_at)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {selectedMaterial.image_url && (
              <div className="mb-6">
                <img 
                  src={selectedMaterial.image_url} 
                  alt={selectedMaterial.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {selectedMaterial.content}
              </div>
            </div>
            {selectedMaterial.url && (
              <div className="mt-6">
                <Button
                  onClick={() => window.open(selectedMaterial.url, '_blank', 'noopener,noreferrer')}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Acessar Material</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary rounded-lg">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Material de Apoio</h1>
          <p className="text-gray-600">Tutoriais, guias e recursos para ajudar você</p>
        </div>
      </div>

      <div className="grid gap-6">
        {materialsData.map((material) => {
          const TypeIcon = getTypeIcon(material.type);
          return (
            <Card key={material.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(material.type)}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {material.type.toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-900 mb-2">
                      {material.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mb-2">
                      {material.description}
                    </CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(material.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Administrador</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {getTimeAgo(material.created_at)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {material.image_url && (
                    <div className="flex-shrink-0">
                      <img 
                        src={material.image_url} 
                        alt={material.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {truncateContent(material.content)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMaterialAction(material)}
                      className="flex items-center space-x-2"
                    >
                      {material.type === 'link' ? (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          <span>Acessar</span>
                        </>
                      ) : material.type === 'pdf' ? (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Baixar</span>
                        </>
                      ) : material.type === 'video' ? (
                        <>
                          <Video className="h-4 w-4" />
                          <span>Assistir</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Ler mais</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {materialsData.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum material disponível</h3>
            <p className="text-gray-600">
              Ainda não há materiais de apoio publicados. Volte em breve para ver novos conteúdos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Materials;