'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Providers({ children }: { children: React.ReactNode }) {
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
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
} 