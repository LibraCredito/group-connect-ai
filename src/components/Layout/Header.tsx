
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-900">
            {user?.role === 'admin' ? 'Painel Administrativo' : 'Portal do Parceiro'}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{user?.name}</span>
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">
            {user?.role}
          </span>
        </div>
        
        <Button
          onClick={signOut}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Sair</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
