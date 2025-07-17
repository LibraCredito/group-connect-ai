
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
  Menu,
  ChevronLeft,
  ChevronRight,
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
  const { state, toggleSidebar } = useSidebar();
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
    <Sidebar className={`${state === 'collapsed' ? 'w-16' : 'w-64'} libra-sidebar`}>
      <SidebarContent>
        {/* Toggle Button fixo no topo */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors"
            title={state === 'collapsed' ? 'Expandir menu' : 'Recolher menu'}
          >
            {state === 'collapsed' ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          
          {state === 'expanded' && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Libra Admin</h2>
                <p className="text-xs text-muted-foreground">Painel de Controle</p>
              </div>
            </div>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-primary text-white shadow-md'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`
                      }
                      title={state === 'collapsed' ? item.title : undefined}
                    >
                      <item.icon className={`h-5 w-5 ${isActive(item.url) ? 'text-white' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'}`} />
                      {state === 'expanded' && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            onClick={signOut}
            variant="ghost"
            className={`${
              state === 'collapsed' 
                ? 'w-10 h-10 p-0' 
                : 'w-full justify-start'
            } text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200`}
            title={state === 'collapsed' ? 'Sair' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {state === 'expanded' && <span className="ml-3 font-medium">Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
