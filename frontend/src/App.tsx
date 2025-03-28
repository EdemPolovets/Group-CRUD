import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { TodoApp } from './features/todos/components/TodoApp';
import { AuthSwitcher } from './features/auth/components/AuthSwitcher';
import { useAuth } from './core/hooks/useAuth';
import { AuthLayout } from './shared/layouts/AuthLayout';
import { ErrorMessage } from './shared/components/ErrorMessage';
import { queryClient } from './core/config/query';

const App: React.FC = () => {
  const { isAuthenticated, error, login, register } = useAuth();

  const handleAuth = async (email: string, password: string, isSignUp: boolean, username?: string) => {
    if (isSignUp && username) {
      await register(email, password, username);
    } else {
      await login(email, password);
    }
  };

  // Render authenticated app with React Query provider
  if (isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TodoApp />
      </QueryClientProvider>
    );
  }

  // Render auth screen
  return (
    <AuthLayout>
      {error && <ErrorMessage message={error.message} />}
      <AuthSwitcher onSubmit={handleAuth} />
    </AuthLayout>
  );
};

export default App;