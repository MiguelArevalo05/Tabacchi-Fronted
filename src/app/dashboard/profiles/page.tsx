"use client";

import ProfilesManagement from "@/app/components/templates/profiles-management";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilesPage() {
    const { checkPrivilege, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user && !checkPrivilege("profile", "read")) {
            router.push("/dashboard/main");
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
