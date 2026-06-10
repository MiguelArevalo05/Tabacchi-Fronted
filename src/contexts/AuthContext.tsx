'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getPostLoginRedirect, isAdminUser } from '@/lib/auth';

interface User {
    id: string;
    email: string;
    fullName?: string;
    isActive?: boolean;
    isSuperAdmin?: boolean;
    profiles?: Profile[];
}

interface Profile {
    id: string;
    name: string;
    description: string;
    privileges?: Privilege[];
}

interface Privilege {
    id: string;
    module: string;
    action: string;
    description?: string;
    isActive?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string, redirectTo?: string) => Promise<{ success: boolean; message?: string }>;
    register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    checkPrivilege: (module: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const checkPrivilege = (module: string, action: string): boolean => {
        if (!user) return false;
        if (user.isSuperAdmin) return true;

        return user.profiles?.some(profile =>
            profile.privileges?.some(
                priv => priv.module === module && priv.action === action
            )
        ) || false;
    };

    // ✅ Verificar autenticación al iniciar
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const userData: User = await response.json();
                    setUser(userData);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } catch (err) {
                console.error('Error checking auth:', err);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // ✅ Login
    const login = async (email: string, password: string, redirectTo?: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                }
                router.push(getPostLoginRedirect(data.user, redirectTo));
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'Credenciales inválidas' };
            }
        } catch {
            return { success: false, message: 'Error de conexión' };
        }
    };

    // ✅ Register
    const register = async (email: string, password: string, fullName: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName }),
            });

            if (response.ok) {
                return { success: true };
            }
            const errorData = await response.json();
            const message = Array.isArray(errorData.message)
                ? errorData.message.join(', ')
                : errorData.message || 'Error al registrar';
            return { success: false, message };
        } catch {
            return { success: false, message: 'Error de conexión' };
        }
    };

    // ✅ Logout
    const logout = async () => {
        try {
            localStorage.removeItem('token');
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const isAdmin = useMemo(() => isAdminUser(user), [user]);

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout, checkPrivilege }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
