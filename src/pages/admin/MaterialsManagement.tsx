
import React, { useState, useMemo } from 'react';
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
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MaterialItem {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

const MaterialsManagement = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: '1',
      title: 'Guia Completo do Power BI',
      content: 'Tutorial completo sobre como usar o Power BI para análise de propostas.',
      category: 'Manual',
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=400',
      pdf_url: '/materials/powerbi-guide.pdf',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      created_by: 'admin',
    },
    {
      id: '2',
      title: 'FAQ - Perguntas Frequentes',
      content: 'Respostas para as dúvidas mais comuns sobre o sistema.',
      category: 'Tutorial',
      image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&h=400',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-10T09:15:00Z',
      created_by: 'admin',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image_url: '',
    pdf_url: '',
  });

  // Estados dos filtros
  const [filters, setFilters] = useState({
    category: '',
    hasPdf: '', // 'all', 'with_pdf', 'without_pdf'
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

  const pdfOptions = [
    { value: '', label: 'Todos' },
    { value: 'with_pdf', label: 'Com PDF' },
    { value: 'without_pdf', label: 'Sem PDF' }
  ];

  // Filtrar materiais com base nos filtros aplicados
  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      const matchesCategory = !filters.category || item.category === filters.category;
      
      let matchesPdf = true;
      if (filters.hasPdf === 'with_pdf') {
        matchesPdf = !!item.pdf_url;
      } else if (filters.hasPdf === 'without_pdf') {
        matchesPdf = !item.pdf_url;
      }
      
      return matchesCategory && matchesPdf;
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
      content: '',
      category: '',
      image_url: '',
      pdf_url: '',
    });
    setEditingMaterial(null);
  };

  const handleOpenDialog = (material?: MaterialItem) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        title: material.title,
        content: material.content,
        category: material.category,
        image_url: material.image_url,
        pdf_url: material.pdf_url || '',
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

    if (editingMaterial) {
      setMaterials(materials.map(item => 
        item.id === editingMaterial.id 
          ? { ...item, ...formData, updated_at: new Date().toISOString() }
          : item
      ));
      toast({
        title: 'Sucesso',
        description: 'Material atualizado com sucesso!',
      });
    } else {
      const newMaterial: MaterialItem = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'admin',
      };
      setMaterials([...materials, newMaterial]);
      toast({
        title: 'Sucesso',
        description: 'Material criado com sucesso!',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(item => item.id !== id));
    toast({
      title: 'Sucesso',
      description: 'Material excluído com sucesso!',
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      hasPdf: '',
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
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Materiais de Apoio</h1>
            <p className="text-gray-600">Gerencie os materiais de apoio do sistema</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Material</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingMaterial ? 'Editar Material' : 'Novo Material'}
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
                    placeholder="Digite o título do material"
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
                  <Label htmlFor="pdf_url">URL do PDF (opcional)</Label>
                  <Input
                    id="pdf_url"
                    value={formData.pdf_url}
                    onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                    placeholder="https://exemplo.com/documento.pdf"
                  />
                  <p className="text-sm text-gray-500">
                    Se fornecido, um botão de download será exibido no material
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Descrição *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Digite a descrição do material"
                  rows={12}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingMaterial ? 'Atualizar' : 'Criar'}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Presença de PDF</Label>
              <Select value={filters.hasPdf} onValueChange={(value) => setFilters({ ...filters, hasPdf: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {pdfOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <CardTitle>Materiais Cadastrados ({filteredMaterials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>PDF</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                        <CategoryIcon className="h-3 w-3" />
                        <span>{item.category}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.pdf_url ? (
                        <Badge variant="default" className="flex items-center space-x-1 w-fit">
                          <Download className="h-3 w-3" />
                          <span>Disponível</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Sem PDF</Badge>
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
                                Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsManagement;
