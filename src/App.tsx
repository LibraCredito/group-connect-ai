
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import GroupsManagement from './pages/admin/GroupsManagement';
import NewsManagement from './pages/admin/NewsManagement';
import MaterialsManagement from './pages/admin/MaterialsManagement';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserPortalLayout from './components/Layout/UserPortalLayout';
import AdminSidebar from './components/Layout/AdminSidebar';
import Header from './components/Layout/Header';
import PublicLayout from './components/Layout/PublicLayout';
import { SidebarProvider } from '@/components/ui/sidebar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <PublicLayout>
              <Index />
            </PublicLayout>
          } />
          <Route path="/login" element={
            <PublicLayout>
              <Index />
            </PublicLayout>
          } />
          <Route path="/register" element={
            <PublicLayout>
              <Index />
            </PublicLayout>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <SidebarProvider>
                <div className="flex h-screen bg-gray-50">
                  <AdminSidebar />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-auto">
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/users" element={<UsersManagement />} />
                        <Route path="/groups" element={<GroupsManagement />} />
                        <Route path="/news" element={<NewsManagement />} />
                        <Route path="/materials" element={<MaterialsManagement />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />

          {/* Portal Routes */}
          <Route path="/portal/*" element={
            <ProtectedRoute>
              <UserPortalLayout />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
