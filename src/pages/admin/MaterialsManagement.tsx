
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Download,
  FileText,
  BookOpen,
  Video,
  CheckSquare,
  Monitor,
  Filter,
  X,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MaterialItem {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

const MaterialsManagement = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file_url: '',
    file_type: '',
    is_active: true,
  });

  // Estados dos filtros
  const [filters, setFilters] = useState({
    category: 'all',
    file_type: 'all',
    status: 'all',
  });

  const categories = [
    'Manual',
    'Tutorial',
    'Vídeo',
    'Checklist',
    'Simulador',
    'Guia',
    'Documentação',
    'Treinamento'
  ];

  const fileTypes = [
    'PDF',
    'DOC',
    'DOCX',
    'XLS',
    'XLSX',
    'PPT',
    'PPTX',
    'MP4',
    'AVI',
    'MOV',
    'ZIP',
    'RAR'
  ];

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar materiais:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao carregar os materiais.',
          variant: 'destructive',
        });
        return;
      }

      setMaterials(data || []);
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar os materiais.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filtrar materiais com base nos filtros aplicados
  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const matchesFileType = filters.file_type === 'all' || item.file_type === filters.file_type;
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'active' ? item.is_active : !item.is_active);
      
      return matchesCategory && matchesFileType && matchesStatus;
    });
  }, [materials, filters]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Manual': return FileText;
      case 'Vídeo': return Video;
      case 'Checklist': return CheckSquare;
      case 'Simulador': return Monitor;
      default: return BookOpen;
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      file_url: '',
      file_type: '',
      is_active: true,
    });
    setEditingMaterial(null);
  };

  const handleOpenDialog = (material?: MaterialItem) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        title: material.title,
        description: material.description,
        category: material.category,
        file_url: material.file_url,
        file_type: material.file_type,
        is_active: material.is_active,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.file_url) {
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

      if (editingMaterial) {
        const { error } = await supabase
          .from('materials')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingMaterial.id);

        if (error) {
          console.error('Erro ao atualizar material:', error);
          toast({
            title: 'Erro',
            description: 'Falha ao atualizar o material.',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Sucesso',
          description: 'Material atualizado com sucesso!',
        });
      } else {
        const { error } = await supabase
          .from('materials')
          .insert([{
            ...formData,
            created_by: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (error) {
          console.error('Erro ao criar material:', error);
          toast({
            title: 'Erro',
            description: 'Falha ao criar o material.',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Sucesso',
          description: 'Material criado com sucesso!',
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error('Erro ao salvar material:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao salvar o material.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir material:', error);
        toast({
          title: 'Erro',
          description: 'Falha ao excluir o material.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Material excluído com sucesso!',
      });
      fetchMaterials();
    } catch (error) {
      console.error('Erro ao excluir material:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao excluir o material.',
        variant: 'destructive',
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      file_type: 'all',
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
          <span>Carregando materiais...</span>
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
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="libra-page-title">Gestão de Materiais de Apoio</h1>
                  <p className="libra-page-description">Gerencie os materiais de apoio e documentação do sistema</p>
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
                  <span>Novo Material</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    {editingMaterial ? 'Editar Material' : 'Novo Material'}
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
                        placeholder="Digite o título do material"
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
                      <Label htmlFor="file_url" className="text-sm font-medium text-gray-700">URL do Arquivo *</Label>
                      <Input
                        id="file_url"
                        value={formData.file_url}
                        onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                        placeholder="https://exemplo.com/arquivo.pdf"
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file_type" className="text-sm font-medium text-gray-700">Tipo de Arquivo</Label>
                      <Select value={formData.file_type} onValueChange={(value) => setFormData({ ...formData, file_type: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {fileTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Digite a descrição do material"
                      rows={6}
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
                      {editingMaterial ? 'Atualizar' : 'Criar'}
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
                <Label className="text-sm font-medium text-foreground">Tipo de Arquivo</Label>
                <Select value={filters.file_type} onValueChange={(value) => setFilters({ ...filters, file_type: value })}>
                  <SelectTrigger className="libra-card border-border">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent className="libra-card border-border">
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {fileTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
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
              Materiais Cadastrados ({filteredMaterials.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum material encontrado</p>
                <p className="text-gray-400 text-sm">Clique em "Novo Material" para criar seu primeiro material</p>
              </div>
            ) : (
              <div className="libra-table">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="font-semibold text-foreground">Título</TableHead>
                      <TableHead className="font-semibold text-foreground">Categoria</TableHead>
                      <TableHead className="font-semibold text-foreground">Tipo</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground">Criado em</TableHead>
                      <TableHead className="font-semibold text-foreground">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((item) => {
                      const CategoryIcon = getCategoryIcon(item.category);
                      return (
                        <TableRow key={item.id} className="libra-table-row border-b border-border">
                          <TableCell className="font-medium text-foreground">{item.title}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="libra-status-badge flex items-center space-x-1 w-fit">
                              <CategoryIcon className="h-3 w-3" />
                              <span>{item.category}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="libra-status-badge">
                              {item.file_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={item.is_active ? 'default' : 'secondary'}
                              className={item.is_active ? 'libra-active-badge' : 'libra-inactive-badge'}
                            >
                              {item.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(item.created_at)}</TableCell>
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
                                onClick={() => window.open(item.file_url, '_blank')}
                                className="libra-button-icon"
                              >
                                <Download className="h-4 w-4" />
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
                                      Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.
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
                      );
                    })}
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

export default MaterialsManagement;
