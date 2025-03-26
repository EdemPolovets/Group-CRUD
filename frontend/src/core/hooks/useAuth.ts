import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/auth.service';
 
interface AuthError {
  message: string;
}
 
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
 
  useEffect(() => {
    setIsAuthenticated(!!AuthService.getToken());
    setIsLoading(false);
  }, []);
 
  const handleAuthError = useCallback((err: unknown) => {
    setError({ message: err instanceof Error ? err.message : 'Authentication failed' });
  }, []);
 
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.login({ email, password });
      setIsAuthenticated(true);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);
 
  const register = useCallback(async (email: string, password: string, username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.register({ email, password, username });
      setIsAuthenticated(true);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);
 
  const logout = useCallback(() => {
    AuthService.removeToken();
    setIsAuthenticated(false);
    setError(null);
    window.location.reload();
  }, []);
 
  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
