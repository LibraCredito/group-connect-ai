
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const AdminHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold">Painel Administrativo</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm">{user?.name}</span>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
            {user?.role === 'admin' ? 'Administrador' : user?.role}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
};
