
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthContextType } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: error.message || 'Credenciais inválidas',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        },
      });

      if (error) throw error;

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Verificação de email pode ser necessária.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Erro ao criar conta',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate('/', { replace: true });
      
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro no logout',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const validRoles = ['admin', 'coordinator', 'user'] as const;
            const userRole = validRoles.includes(profile.role as any) ? profile.role as 'admin' | 'coordinator' | 'user' : 'user';
            
            const userData = {
              id: profile.id,
              email: session.user.email!,
              name: profile.name,
              role: userRole,
              group_id: profile.group_id,
              created_at: profile.created_at,
              updated_at: profile.updated_at,
            };

            setUser(userData);

            // Redirecionamento simples e direto
            if (userRole === 'admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate('/portal', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const validRoles = ['admin', 'coordinator', 'user'] as const;
            const userRole = validRoles.includes(profile.role as any) ? profile.role as 'admin' | 'coordinator' | 'user' : 'user';
            
            const userData = {
              id: profile.id,
              email: session.user.email!,
              name: profile.name,
              role: userRole,
              group_id: profile.group_id,
              created_at: profile.created_at,
              updated_at: profile.updated_at,
            };

            setUser(userData);
          }
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
        }
      }
      
      setLoading(false);
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
