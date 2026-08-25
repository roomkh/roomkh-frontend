import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../features/auth/services/authService';

export const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem('auth_user');
    return null;
  }
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('access_token')));

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem('auth_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      persistUser(null);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      persistUser(currentUser?.user || currentUser);
      return currentUser;
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
    async (credentials) => {
      const authData = await loginUser(credentials);
      const nextUser = authData?.user || authData?.account || null;

      if (nextUser) {
        persistUser(nextUser);
      } else {
        await refreshUser();
      }

      return authData;
    },
    [persistUser, refreshUser]
  );

  const register = useCallback(
    async (userData) => {
      const authData = await registerUser(userData);
      const nextUser = authData?.user || authData?.account || null;

      if (nextUser) {
        persistUser(nextUser);
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

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user || localStorage.getItem('access_token')),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
