
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Filter,
  X,
  Newspaper,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  is_urgent: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

const NewsManagement = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image_url: '',
    is_urgent: false,
    is_active: true,
  });

  // Estados dos filtros
  const [filters, setFilters] = useState({
    category: 'all',
    urgency: false,
    status: 'all',
  });

  const categories = [
    'Sistema',
    'Economia',
    'Crédito',
    'Dicas',
    'Atualizações',
    'Política',
    'Treinamento',
    'Anúncios'
  ];

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notícias:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao carregar as notícias.',
          variant: 'destructive',
        });
        return;
      }

      setNews(data || []);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar as notícias.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Filtrar e ordenar notícias com base nos filtros aplicados
  const filteredNews = useMemo(() => {
    const filtered = news.filter(item => {
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesUrgency = !filters.urgency || item.is_urgent;
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'active' ? item.is_active : !item.is_active);
      
      return matchesCategory && matchesUrgency && matchesStatus;
    });

    // Ordenar: urgentes primeiro (mais recentes primeiro), depois não urgentes (mais recentes primeiro)
    return filtered.sort((a, b) => {
      // Se ambas são urgentes ou ambas não são urgentes, ordenar por data (mais recente primeiro)
      if (a.is_urgent === b.is_urgent) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Se uma é urgente e a outra não, a urgente vem primeiro
      return a.is_urgent ? -1 : 1;
    });
  }, [news, filters]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      image_url: '',
      is_urgent: false,
      is_active: true,
    });
    setEditingNews(null);
  };

  const handleOpenDialog = (newsItem?: NewsItem) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        category: newsItem.category,
        image_url: newsItem.image_url,
        is_urgent: newsItem.is_urgent,
        is_active: newsItem.is_active,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category || !formData.image_url) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Erro',
          description: 'Usuário não autenticado.',
          variant: 'destructive',
        });
        return;
      }

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNews.id);

        if (error) {
          console.error('Erro ao atualizar notícia:', error);
          toast({
            title: 'Erro',
            description: 'Falha ao atualizar a notícia.',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Sucesso',
          description: 'Notícia atualizada com sucesso!',
        });
      } else {
        const { error } = await supabase
          .from('news')
          .insert([{
            ...formData,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (error) {
          console.error('Erro ao criar notícia:', error);
          toast({
            title: 'Erro',
            description: 'Falha ao criar a notícia.',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Sucesso',
          description: 'Notícia criada com sucesso!',
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao salvar a notícia.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir notícia:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao excluir a notícia.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Notícia excluída com sucesso!',
      });
      fetchNews();
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao excluir a notícia.',
        variant: 'destructive',
      });
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const newsItem = news.find(item => item.id === id);
      if (!newsItem) return;

      const { error } = await supabase
        .from('news')
        .update({
          is_active: !newsItem.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Erro ao alterar status:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao alterar o status da notícia.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Status da notícia alterado com sucesso!',
      });
      fetchNews();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao alterar o status da notícia.',
        variant: 'destructive',
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      urgency: false,
      status: 'all',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando notícias...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="libra-header bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="libra-page-header">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center libra-button">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="libra-page-title">Gestão de Notícias</h1>
                  <p className="libra-page-description">Gerencie as notícias e comunicados do sistema</p>
                </div>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => handleOpenDialog()} 
                  className="libra-button flex items-center space-x-2 px-6 py-3"
                >
                  <Plus className="h-5 w-5" />
                  <span>Nova Notícia</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    {editingNews ? 'Editar Notícia' : 'Nova Notícia'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">Título *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Digite o título da notícia"
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_url" className="text-sm font-medium text-gray-700">URL da Imagem de Capa *</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status *</Label>
                      <Select value={formData.is_active ? 'active' : 'inactive'} onValueChange={(value) => setFormData({ ...formData, is_active: value === 'active' })}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativa</SelectItem>
                          <SelectItem value="inactive">Inativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <Switch
                      id="is_urgent"
                      checked={formData.is_urgent}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_urgent: checked })}
                    />
                    <Label htmlFor="is_urgent" className="flex items-center space-x-2 text-amber-800">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">Marcar como urgente</span>
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium text-gray-700">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Digite o conteúdo da notícia"
                      rows={8}
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingNews ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 libra-section">
        {/* Filtros */}
        <Card className="libra-filter-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Filter className="h-5 w-5 text-primary" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Categoria</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger className="libra-card border-border">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent className="libra-card border-border">
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Status</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger className="libra-card border-border">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent className="libra-card border-border">
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgency"
                  checked={filters.urgency}
                  onCheckedChange={(checked) => setFilters({ ...filters, urgency: checked as boolean })}
                />
                <Label htmlFor="urgency" className="text-sm font-medium text-foreground">Apenas urgentes</Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="libra-button-secondary flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpar filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="libra-data-card">
          <CardHeader>
            <CardTitle className="text-foreground">
              Notícias Cadastradas ({filteredNews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNews.length === 0 ? (
              <div className="text-center py-8">
                <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhuma notícia encontrada</p>
                <p className="text-gray-400 text-sm">Clique em "Nova Notícia" para criar sua primeira notícia</p>
              </div>
            ) : (
              <div className="libra-table">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="font-semibold text-foreground">Imagem</TableHead>
                      <TableHead className="font-semibold text-foreground">Título</TableHead>
                      <TableHead className="font-semibold text-foreground">Categoria</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground">Urgência</TableHead>
                      <TableHead className="font-semibold text-foreground">Criado em</TableHead>
                      <TableHead className="font-semibold text-foreground">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNews.map((item) => (
                      <TableRow 
                        key={item.id} 
                        className={`libra-table-row border-b border-border ${
                          item.is_urgent ? 'libra-urgent' : ''
                        }`}
                      >
                        <TableCell>
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-16 h-12 object-cover rounded-lg shadow-sm"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {item.is_urgent && (
                              <div className="flex items-center space-x-1 text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="text-xs font-bold">🚨</span>
                              </div>
                            )}
                            <span className="text-foreground">{item.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="libra-status-badge">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.is_active ? 'default' : 'secondary'}
                            className={item.is_active ? 'libra-active-badge' : 'libra-inactive-badge'}
                          >
                            {item.is_active ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.is_urgent && (
                            <Badge variant="destructive" className="libra-urgent-badge">
                              <AlertTriangle className="h-3 w-3" />
                              <span className="ml-1">🚨 Urgente</span>
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(item.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(item)}
                              className="libra-button-icon"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleStatus(item.id)}
                              className="libra-button-icon"
                            >
                              {item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="libra-button-icon text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="libra-card">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-foreground">Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="libra-button-secondary">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsManagement;
