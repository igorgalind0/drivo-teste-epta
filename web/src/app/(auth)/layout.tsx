'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FullScreenLoader } from '@/components/full-screen-loader';
import { useAuth } from '@/lib/auth';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/veiculos');
  }, [status, router]);

  if (status !== 'unauthenticated') return <FullScreenLoader />;
  return children;
}