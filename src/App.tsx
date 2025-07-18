
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
import PublicLayout from './components/Layout/PublicLayout';
import AdminLayout from './components/Layout/AdminLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
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
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <UsersManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/groups" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <GroupsManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/news" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <NewsManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/materials" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <MaterialsManagement />
              </AdminLayout>
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
      </AuthProvider>
    </Router>
  );
}

export default App;
