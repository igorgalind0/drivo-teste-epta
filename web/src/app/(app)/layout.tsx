'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { FullScreenLoader } from '@/components/full-screen-loader';
import { useAuth } from '@/lib/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status !== 'authenticated') return <FullScreenLoader />;

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader />
      {children}
    </div>
  );
}