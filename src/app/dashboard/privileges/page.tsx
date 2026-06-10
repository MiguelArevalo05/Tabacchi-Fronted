"use client";

import PrivilegesManagement from '@/app/components/templates/privileges-management';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PrivilegesPage() {
    const { checkPrivilege, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !checkPrivilege('privilege', 'read')) {
            router.push('/dashboard/main');
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
