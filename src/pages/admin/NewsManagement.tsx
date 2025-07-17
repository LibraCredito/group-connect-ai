
import React, { useState, useMemo } from 'react';
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
  Newspaper
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  is_urgent: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  created_by: string;
}

const NewsManagement = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Nova Funcionalidade: Dashboard Avançado',
      content: 'Estamos felizes em anunciar o lançamento do nosso novo dashboard com funcionalidades avançadas.',
      category: 'Sistema',
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=400',
      is_urgent: false,
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      created_by: 'admin',
    },
    {
      id: '2',
      title: 'Manutenção Programada do Sistema',
      content: 'Informamos que será realizada uma manutenção programada no sistema.',
      category: 'Sistema',
      image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=400',
      is_urgent: true,
      status: 'active',
      created_at: '2024-01-12T14:30:00Z',
      updated_at: '2024-01-12T14:30:00Z',
      created_by: 'admin',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image_url: '',
    is_urgent: false,
    status: 'active' as 'active' | 'inactive',
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

  // Filtrar e ordenar notícias com base nos filtros aplicados
  const filteredNews = useMemo(() => {
    const filtered = news.filter(item => {
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesUrgency = !filters.urgency || item.is_urgent;
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      
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
      status: 'active',
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
        status: newsItem.status,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category || !formData.image_url) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    if (editingNews) {
      setNews(news.map(item => 
        item.id === editingNews.id 
          ? { ...item, ...formData, updated_at: new Date().toISOString() }
          : item
      ));
      toast({
        title: 'Sucesso',
        description: 'Notícia atualizada com sucesso!',
      });
    } else {
      const newNews: NewsItem = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'admin',
      };
      setNews([...news, newNews]);
      toast({
        title: 'Sucesso',
        description: 'Notícia criada com sucesso!',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setNews(news.filter(item => item.id !== id));
    toast({
      title: 'Sucesso',
      description: 'Notícia excluída com sucesso!',
    });
  };

  const toggleStatus = (id: string) => {
    setNews(news.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active', updated_at: new Date().toISOString() }
        : item
    ));
    toast({
      title: 'Sucesso',
      description: 'Status da notícia alterado com sucesso!',
    });
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Newspaper className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Notícias</h1>
            <p className="text-gray-600">Gerencie as notícias do sistema</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nova Notícia</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingNews ? 'Editar Notícia' : 'Nova Notícia'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Digite o título da notícia"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
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
                  <Label htmlFor="image_url">URL da Imagem de Capa *</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_urgent"
                  checked={formData.is_urgent}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_urgent: checked })}
                />
                <Label htmlFor="is_urgent" className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>Marcar como urgente</span>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Digite o conteúdo da notícia"
                  rows={12}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingNews ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
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
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="urgency">Apenas urgentes</Label>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notícias Cadastradas ({filteredNews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Urgência</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((item) => (
                <TableRow key={item.id} className={item.is_urgent ? 'bg-red-50 border-l-4 border-red-500' : ''}>
                  <TableCell>
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-16 h-12 object-cover rounded"
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
                      <span>{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                      {item.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.is_urgent && (
                      <Badge variant="destructive" className="flex items-center space-x-1 bg-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>🚨 Urgente</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManagement;
