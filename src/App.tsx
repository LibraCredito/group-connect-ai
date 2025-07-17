
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import LoginForm from "@/components/LoginForm";
import AdminSidebar from "@/components/Layout/AdminSidebar";
import UserPortalLayout from "@/components/Layout/UserPortalLayout";
import Header from "@/components/Layout/Header";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import GroupsManagement from "@/pages/admin/GroupsManagement";
import UsersManagement from "@/pages/admin/UsersManagement";
import NewsManagement from "@/pages/admin/NewsManagement";
import MaterialsManagement from "@/pages/admin/MaterialsManagement";
import PowerBI from "@/pages/portal/PowerBI";
import FormProposal from "@/pages/portal/FormProposal";
import Simulator from "@/pages/portal/Simulator";
import News from "@/pages/portal/News";
import Materials from "@/pages/portal/Materials";
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

  if (isAdmin) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return <UserPortalLayout />;
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
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/news" element={<NewsManagement />} />
          <Route path="/admin/materials" element={<MaterialsManagement />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/portal" replace />} />
          <Route path="/portal/*" element={<div />} />
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
