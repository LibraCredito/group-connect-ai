
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
import { Plus, Edit, Trash2, User, Mail, Shield, Building2 } from 'lucide-react';
import { User as UserType } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

const UsersManagement = () => {
  const [users, setUsers] = useState<UserType[]>([
    {
      id: '1',
      email: 'admin@portal.com',
      role: 'admin',
      name: 'Administrador Sistema',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'coord@portal.com',
      role: 'coordinator',
      name: 'João Coordenador',
      group_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'user@portal.com',
      role: 'user',
      name: 'Maria Usuária',
      group_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as UserType['role'],
    group_id: '',
    password: '',
  });

  const [filterRole, setFilterRole] = useState<string>('all');

  // Simulação de grupos disponíveis
  const availableGroups = [
    { id: '1', name: 'Grupo Região Norte' },
    { id: '2', name: 'Grupo Região Sul' },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      group_id: '',
      password: '',
    });
    setEditingUser(null);
  };

  const handleOpenDialog = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        group_id: user.group_id || '',
        password: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'Nome e email são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      toast({
        title: 'Erro de validação',
        description: 'Senha é obrigatória para novos usuários.',
        variant: 'destructive',
      });
      return;
    }

    if ((formData.role === 'coordinator' || formData.role === 'user') && !formData.group_id) {
      toast({
        title: 'Erro de validação',
        description: 'Coordenadores e usuários devem estar vinculados a um grupo.',
        variant: 'destructive',
      });
      return;
    }
    
    if (editingUser) {
      // Atualizar usuário existente
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              name: formData.name,
              email: formData.email,
              role: formData.role,
              group_id: formData.group_id || undefined,
              updated_at: new Date().toISOString() 
            }
          : user
      ));
      toast({
        title: 'Sucesso!',
        description: 'As informações do usuário foram atualizadas com sucesso.',
      });
    } else {
      // Criar novo usuário
      const newUser: UserType = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        group_id: formData.group_id || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      toast({
        title: 'Sucesso!',
        description: 'O novo usuário foi criado com sucesso.',
      });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: 'Sucesso!',
      description: 'O usuário foi excluído com sucesso.',
    });
  };

  const getGroupName = (groupId?: string) => {
    if (!groupId) return 'Sem grupo';
    const group = availableGroups.find(g => g.id === groupId);
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
          <p className="text-gray-600 mt-2">Gerencie os usuários do sistema</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Criar Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUser 
                  ? 'Atualize as informações do usuário.' 
                  : 'Preencha as informações para criar um novo usuário.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="exemplo@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Acesso *</Label>
                <Select value={formData.role} onValueChange={(value: UserType['role']) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de acesso" />
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
                  <Label htmlFor="group">Grupo Vinculado *</Label>
                  <Select value={formData.group_id} onValueChange={(value) => setFormData({ ...formData, group_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Digite a senha"
                    required={!editingUser}
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingUser ? 'Atualizar' : 'Criar'} Usuário
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(user)}
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
