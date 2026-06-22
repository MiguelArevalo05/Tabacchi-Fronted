"use client";

import PrivilegesManagement from '@/features/admin/components/PrivilegesManagement';
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PrivilegesPage() {
    const { checkPrivilege, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !checkPrivilege('privilege', 'read')) {
            router.push('/admin');
        }
    }, [loading, user, checkPrivilege, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user && !checkPrivilege('privilege', 'read')) {
        return <div>No tiene los permisos</div>;
    }

    return (
        <ProtectedRoute>
            <PrivilegesManagement />
        </ProtectedRoute>
    );
}
