
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
    <div className={`${state === 'collapsed' ? 'w-16' : 'w-64'} libra-sidebar bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col h-screen fixed left-0 top-0 z-50`}>
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-sidebar min-h-[64px]">
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors flex-shrink-0"
          title={state === 'collapsed' ? 'Expandir menu' : 'Recolher menu'}
        >
          {state === 'collapsed' ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        {state === 'expanded' && (
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-primary truncate">Libra Admin</h2>
              <p className="text-xs text-muted-foreground truncate">Painel de Controle</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Menu content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {state === 'expanded' && (
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Menu Principal
            </div>
          )}
          
          <nav className="space-y-1">
            {adminMenuItems.map((item) => (
              <div key={item.title} className="relative">
                <NavLink
                  to={item.url}
                  end={item.url === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg transition-all duration-200 group relative ${
                      state === 'collapsed' 
                        ? 'justify-center p-3 w-12 h-12 mx-auto' 
                        : 'space-x-3 px-3 py-3'
                    } ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`
                  }
                  title={state === 'collapsed' ? item.title : undefined}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive(item.url) ? 'text-white' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'}`} />
                  {state === 'expanded' && (
                    <span className="font-medium truncate">{item.title}</span>
                  )}
                </NavLink>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer with logout button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={signOut}
          variant="ghost"
          className={`${
            state === 'collapsed' 
              ? 'w-10 h-10 p-0 mx-auto' 
              : 'w-full justify-start'
          } text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200`}
          title={state === 'collapsed' ? 'Sair' : undefined}
        >
          <LogOut className="h-4 w-4" />
          {state === 'expanded' && <span className="ml-3 font-medium">Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
