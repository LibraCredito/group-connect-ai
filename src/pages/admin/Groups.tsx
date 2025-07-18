
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Group {
  id: string;
  name: string;
  coordinator_id?: string;
  powerbi_link?: string;
  form_link?: string;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    coordinator_id: '',
    powerbi_link: '',
    form_link: '',
  });

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar grupos',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchCoordinators = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'coordinator')
        .order('name');

      if (error) throw error;
      setCoordinators(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar coordenadores',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const groupData = {
        name: formData.name,
        coordinator_id: formData.coordinator_id || null,
        powerbi_link: formData.powerbi_link || null,
        form_link: formData.form_link || null,
      };

      if (editingGroup) {
        const { error } = await supabase
          .from('groups')
          .update(groupData)
          .eq('id', editingGroup.id);

        if (error) throw error;
        
        toast({
          title: 'Grupo atualizado',
          description: 'Grupo atualizado com sucesso!',
        });
      } else {
        const { error } = await supabase
          .from('groups')
          .insert([groupData]);

        if (error) throw error;
        
        toast({
          title: 'Grupo criado',
          description: 'Grupo criado com sucesso!',
        });
      }

      setDialogOpen(false);
      setEditingGroup(null);
      setFormData({ name: '', coordinator_id: '', powerbi_link: '', form_link: '' });
      fetchGroups();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar grupo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      coordinator_id: group.coordinator_id || '',
      powerbi_link: group.powerbi_link || '',
      form_link: group.form_link || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (groupId: string) => {
    if (!confirm('Tem certeza que deseja excluir este grupo?')) return;

    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;
      
      toast({
        title: 'Grupo excluído',
        description: 'Grupo excluído com sucesso!',
      });
      
      fetchGroups();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir grupo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getCoordinatorName = (coordinatorId?: string) => {
    if (!coordinatorId) return 'Sem coordenador';
    const coordinator = coordinators.find(c => c.id === coordinatorId);
    return coordinator?.name || 'Coordenador não encontrado';
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchGroups(), fetchCoordinators()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Grupos</h1>
          <p className="text-muted-foreground">Gerencie todos os grupos do sistema</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGroup(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Editar Grupo' : 'Novo Grupo'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coordinator">Coordenador</Label>
                <Select value={formData.coordinator_id} onValueChange={(value) => setFormData({ ...formData, coordinator_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um coordenador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sem coordenador</SelectItem>
                    {coordinators.map((coordinator) => (
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
                  type="url"
                  value={formData.powerbi_link}
                  onChange={(e) => setFormData({ ...formData, powerbi_link: e.target.value })}
                  placeholder="https://powerbi.microsoft.com/..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="form_link">Link do Formulário</Label>
                <Input
                  id="form_link"
                  type="url"
                  value={formData.form_link}
                  onChange={(e) => setFormData({ ...formData, form_link: e.target.value })}
                  placeholder="https://forms.microsoft.com/..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingGroup ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grupos Cadastrados ({groups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Coordenador</TableHead>
                <TableHead>Links</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{getCoordinatorName(group.coordinator_id)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {group.powerbi_link && (
                        <a
                          href={group.powerbi_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {group.form_link && (
                        <a
                          href={group.form_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(group.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(group)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(group.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
