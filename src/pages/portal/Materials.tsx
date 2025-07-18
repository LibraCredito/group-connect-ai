
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, BookOpen, ArrowLeft, Eye, Download, FileText, Video, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Material {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_active: boolean;
}

const Materials = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [materialsData, setMaterialsData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching materials:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os materiais.",
          variant: "destructive",
        });
        return;
      }

      setMaterialsData(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os materiais.",
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

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'link': return ExternalLink;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'link': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return 'PDF';
      case 'video': return 'VÍDEO';
      case 'link': return 'LINK';
      default: return 'DOCUMENTO';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Material de Apoio</h1>
            <p className="text-gray-600">Carregando materiais...</p>
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

  // Expanded material view
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
              <Badge className={getTypeColor(selectedMaterial.file_type)}>
                {getTypeLabel(selectedMaterial.file_type)}
              </Badge>
              {selectedMaterial.category && (
                <Badge variant="secondary">{selectedMaterial.category}</Badge>
              )}
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
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed mb-6">
                {selectedMaterial.description}
              </div>
            </div>
            {selectedMaterial.file_url && (
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => window.open(selectedMaterial.file_url, '_blank', 'noopener,noreferrer')}
                  className="flex items-center space-x-2"
                >
                  {selectedMaterial.file_type?.toLowerCase() === 'pdf' && <Download className="h-4 w-4" />}
                  {selectedMaterial.file_type?.toLowerCase() === 'video' && <Video className="h-4 w-4" />}
                  {selectedMaterial.file_type?.toLowerCase() === 'link' && <ExternalLink className="h-4 w-4" />}
                  <span>
                    {selectedMaterial.file_type?.toLowerCase() === 'pdf' ? 'Baixar Material' : 
                     selectedMaterial.file_type?.toLowerCase() === 'video' ? 'Assistir Vídeo' : 
                     'Acessar Material'}
                  </span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Material listing view
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
          const TypeIcon = getTypeIcon(material.file_type);
          return (
            <Card key={material.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getTypeColor(material.file_type)}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {getTypeLabel(material.file_type)}
                      </Badge>
                      {material.category && (
                        <Badge variant="secondary">{material.category}</Badge>
                      )}
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
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 leading-relaxed">
                    {truncateContent(material.description || '', 150)}
                  </p>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMaterial(material)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Visualizar</span>
                    </Button>
                    {material.file_url && (
                      <Button
                        size="sm"
                        onClick={() => window.open(material.file_url, '_blank', 'noopener,noreferrer')}
                        className="flex items-center space-x-2"
                      >
                        {material.file_type?.toLowerCase() === 'pdf' && <Download className="h-4 w-4" />}
                        {material.file_type?.toLowerCase() === 'video' && <Video className="h-4 w-4" />}
                        {material.file_type?.toLowerCase() === 'link' && <ExternalLink className="h-4 w-4" />}
                        <span>Acessar</span>
                      </Button>
                    )}
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
