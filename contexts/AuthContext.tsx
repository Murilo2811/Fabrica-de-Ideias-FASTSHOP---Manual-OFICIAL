import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { loginUser, registerUser } from '../services/googleSheetService';
import type { User } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

interface Session {
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useLocalStorage<Session>('session', { user: null, token: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthSuccess = (data: AuthResponse) => {
    setSession({ user: data.user, token: data.token });
    setError(null);
  };
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loginUser(email, password);
      handleAuthSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await registerUser(name, email, password);
      handleAuthSuccess(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no registro.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setSession({ user: null, token: null });
    // Opcional: Chamar um endpoint de logout no backend para invalidar o token no servidor.
  };

  const value = useMemo(() => ({
    user: session.user,
    isAuthenticated: !!session.token,
    login,
    register,
    logout,
    isLoading,
    error,
  }), [session, isLoading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
