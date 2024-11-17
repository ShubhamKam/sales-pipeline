import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}