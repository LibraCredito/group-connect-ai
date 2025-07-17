
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, User, Shield } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useGroups } from '@/hooks/useGroups';
import { User as UserType } from '@/types/auth';

const UsersManagement = () => {
  const { users, loading, updateUser, deleteUser } = useUsers();
  const { groups } = useGroups();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'user' as UserType['role'],
    group_id: '',
  });

  const [filterRole, setFilterRole] = useState<string>('all');

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'user',
      group_id: '',
    });
    setEditingUser(null);
  };

  const handleOpenDialog = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        role: user.role,
        group_id: user.group_id || '',
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
    
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, {
        name: formData.name,
        role: formData.role,
        group_id: formData.group_id || undefined,
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const getGroupName = (groupId?: string) => {
    if (!groupId) return 'Sem grupo';
    const group = groups.find(g => g.id === groupId);
    return group?.name || 'Grupo não encontrado';
  };

  const getRoleBadge = (role: UserType['role']) => {
    const roleConfig = {
      admin: { label: 'Admin', variant: 'destructive' as const },
      coordinator: { label: 'Coordenador', variant: 'default' as const },
      user: { label: 'Usuário', variant: 'secondary' as const },
    };
    return roleConfig[role];
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(user => user.role === filterRole);

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
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600 mt-2">Gerencie os usuários do sistema</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="coordinator">Coordenadores</SelectItem>
            <SelectItem value="user">Usuários</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Usuários Cadastrados ({filteredUsers.length})</span>
          </CardTitle>
          <CardDescription>
            Gerencie todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadge(user.role).variant}>
                      {getRoleBadge(user.role).label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {getGroupName(user.group_id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>
                              Editar Usuário
                            </DialogTitle>
                            <DialogDescription>
                              Atualize as informações do usuário.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nome Completo</Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="role">Tipo de Acesso</Label>
                              <Select value={formData.role} onValueChange={(value: UserType['role']) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                  <SelectItem value="coordinator">Coordenador</SelectItem>
                                  <SelectItem value="user">Usuário</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {(formData.role === 'coordinator' || formData.role === 'user') && (
                              <div className="space-y-2">
                                <Label htmlFor="group">Grupo Vinculado</Label>
                                <Select value={formData.group_id} onValueChange={(value) => setFormData({ ...formData, group_id: value })}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um grupo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {groups.map((group) => (
                                      <SelectItem key={group.id} value={group.id}>
                                        {group.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            
                            <div className="flex justify-end space-x-2 pt-4">
                              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                Cancelar
                              </Button>
                              <Button type="submit">
                                Atualizar Usuário
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      
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
                              Tem certeza que deseja excluir o usuário "{user.name}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700">
                              Confirmar Exclusão
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

export default UsersManagement;
