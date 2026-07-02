'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

import {
  clearAuthToken,
  getAuthProfile,
  getErrorMessage,
  loginUser,
  registerUnauthorizedHandler,
  registerUser,
  saveAuthToken,
  type AuthProfile,
} from '@/features/auth/services/authService';
import { getPostLoginRedirect, isAdminUser } from '@/features/auth/utils/auth';

interface AuthContextType {
  user: AuthProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkPrivilege: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkPrivilege = useCallback((module: string, action: string): boolean => {
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    return (
      user.profiles?.some((profile) =>
        profile.privileges?.some(
          (privilege) => privilege.module === module && privilege.action === action
        )
      ) ?? false
    );
  }, [user]);

  const refreshUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await getAuthProfile();
      setUser(userData);
    } catch {
      clearAuthToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
    });

    return () => registerUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          return;
        }

        const userData = await getAuthProfile();
        setUser(userData);
      } catch {
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, redirectTo?: string) => {
    try {
      const data = await loginUser(email, password);
      setUser(data.user);

      if (data.access_token) {
        saveAuthToken(data.access_token);
      }

      router.push(getPostLoginRedirect(data.user, redirectTo));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Credenciales inválidas'),
      };
    }
  }, [router]);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      await registerUser(email, password, fullName);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Error al registrar'),
      };
    }
  }, []);

  const logout = useCallback(async () => {
    clearAuthToken();
    setUser(null);
    router.push('/login');
  }, [router]);

  const isAdmin = useMemo(() => isAdminUser(user), [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      login,
      register,
      logout,
      refreshUser,
      checkPrivilege,
    }),
    [user, loading, isAdmin, login, register, logout, refreshUser, checkPrivilege]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
