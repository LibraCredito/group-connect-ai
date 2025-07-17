
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import LoginForm from "@/components/LoginForm";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import UserSidebar from "@/components/Layout/UserSidebar";
import Header from "@/components/Layout/Header";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import GroupsManagement from "@/pages/admin/GroupsManagement";
import PowerBI from "@/pages/portal/PowerBI";
import FormProposal from "@/pages/portal/FormProposal";
import Simulator from "@/pages/portal/Simulator";
import News from "@/pages/portal/News";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const isAdmin = user.role === 'admin';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {isAdmin ? <AdminSidebar /> : <UserSidebar />}
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Routes>
      {user.role === 'admin' ? (
        <>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/groups" element={<GroupsManagement />} />
          <Route path="/admin/users" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestão de Usuários - Em desenvolvimento</h1></div>} />
          <Route path="/admin/news" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestão de Notícias - Em desenvolvimento</h1></div>} />
          <Route path="/admin/materials" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestão de Materiais - Em desenvolvimento</h1></div>} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </>
      ) : (
        <>
          <Route path="/portal/powerbi" element={<PowerBI />} />
          <Route path="/portal/form" element={<FormProposal />} />
          <Route path="/portal/simulator" element={<Simulator />} />
          <Route path="/portal/news" element={<News />} />
          <Route path="/portal/materials" element={<div className="p-6"><h1 className="text-2xl font-bold">Material de Apoio - Em desenvolvimento</h1></div>} />
          {user.role === 'coordinator' && (
            <Route path="/portal/manage-users" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestão de Usuários do Grupo - Em desenvolvimento</h1></div>} />
          )}
          <Route path="/" element={<Navigate to="/portal/powerbi" replace />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProtectedLayout>
            <AppRoutes />
          </ProtectedLayout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
