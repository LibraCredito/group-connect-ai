
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Newspaper, ArrowLeft, Eye, AlertTriangle } from 'lucide-react';
import { News as NewsType } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const News = () => {
  const [selectedNews, setSelectedNews] = useState<NewsType | null>(null);
  const [newsData, setNewsData] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as notícias.",
          variant: "destructive",
        });
        return;
      }

      setNewsData(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notícias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Newspaper className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notícias</h1>
            <p className="text-gray-600">Carregando notícias...</p>
          </div>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
