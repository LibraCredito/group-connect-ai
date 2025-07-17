
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Newspaper } from 'lucide-react';
import { News as NewsType } from '@/types/auth';

const News = () => {
  // Dados simulados de notícias
  const newsData: NewsType[] = [
    {
      id: '1',
      title: 'Nova Funcionalidade: Dashboard Avançado',
      content: 'Estamos felizes em anunciar o lançamento do nosso novo dashboard com funcionalidades avançadas de análise e relatórios em tempo real. Esta atualização inclui gráficos interativos, filtros personalizados e exportação de dados.',
      image_url: '',
      published_at: '2024-01-15T10:00:00Z',
      created_by: 'admin',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Manutenção Programada do Sistema',
      content: 'Informamos que será realizada uma manutenção programada no sistema no próximo domingo, das 02:00 às 06:00. Durante este período, o acesso poderá ser intermitente. Agradecemos a compreensão.',
      published_at: '2024-01-12T14:30:00Z',
      created_by: 'admin',
      created_at: '2024-01-12T14:30:00Z',
      updated_at: '2024-01-12T14:30:00Z',
    },
    {
      id: '3',
      title: 'Treinamento: Como Utilizar o Power BI',
      content: 'Será realizado um treinamento online sobre como utilizar efetivamente o Power BI para análise de propostas. O treinamento acontecerá na próxima quinta-feira, às 14:00. Inscrições abertas.',
      published_at: '2024-01-10T09:15:00Z',
      created_by: 'admin',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-10T09:15:00Z',
    },
    {
      id: '4',
      title: 'Atualização de Segurança Implementada',
      content: 'Foi implementada uma nova atualização de segurança que fortalece a proteção dos dados dos usuários. Todas as senhas foram criptografadas com algoritmos mais robustos e implementamos autenticação em duas etapas.',
      published_at: '2024-01-08T16:45:00Z',
      created_by: 'admin',
      created_at: '2024-01-08T16:45:00Z',
      updated_at: '2024-01-08T16:45:00Z',
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
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
                  <CardTitle className="text-xl text-gray-900 mb-2">
                    {news.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(news.published_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Administrador</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getTimeAgo(news.published_at)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{news.content}</p>
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
