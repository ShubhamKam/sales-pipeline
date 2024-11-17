import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GitBranch } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuthStore();
  const [isRegister, setIsRegister] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: '',
  });

  React.useEffect(() => {
    // Set demo credentials
    setFormData({
      email: 'demo@example.com',
      password: 'demo123',
      name: '',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isRegister) {
        await register(formData.email, formData.password, formData.name);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white px-8 py-12 shadow-lg rounded-xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Pipeline Manager</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={isRegister}
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
            </Button>

            <p className="text-center text-sm text-slate-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-600 hover:underline"
              >
                {isRegister ? 'Login' : 'Register'}
              </button>
            </p>

            {!isRegister && (
              <p className="text-center text-sm text-slate-500">
                Demo credentials are pre-filled. Just click Login!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}