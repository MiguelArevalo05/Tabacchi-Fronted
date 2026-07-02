'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import LoginTemplate from '@/features/auth/components/LoginTemplate';

function LoginContent() {
    const { login, loading } = useAuth();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/landing';

    const handleLogin = (email: string, password: string) =>
        login(email, password, redirectTo);

    return (
        <LoginTemplate
            onLogin={handleLogin}
            loading={loading}
            redirectTo={redirectTo}
        />
    );
}

const LoginPage = () => (
    <Suspense fallback={null}>
        <LoginContent />
    </Suspense>
);

export default LoginPage;