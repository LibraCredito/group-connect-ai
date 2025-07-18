
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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

const AdminLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useSidebar();
  
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <AdminSidebar />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        state === 'collapsed' ? 'ml-16' : 'ml-64'
      }`}>
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Routes>
      {user.role === 'admin' ? (
        <>
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/groups" element={
            <ProtectedRoute requiredRole="admin">
              <GroupsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <UsersManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/news" element={
            <ProtectedRoute requiredRole="admin">
              <NewsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/materials" element={
            <ProtectedRoute requiredRole="admin">
              <MaterialsManagement />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/portal" replace />} />
          <Route path="/portal/powerbi" element={
            <ProtectedRoute>
              <PowerBI />
            </ProtectedRoute>
          } />
          <Route path="/portal/form" element={
            <ProtectedRoute>
              <FormProposal />
            </ProtectedRoute>
          } />
          <Route path="/portal/simulator" element={
            <ProtectedRoute>
              <Simulator />
            </ProtectedRoute>
          } />
          <Route path="/portal/news" element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          } />
          <Route path="/portal/materials" element={
            <ProtectedRoute>
              <Materials />
            </ProtectedRoute>
          } />
          <Route path="/portal" element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          } />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div />
      </ProtectedRoute>
    );
  }

  if (user.role === 'admin') {
    return (
      <SidebarProvider>
        <AdminLayoutContent>
          <AppRoutes />
        </AdminLayoutContent>
      </SidebarProvider>
    );
  }

  return (
    <UserPortalLayout>
      <AppRoutes />
    </UserPortalLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
