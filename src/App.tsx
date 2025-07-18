
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserPortalLayout from './components/Layout/UserPortalLayout';
import PublicLayout from './components/Layout/PublicLayout';

// Componentes administrativos
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Users } from './pages/admin/Users';
import { Groups } from './pages/admin/Groups';
import { News } from './pages/admin/News';
import { Materials } from './pages/admin/Materials';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
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
          
          {/* Rotas administrativas */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/groups" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Groups />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/news" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <News />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/materials" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Materials />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* Portal do usuário */}
          <Route path="/portal/*" element={
            <ProtectedRoute>
              <UserPortalLayout />
            </ProtectedRoute>
          } />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
