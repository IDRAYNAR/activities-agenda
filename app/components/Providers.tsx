'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Providers({ 
  children,
  session
}: { 
  children: React.ReactNode;
  session: SessionProviderProps['session'];
}) {
  const router = useRouter();

  useEffect(() => {
    // Force un rafraîchissement complet lors d'un changement de route
    const handleRouteChange = () => {
      router.refresh();
    };

    window.addEventListener('emailUpdated', handleRouteChange);
    return () => {
      window.removeEventListener('emailUpdated', handleRouteChange);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
} 