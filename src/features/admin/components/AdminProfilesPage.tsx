"use client";

import ProfilesManagement from "@/features/admin/components/ProfilesManagement";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilesPage() {
    const { checkPrivilege, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !checkPrivilege("profile", "read")) {
            router.push("/admin");
        }
    }, [loading, user, checkPrivilege, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user && !checkPrivilege("profile", "read")) {
        return <div>No tiene los permisos</div>;
    }

    return (
        <ProtectedRoute>
            <ProfilesManagement />
        </ProtectedRoute>
    );
}
