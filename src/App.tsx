import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Pipeline } from './components/Pipeline';
import { Dashboard } from './components/Dashboard';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GitBranch, LogOut, LayoutDashboard, GitMerge } from 'lucide-react';
import { useAuthStore } from './store/auth';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import { Link, useLocation } from 'react-router-dom';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      )}
    >
      {children}
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <GitBranch className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-slate-800">Sales Pipeline Manager</h1>
              </div>
              
              <nav className="flex items-center gap-2">
                <NavLink to="/">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/pipeline">
                  <GitMerge className="h-4 w-4" />
                  Pipeline
                </NavLink>
              </nav>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pipeline"
          element={
            <ProtectedRoute>
              <Layout>
                <Pipeline />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;