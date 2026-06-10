'use client';

import { redirect } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      redirect(user ? '/landing' : '/landing');
    }
  }, [user, loading]);

  return <div>Cargando...</div>;
}