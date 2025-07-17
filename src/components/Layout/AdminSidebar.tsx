
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
  LayoutDashboard,
  Users,
  Building2,
  Newspaper,
  FileText,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const adminMenuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Grupos', url: '/admin/groups', icon: Building2 },
  { title: 'Usuários', url: '/admin/users', icon: Users },
  { title: 'Notícias', url: '/admin/news', icon: Newspaper },
  { title: 'Material de Apoio', url: '/admin/materials', icon: FileText },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={`${state === 'collapsed' ? 'w-14' : 'w-64'} bg-white border-r border-gray-200`}>
      <SidebarContent>
        <div className="p-4">
          {state === 'expanded' && (
            <h2 className="text-lg font-bold text-primary">Painel Admin</h2>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
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

export default AdminSidebar;
