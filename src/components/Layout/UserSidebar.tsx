
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  FileText,
  Calculator,
  Newspaper,
  BookOpen,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const UserSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;

  const userMenuItems = [
    { title: 'Power BI', url: '/portal/powerbi', icon: BarChart3 },
    { title: 'Formulário de Proposta', url: '/portal/form', icon: FileText },
    { title: 'Simulador', url: '/portal/simulator', icon: Calculator },
    { title: 'Notícias', url: '/portal/news', icon: Newspaper },
    { title: 'Material de Apoio', url: '/portal/materials', icon: BookOpen },
  ];

  const coordinatorMenuItems = [
    ...userMenuItems,
    { title: 'Gestão de Usuários', url: '/portal/manage-users', icon: Users },
  ];

  const menuItems = user?.role === 'coordinator' ? coordinatorMenuItems : userMenuItems;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={`${state === 'collapsed' ? 'w-14' : 'w-64'} bg-white border-r border-gray-200`}>
      <SidebarContent>
        <div className="p-4">
          {state === 'expanded' && (
            <div>
              <h2 className="text-lg font-bold text-primary">Portal Parceiro</h2>
              <p className="text-sm text-gray-600">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        isActive(item.url)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {state === 'expanded' && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <Button
            onClick={signOut}
            variant="outline"
            className={`${state === 'collapsed' ? 'w-10 h-10 p-0' : 'w-full'} text-red-600 border-red-200 hover:bg-red-50`}
          >
            <LogOut className="h-4 w-4" />
            {state === 'expanded' && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default UserSidebar;
