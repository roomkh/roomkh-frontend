import { createContext, useCallback, useEffect, useMemo, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import {
  getCurrentUser,
  googleLogin as googleLoginApi,
  loginUser,
  logoutUser,
  registerUser,
} from '../features/auth/services/authService';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from '../types';

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  googleLogin: (credential: string) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<AuthResponse | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  } catch {
    localStorage.removeItem('auth_user');
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [loading, setLoading] = useState<boolean>(
    Boolean(localStorage.getItem('access_token'))
  );

  const persistUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem('auth_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<AuthResponse | null> => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      persistUser(null);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      const nextUser = (currentUser as User) || null;
      persistUser(nextUser);
      return currentUser as unknown as AuthResponse;
    } catch {
      logoutUser();
      persistUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const authData = await loginUser(credentials);
      const nextUser =
        (authData as AuthResponse)?.user ||
        (authData as AuthResponse)?.account ||
        null;

      if (nextUser) {
        persistUser(nextUser as User | null);
      } else {
        await refreshUser();
      }

      return authData;
    },
    [persistUser, refreshUser]
  );

  const googleLogin = useCallback(
    async (credential: string): Promise<AuthResponse> => {
      const authData = await googleLoginApi(credential);
      const nextUser =
        (authData as AuthResponse)?.user ||
        (authData as AuthResponse)?.account ||
        null;

      if (nextUser) {
        persistUser(nextUser as User | null);
      } else {
        await refreshUser();
      }

      return authData;
    },
    [persistUser, refreshUser]
  );

  const register = useCallback(
    async (userData: RegisterData): Promise<AuthResponse> => {
      const authData = await registerUser(userData);
      const nextUser =
        (authData as AuthResponse)?.user ||
        (authData as AuthResponse)?.account ||
        null;

      if (nextUser) {
        persistUser(nextUser as User | null);
      } else if (localStorage.getItem('access_token')) {
        await refreshUser();
      }

      return authData;
    },
    [persistUser, refreshUser]
  );

  const logout = useCallback(() => {
    logoutUser();
    persistUser(null);
  }, [persistUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user || localStorage.getItem('access_token')),
      login,
      register,
      googleLogin,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, googleLogin, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
