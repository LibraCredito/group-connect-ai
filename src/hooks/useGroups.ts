
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Group } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups' as any)
        .select(`
          *,
          coordinator:coordinator_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setGroups(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar grupos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('groups' as any)
        .insert([groupData as any])
        .select()
        .single();

      if (error) throw error;

      setGroups(prev => [data, ...prev]);
      
      toast({
        title: 'Grupo criado',
        description: 'O grupo foi criado com sucesso.',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Erro ao criar grupo',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateGroup = async (groupId: string, updates: Partial<Group>) => {
    try {
      const { error } = await supabase
        .from('groups' as any)
        .update(updates as any)
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.map(group => 
        group.id === groupId ? { ...group, ...updates } : group
      ));

      toast({
        title: 'Grupo atualizado',
        description: 'As informações foram atualizadas com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar grupo',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('groups' as any)
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setGroups(prev => prev.filter(group => group.id !== groupId));
      
      toast({
        title: 'Grupo removido',
        description: 'O grupo foi removido com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover grupo',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
  };
};
