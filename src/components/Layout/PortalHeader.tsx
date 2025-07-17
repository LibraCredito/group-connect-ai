
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const PortalHeader = () => {
  const { user } = useAuth();

  return (
    <header className="libra-header h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <img 
            src="https://www.libracredito.com.br/images/site/logo-libra-credito.png" 
            alt="Libra Crédito"
            className="h-8 w-auto"
          />
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-primary">
            Portal do Parceiro
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{user?.name}</span>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize border border-primary/20">
            {user?.role}
          </span>
        </div>
        
        <Button
          onClick={signOut}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-primary hover:bg-primary/10 rounded-xl"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Sair</span>
        </Button>
      </div>
    </header>
  );
};

export default PortalHeader;
