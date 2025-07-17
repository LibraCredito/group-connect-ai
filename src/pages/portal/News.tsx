
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Newspaper, ArrowLeft, Eye, AlertTriangle } from 'lucide-react';
import { News as NewsType } from '@/types/auth';

const News = () => {
  const [selectedNews, setSelectedNews] = useState<NewsType | null>(null);

  // Dados simulados de notícias ativas
  const newsData: NewsType[] = [
    {
      id: '1',
      title: 'Nova Funcionalidade: Dashboard Avançado',
      content: 'Estamos felizes em anunciar o lançamento do nosso novo dashboard com funcionalidades avançadas de análise e relatórios em tempo real. Esta atualização inclui gráficos interativos, filtros personalizados e exportação de dados.\n\nPrincipais recursos:\n• Visualizações em tempo real\n• Filtros avançados por período e categoria\n• Exportação de dados em múltiplos formatos\n• Interface mais intuitiva e responsiva\n• Relatórios automáticos por email\n\nEsta funcionalidade está disponível para todos os usuários a partir de hoje. Para acessar, clique na aba "Power BI" no menu principal.',
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=400',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      created_by: 'admin',
      category: 'Sistema',
      is_urgent: false,
      is_active: true,
    },
    {
      id: '2',
      title: 'Manutenção Programada do Sistema',
      content: 'Informamos que será realizada uma manutenção programada no sistema no próximo domingo, das 02:00 às 06:00. Durante este período, o acesso poderá ser intermitente. Agradecemos a compreensão.\n\nDetalhes da manutenção:\n• Data: Domingo, 21 de janeiro de 2024\n• Horário: 02:00 às 06:00 (horário de Brasília)\n• Serviços afetados: Login, Dashboard, Formulários\n• Duração estimada: 4 horas\n\nApós a manutenção, o sistema funcionará com melhor performance e estabilidade.',
      image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=400',
      created_at: '2024-01-12T14:30:00Z',
      updated_at: '2024-01-12T14:30:00Z',
      created_by: 'admin',
      category: 'Sistema',
      is_urgent: true,
      is_active: true,
    },
    {
      id: '3',
      title: 'Treinamento: Como Utilizar o Power BI',
      content: 'Será realizado um treinamento online sobre como utilizar efetivamente o Power BI para análise de propostas. O treinamento acontecerá na próxima quinta-feira, às 14:00. Inscrições abertas.\n\nPrograma do treinamento:\n• Introdução ao Power BI\n• Navegação pela interface\n• Criação de filtros personalizados\n• Interpretação de gráficos e métricas\n• Exportação de relatórios\n• Sessão de perguntas e respostas\n\nPara se inscrever, entre em contato com o administrador do sistema.',
      image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&h=400',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-10T09:15:00Z',
      created_by: 'admin',
      category: 'Treinamento',
      is_urgent: false,
      is_active: true,
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

  if (selectedNews) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedNews(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Notícias</h1>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">{selectedNews.category}</Badge>
              {selectedNews.is_urgent && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>🚨 Urgente</span>
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {selectedNews.title}
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedNews.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Administrador</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {getTimeAgo(selectedNews.created_at)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {selectedNews.image_url && (
              <div className="mb-6">
                <img 
                  src={selectedNews.image_url} 
                  alt={selectedNews.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {selectedNews.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary rounded-lg">
          <Newspaper className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notícias</h1>
          <p className="text-gray-600">Fique por dentro das últimas atualizações</p>
        </div>
      </div>

      <div className="grid gap-6">
        {newsData.map((news) => (
          <Card key={news.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">{news.category}</Badge>
                    {news.is_urgent && (
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>🚨 Urgente</span>
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-gray-900 mb-2">
                    {news.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(news.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Administrador</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getTimeAgo(news.created_at)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {news.image_url && (
                  <div className="flex-shrink-0">
                    <img 
                      src={news.image_url} 
                      alt={news.title}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {truncateContent(news.content)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedNews(news)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ler mais</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {newsData.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notícia disponível</h3>
            <p className="text-gray-600">
              Ainda não há notícias publicadas. Volte em breve para ver as últimas atualizações.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default News;
