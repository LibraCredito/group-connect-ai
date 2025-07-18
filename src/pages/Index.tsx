
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/auth/AuthForm';

const Index = () => {
  const { user, loading } = useAuth();

  console.log('Index - user:', user?.id, 'loading:', loading, 'role:', user?.role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  // Redirecionar baseado no papel do usuário
  if (user.role === 'admin') {
    console.log('Redirecionando admin para /admin');
    return <Navigate to="/admin" replace />;
  } else {
    console.log('Redirecionando usuário para /portal');
    return <Navigate to="/portal" replace />;
  }
};

export default Index;
