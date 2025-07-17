
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@portal.com', role: 'Administrador', description: 'Acesso total ao sistema' },
    { email: 'coord@portal.com', role: 'Coordenador', description: 'Gestão do grupo' },
    { email: 'user@portal.com', role: 'Usuário', description: 'Acesso ao portal' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="libra-card shadow-xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-6 text-center">
            <div className="mx-auto">
              <img 
                src="https://www.libracredito.com.br/images/site/logo-libra-credito.png" 
                alt="Libra Crédito"
                className="h-12 w-auto mx-auto mb-4"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">Portal de Gestão</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Sistema de Gestão de Parceiros
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full libra-button transition-all duration-200 font-medium"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="text-sm text-gray-600 font-medium">Contas de demonstração:</div>
              {demoAccounts.map((account) => (
                <div
                  key={account.email}
                  className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-primary/5 transition-colors border hover:border-primary/20"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('123456');
                  }}
                >
                  <div className="font-medium text-sm text-gray-900">{account.email}</div>
                  <div className="text-xs text-gray-600">{account.role} - {account.description}</div>
                  <div className="text-xs text-primary mt-1 font-medium">Senha: 123456</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
