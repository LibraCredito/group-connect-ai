
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, ExternalLink, Building2 } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { useUsers } from '@/hooks/useUsers';
import { Group } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

const GroupsManagement = () => {
  const { groups, loading, createGroup, updateGroup, deleteGroup } = useGroups();
  const { users } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    coordinator_id: '',
    powerbi_link: '',
    form_link: '',
  });

  // Filtrar apenas coordenadores disponíveis
  const availableCoordinators = users.filter(user => user.role === 'coordinator');

  const resetForm = () => {
    setFormData({
      name: '',
      coordinator_id: '',
      powerbi_link: '',
      form_link: '',
    });
    setEditingGroup(null);
  };

  const handleOpenDialog = (group?: Group) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        coordinator_id: group.coordinator_id || '',
        powerbi_link: group.powerbi_link || '',
        form_link: group.form_link || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'O nome do grupo é obrigatório.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const coordinatorId = formData.coordinator_id === 'none' ? undefined : formData.coordinator_id;
      
      if (editingGroup) {
        await updateGroup(editingGroup.id, {
          name: formData.name,
          coordinator_id: coordinatorId,
          powerbi_link: formData.powerbi_link || undefined,
          form_link: formData.form_link || undefined,
        });
      } else {
        await createGroup({
          name: formData.name,
          coordinator_id: coordinatorId,
          powerbi_link: formData.powerbi_link || undefined,
          form_link: formData.form_link || undefined,
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
    }
  };

  const handleDelete = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
    }
  };

  const getCoordinatorName = (coordinatorId?: string) => {
    if (!coordinatorId) return 'Sem coordenador';
    const coordinator = availableCoordinators.find(c => c.id === coordinatorId);
    return coordinator?.name || 'Coordenador não encontrado';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Grupos</h1>
          <p className="text-gray-600 mt-2">Gerencie os grupos e seus coordenadores</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Editar Grupo' : 'Criar Novo Grupo'}
              </DialogTitle>
              <DialogDescription>
                {editingGroup 
                  ? 'Atualize as informações do grupo.' 
                  : 'Preencha as informações para criar um novo grupo.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Grupo Região Norte"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coordinator">Coordenador</Label>
                <Select value={formData.coordinator_id || 'none'} onValueChange={(value) => setFormData({ ...formData, coordinator_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um coordenador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem coordenador</SelectItem>
                    {availableCoordinators.map((coordinator) => (
                      <SelectItem key={coordinator.id} value={coordinator.id}>
                        {coordinator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="powerbi_link">Link do Power BI</Label>
                <Input
                  id="powerbi_link"
                  value={formData.powerbi_link}
                  onChange={(e) => setFormData({ ...formData, powerbi_link: e.target.value })}
                  placeholder="https://powerbi.microsoft.com/..."
                  type="url"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="form_link">Link do Formulário</Label>
                <Input
                  id="form_link"
                  value={formData.form_link}
                  onChange={(e) => setFormData({ ...formData, form_link: e.target.value })}
                  placeholder="https://forms.microsoft.com/..."
                  type="url"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingGroup ? 'Atualizar' : 'Criar'} Grupo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {groups.length > 0 ? (
          groups.map((group) => (
            <Card key={group.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <CardDescription>
                      Coordenador: {getCoordinatorName(group.coordinator_id)}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o grupo "{group.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(group.id)} className="bg-red-600 hover:bg-red-700">
                            Confirmar Exclusão
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Coordenador: {getCoordinatorName(group.coordinator_id)}
                  </span>
                  {group.coordinator_id && (
                    <Badge variant="secondary">Ativo</Badge>
                  )}
                </div>
                
                {group.powerbi_link && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    <a
                      href={group.powerbi_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Link do Power BI
                    </a>
                  </div>
                )}
                
                {group.form_link && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-green-500" />
                    <a
                      href={group.form_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Link do Formulário
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-8">
              <div className="text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum grupo cadastrado</p>
                <p className="text-gray-400 text-sm mt-2">
                  Clique no botão "Novo Grupo" para criar o primeiro grupo
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GroupsManagement;
